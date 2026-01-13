import { logger, metadata, task } from "@trigger.dev/sdk/v3";
import { CREDIT_COSTS, deductCredits } from "@/lib/credits";
import {
  getImageGenerationById,
  updateImageGeneration,
  updateProjectCounts,
} from "@/lib/db/queries";
import { fal, NANO_BANANA_PRO_EDIT, type NanoBananaProOutput } from "@/lib/fal";
import {
  getExtensionFromContentType,
  getImagePath,
  uploadImage,
} from "@/lib/supabase";

export interface ProcessImagePayload {
  imageId: string;
}

export interface ProcessImageStatus {
  step:
    | "fetching"
    | "uploading"
    | "processing"
    | "saving"
    | "completed"
    | "failed";
  label: string;
  progress?: number;
}

export const processImageTask = task({
  id: "process-image",
  maxDuration: 300, // 5 minutes
  retry: {
    maxAttempts: 3,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10_000,
    factor: 2,
  },
  run: async (payload: ProcessImagePayload) => {
    const { imageId } = payload;

    try {
      // Step 1: Fetch image record
      metadata.set("status", {
        step: "fetching",
        label: "Loading image…",
        progress: 10,
      } satisfies ProcessImageStatus);

      logger.info("Fetching image record", { imageId });

      const image = await getImageGenerationById(imageId);
      if (!image) {
        throw new Error(`Image not found: ${imageId}`);
      }

      // Skip if already completed
      if (image.status === "completed") {
        logger.info("Image already processed, skipping", { imageId });
        metadata.set("status", {
          step: "completed",
          label: "Already processed",
          progress: 100,
        } satisfies ProcessImageStatus);
        return { success: true, message: "Already processed" };
      }

      // Update status to processing
      await updateImageGeneration(imageId, { status: "processing" });

      // Step 2: Upload to Fal.ai storage
      metadata.set("status", {
        step: "uploading",
        label: "Preparing for AI…",
        progress: 25,
      } satisfies ProcessImageStatus);

      logger.info("Fetching original image", {
        imageId,
        originalImageUrl: image.originalImageUrl,
      });

      const imageResponse = await fetch(image.originalImageUrl);
      if (!imageResponse.ok) {
        throw new Error(
          `Failed to fetch original image: ${imageResponse.status}`
        );
      }

      const imageBlob = await imageResponse.blob();
      const falImageUrl = await fal.storage.upload(
        new File([imageBlob], "input.jpg", { type: imageBlob.type })
      );

      logger.info("Uploaded to Fal.ai storage", { falImageUrl });

      // Step 3: Call Fal.ai API
      metadata.set("status", {
        step: "processing",
        label: "Enhancing image…",
        progress: 50,
      } satisfies ProcessImageStatus);

      const resultImageUrl = await executeFalRequest(
        imageId,
        image.prompt,
        falImageUrl,
        (image.metadata as Record<string, any>) || {}
      );

      // Step 4: Save to Supabase
      metadata.set("status", {
        step: "saving",
        label: "Saving result…",
        progress: 80,
      } satisfies ProcessImageStatus);

      logger.info("Downloading result image", { resultImageUrl });

      const resultImageResponse = await fetch(resultImageUrl);
      if (!resultImageResponse.ok) {
        throw new Error("Failed to download result image");
      }

      const resultImageBuffer = await resultImageResponse.arrayBuffer();
      // Use a consistent default if content-type is missing, though executeFalRequest ensures URL exists
      const contentType = "image/webp";
      const extension = getExtensionFromContentType(contentType);

      const resultPath = getImagePath(
        image.workspaceId,
        image.projectId,
        `${imageId}.${extension}`,
        "result"
      );

      logger.info("Uploading to Supabase", { resultPath });

      const storedResultUrl = await uploadImage(
        new Uint8Array(resultImageBuffer),
        resultPath,
        contentType
      );

      // Update image record with result
      await updateImageGeneration(imageId, {
        status: "completed",
        resultImageUrl: storedResultUrl,
        errorMessage: null,
      });

      // Update project counts
      await updateProjectCounts(image.projectId);

      // Deduct 1 credit for successful image generation (idempotency built-in)
      try {
        const newBalance = await deductCredits({
          workspaceId: image.workspaceId,
          amount: CREDIT_COSTS.IMAGE_GENERATION,
          description: `Image generation: ${imageId}`,
          imageGenerationId: imageId,
        });
        if (newBalance !== null) {
          logger.info("Deducted credit for image generation", {
            imageId,
            newBalance,
          });
        }
      } catch (creditError) {
        // Log but don't fail the task if credit deduction fails
        logger.error("Failed to deduct credit", {
          imageId,
          error:
            creditError instanceof Error
              ? creditError.message
              : "Unknown error",
        });
      }

      metadata.set("status", {
        step: "completed",
        label: "Complete",
        progress: 100,
      } satisfies ProcessImageStatus);

      logger.info("Image processing completed", {
        imageId,
        resultUrl: storedResultUrl,
      });

      return {
        success: true,
        resultUrl: storedResultUrl,
        imageId,
      };
    } catch (error) {
      logger.error("Image processing failed", {
        imageId,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      metadata.set("status", {
        step: "failed",
        label: "Processing failed",
        progress: 0,
      } satisfies ProcessImageStatus);

      // Update status to failed
      await updateImageGeneration(imageId, {
        status: "failed",
        errorMessage:
          error instanceof Error ? error.message : "Processing failed",
      });

      // Get image to update project counts
      const image = await getImageGenerationById(imageId);
      if (image) {
        await updateProjectCounts(image.projectId);
      }

      throw error;
    }
  },
});

/**
 * Helper to handle the idempotent execution of Fal.ai requests.
 * Checks for existing IDs, manages submitting vs polling, and handles error recovery.
 */
async function executeFalRequest(
  imageId: string,
  prompt: string,
  falImageUrl: string,
  metadataRecord: Record<string, any>
): Promise<string> {
  const requestId = metadataRecord.fal_request_id as string | undefined;
  let activeRequestId = requestId;

  try {
    let result: NanoBananaProOutput;

    if (activeRequestId) {
      logger.info("Resuming existing Fal.ai request", {
        requestId: activeRequestId,
      });
      // Poll for result using the request ID
      result = (await fal.queue.result(NANO_BANANA_PRO_EDIT, {
        requestId: activeRequestId,
      })) as unknown as NanoBananaProOutput;
    } else {
      logger.info("Calling Fal.ai Nano Banana Pro", { imageId, prompt });

      // Use subscribe for the initial request to handle the "submit -> poll" handover reliably
      // This prevents "Bad Request" errors that happen when polling too fast after submit
      result = (await fal.subscribe(NANO_BANANA_PRO_EDIT, {
        input: {
          prompt,
          image_urls: [falImageUrl],
          num_images: 1,
          aspect_ratio: "auto",
          resolution: "2K",
          output_format: "webp",
        },
        logs: true,
        onQueueUpdate: async (update) => {
          if (update.request_id && update.request_id !== activeRequestId) {
            activeRequestId = update.request_id;
            logger.info("Fal.ai request started", {
              requestId: activeRequestId,
            });

            // Save request ID asynchronously to preserve it for retries in case of timeout
            try {
              await updateImageGeneration(imageId, {
                metadata: {
                  ...metadataRecord,
                  fal_request_id: activeRequestId,
                },
              });
            } catch (dbError) {
              // Non-fatal, just log. If we fail to save, we might double-gen on retry, but main flow works.
              logger.error("Failed to save request ID", {
                requestId: activeRequestId,
                error: dbError instanceof Error ? dbError.message : "Db error",
              });
            }
          }
        },
      })) as unknown as NanoBananaProOutput;
    }

    logger.info("Fal.ai result received", { result });

    const output = (result as { data?: NanoBananaProOutput }).data || result;
    if (!output.images?.[0]?.url) {
      throw new Error("No image returned from Fal.ai");
    }

    return output.images[0].url;
  } catch (error) {
    // Smart Recovery: Check if the request failed irrecoverably
    await handleFalError(imageId, activeRequestId, error);
    throw error;
  }
}

/**
 * Checks Fal.ai status on error. If the request definitely failed, clearing the ID allows a fresh retry.
 */
async function handleFalError(
  imageId: string,
  requestId: string | undefined,
  originalError: unknown
) {
  if (!requestId) return;

  try {
    logger.info("Check status of failed request", { requestId });
    const status = await fal.queue.status(NANO_BANANA_PRO_EDIT, {
      requestId,
      logs: true,
    });

    const statusStr = (status as any).status;

    // If failed on their end, clear ID to allow retry
    if (statusStr === "FAILED" || statusStr === "falsy_failed") {
      logger.info("Request failed on Fal, clearing ID", { requestId });
      const currentImage = await getImageGenerationById(imageId);
      const currentMeta = (currentImage?.metadata as Record<string, any>) || {};

      await updateImageGeneration(imageId, {
        metadata: { ...currentMeta, fal_request_id: null },
      });
    }
  } catch (checkError) {
    logger.warn("Failed to check status, clearing ID to be safe", { requestId });
    // If we can't check status, better to retry fresh
    const currentImage = await getImageGenerationById(imageId);
    const currentMeta = (currentImage?.metadata as Record<string, any>) || {};
    await updateImageGeneration(imageId, {
      metadata: { ...currentMeta, fal_request_id: null },
    });
  }
}
