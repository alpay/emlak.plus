import { fal } from "@/lib/fal";

type Logger = {
  info: (message: string, properties?: Record<string, any>) => void;
  error: (message: string, properties?: Record<string, any>) => void;
  warn: (message: string, properties?: Record<string, any>) => void;
};

/**
 * Executes a Fal.ai request idempotently.
 *
 * 1. Checks if we're resuming (existingRequestId provided).
 * 2. If new, calls `fal.subscribe` and invokes `onRequestIdReceived` immediately.
 * 3. Takes `onRequestIdReceived` callback to let the caller save the ID to their specific DB table.
 * 4. Handles errors by checking status; allows caller to clear ID via `onClearRequestId` if failed.
 */
export async function executeFalIdempotentRequest<Output = any>(
  endpoint: string,
  input: any,
  existingRequestId: string | undefined,
  callbacks: {
    onRequestIdReceived: (requestId: string) => Promise<void>;
    onClearRequestId: () => Promise<void>;
  },
  logger: Logger,
  label = "Fal.ai"
): Promise<Output> {
  let activeRequestId = existingRequestId;

  try {
    let result: Output;

    if (activeRequestId) {
      logger.info(`Resuming existing ${label} request`, {
        requestId: activeRequestId,
      });
      // Resume polling
      result = (await fal.queue.result(endpoint, {
        requestId: activeRequestId,
      })) as unknown as Output;
    } else {
      logger.info(`Calling ${label} (New Request)`, { endpoint });

      // Start new request with subscribe
      result = (await fal.subscribe(endpoint, {
        input,
        logs: true,
        onQueueUpdate: async (update) => {
          if (update.request_id && update.request_id !== activeRequestId) {
            activeRequestId = update.request_id;
            logger.info(`${label} request started`, {
              requestId: activeRequestId,
            });

            // Save ID immediately
            try {
              await callbacks.onRequestIdReceived(activeRequestId);
            } catch (dbError) {
              logger.error(`Failed to save ${label} request ID`, {
                requestId: activeRequestId,
                error: dbError instanceof Error ? dbError.message : "Db error",
              });
            }
          }
        },
      })) as unknown as Output;
    }

    logger.info(`${label} result received`, { result });
    return result;
  } catch (error) {
    // Smart Recovery
    if (activeRequestId) {
      try {
        logger.info(`Checking status of failed ${label} request`, {
          requestId: activeRequestId,
        });
        const status = await fal.queue.status(endpoint, {
          requestId: activeRequestId,
          logs: true,
        });

        const statusStr = (status as any).status;

        // If explicitly failed, clear ID to allow fresh retry
        if (statusStr === "FAILED" || statusStr === "falsy_failed") {
          logger.info(`${label} request failed remotely, clearing ID`, {
            requestId: activeRequestId,
          });
          await callbacks.onClearRequestId();
        }
      } catch (checkError) {
        logger.warn(
          `Failed to check ${label} status, clearing ID to be safe`,
          { requestId: activeRequestId }
        );
        await callbacks.onClearRequestId();
      }
    }
    throw error;
  }
}
