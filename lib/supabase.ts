import { createClient } from "@supabase/supabase-js";

// Server-side client with secret key (for uploads)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

// Storage bucket name
export const STORAGE_BUCKET = "aistudio-bucket";

// Path helpers
export function getImagePath(
  workspaceId: string,
  projectId: string,
  imageId: string,
  type: "original" | "result"
): string {
  return `${workspaceId}/${projectId}/${type}/${imageId}`;
}

// Upload image to Supabase Storage
export async function uploadImage(
  file: Buffer | Uint8Array,
  path: string,
  contentType: string
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

// Delete image from Supabase Storage
export async function deleteImage(path: string): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .remove([path]);

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

// Delete all images for a project (handles nested folders)
export async function deleteProjectImages(
  workspaceId: string,
  projectId: string
): Promise<void> {
  const folderPath = `${workspaceId}/${projectId}`;
  const allFilePaths: string[] = [];

  // Helper function to recursively list files
  async function listFilesRecursively(path: string): Promise<void> {
    const { data: items, error: listError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .list(path, { limit: 1000 });

    if (listError) {
      throw new Error(`Failed to list files at ${path}: ${listError.message}`);
    }

    if (!items || items.length === 0) {
      return;
    }

    for (const item of items) {
      const itemPath = `${path}/${item.name}`;

      // Check if it's a folder (no metadata means it's a folder)
      if (item.metadata) {
        // It's a file, add to delete list
        allFilePaths.push(itemPath);
      } else {
        // It's a folder, recurse into it
        await listFilesRecursively(itemPath);
      }
    }
  }

  // Start recursive listing
  await listFilesRecursively(folderPath);

  if (allFilePaths.length === 0) {
    return; // No files to delete
  }

  // Delete files in batches (Supabase has limits)
  const batchSize = 100;
  for (let i = 0; i < allFilePaths.length; i += batchSize) {
    const batch = allFilePaths.slice(i, i + batchSize);
    const { error: deleteError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove(batch);

    if (deleteError) {
      throw new Error(
        `Failed to delete project images: ${deleteError.message}`
      );
    }
  }
}

// Get file extension from content type
export function getExtensionFromContentType(contentType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return map[contentType] || "jpg";
}

// Create a signed upload URL for client-side direct upload
export async function createSignedUploadUrl(path: string): Promise<{
  signedUrl: string;
  token: string;
  path: string;
}> {
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .createSignedUploadUrl(path);

  if (error) {
    throw new Error(`Failed to create signed upload URL: ${error.message}`);
  }

  return {
    signedUrl: data.signedUrl,
    token: data.token,
    path: data.path,
  };
}

// Upload to a signed URL (used by client after getting signed URL)
export function getPublicUrl(path: string): string {
  const { data } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

// ============================================================================
// Video Storage Functions
// ============================================================================

// Path helper for video source images
export function getVideoSourceImagePath(
  workspaceId: string,
  imageId: string
): string {
  return `${workspaceId}/video-sources/${imageId}`;
}

// Upload video source image to Supabase Storage
export async function uploadVideoSourceImage(
  file: Buffer | Uint8Array,
  path: string,
  contentType: string
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload video source image: ${error.message}`);
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

// Path helper for videos
export function getVideoPath(
  workspaceId: string,
  videoProjectId: string,
  filename: string
): string {
  return `${workspaceId}/videos/${videoProjectId}/${filename}`;
}

// Upload video to Supabase Storage
export async function uploadVideo(
  file: Buffer | Uint8Array,
  path: string,
  contentType: string
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload video: ${error.message}`);
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

// Delete video from Supabase Storage
export async function deleteVideo(path: string): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .remove([path]);

  if (error) {
    throw new Error(`Failed to delete video: ${error.message}`);
  }
}

// Delete all videos for a video project
export async function deleteVideoProjectFiles(
  workspaceId: string,
  videoProjectId: string
): Promise<void> {
  const folderPath = `${workspaceId}/videos/${videoProjectId}`;

  // List all files in the video project folder
  const { data: files, error: listError } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .list(folderPath, {
      limit: 1000,
    });

  if (listError) {
    throw new Error(`Failed to list video files: ${listError.message}`);
  }

  if (!files || files.length === 0) {
    return; // No files to delete
  }

  // Delete all files in the folder
  const filePaths = files.map((file) => `${folderPath}/${file.name}`);
  const { error: deleteError } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .remove(filePaths);

  if (deleteError) {
    throw new Error(`Failed to delete video files: ${deleteError.message}`);
  }
}
