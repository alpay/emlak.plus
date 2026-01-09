"use server";

import { createClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user, workspace } from "@/lib/db/schema";

// Supabase client for avatar uploads
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!(supabaseUrl && supabaseKey)) {
  throw new Error("Missing Supabase environment variables");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

const AVATARS_BUCKET = "avatars";
const LOGOS_BUCKET = "avatars";

export interface ProfileActionResult {
  success: boolean;
  error?: string;
  data?: {
    name: string;
    image: string | null;
  };
}

/**
 * Update the current user's profile (name and/or image)
 */
export async function updateProfileAction(
  formData: FormData
): Promise<ProfileActionResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const image = formData.get("image") as string | null;

  // Validate required fields
  if (!name?.trim()) {
    return { success: false, error: "Display name is required" };
  }

  if (name.trim().length > 100) {
    return {
      success: false,
      error: "Display name must be less than 100 characters",
    };
  }

  try {
    // Update user profile
    const [updated] = await db
      .update(user)
      .set({
        name: name.trim(),
        image: image || null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))
      .returning({
        name: user.name,
        image: user.image,
      });

    if (!updated) {
      return { success: false, error: "User not found" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
    return { success: true, data: updated };
  } catch (error) {
    console.error("[profile:updateProfile] Error:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

/**
 * Create a signed URL for uploading avatar
 */
export async function createAvatarUploadUrl(): Promise<{
  success: boolean;
  error?: string;
  data?: { signedUrl: string; path: string };
}> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const userId = session.user.id;
    const timestamp = Date.now();
    const path = `${userId}/${timestamp}`;

    const { data, error } = await supabaseAdmin.storage
      .from(AVATARS_BUCKET)
      .createSignedUploadUrl(path);

    if (error) {
      console.error("[profile:createAvatarUploadUrl] Error:", error);
      return { success: false, error: "Failed to create upload URL" };
    }

    return {
      success: true,
      data: {
        signedUrl: data.signedUrl,
        path: data.path,
      },
    };
  } catch (error) {
    console.error("[profile:createAvatarUploadUrl] Error:", error);
    return { success: false, error: "Failed to create upload URL" };
  }
}

/**
 * Get public URL for an avatar
 */
export async function getAvatarPublicUrl(path: string): Promise<string> {
  const { data } = supabaseAdmin.storage
    .from(AVATARS_BUCKET)
    .getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Update just the profile image (for auto-save on upload)
 */
export async function updateProfileImage(
  imageUrl: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db
      .update(user)
      .set({
        image: imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id));

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("[profile:updateProfileImage] Error:", error);
    return { success: false, error: "Failed to update profile image" };
  }
}

/**
 * Create a signed URL for uploading workspace logo
 */
export async function createLogoUploadUrl(): Promise<{
  success: boolean;
  error?: string;
  data?: { signedUrl: string; path: string };
}> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  // Get user's workspace
  const currentUser = await db
    .select({ workspaceId: user.workspaceId, role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!currentUser[0]?.workspaceId) {
    return { success: false, error: "Workspace not found" };
  }

  // Check if user is owner or admin
  if (currentUser[0].role !== "owner" && currentUser[0].role !== "admin") {
    return { success: false, error: "Insufficient permissions" };
  }

  try {
    const workspaceId = currentUser[0].workspaceId;
    const timestamp = Date.now();
    const path = `${workspaceId}/${timestamp}`;

    const { data, error } = await supabaseAdmin.storage
      .from(LOGOS_BUCKET)
      .createSignedUploadUrl(path);

    if (error) {
      console.error("[profile:createLogoUploadUrl] Error:", error);
      return { success: false, error: "Failed to create upload URL" };
    }

    return {
      success: true,
      data: {
        signedUrl: data.signedUrl,
        path: data.path,
      },
    };
  } catch (error) {
    console.error("[profile:createLogoUploadUrl] Error:", error);
    return { success: false, error: "Failed to create upload URL" };
  }
}

/**
 * Get public URL for a workspace logo
 */
export async function getLogoPublicUrl(path: string): Promise<string> {
  const { data } = supabaseAdmin.storage.from(LOGOS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Update workspace logo
 */
export async function updateWorkspaceLogo(
  logoUrl: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  // Get user's workspace
  const currentUser = await db
    .select({ workspaceId: user.workspaceId, role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!currentUser[0]?.workspaceId) {
    return { success: false, error: "Workspace not found" };
  }

  // Check if user is owner or admin
  if (currentUser[0].role !== "owner" && currentUser[0].role !== "admin") {
    return { success: false, error: "Insufficient permissions" };
  }

  try {
    await db
      .update(workspace)
      .set({
        logo: logoUrl,
        updatedAt: new Date(),
      })
      .where(eq(workspace.id, currentUser[0].workspaceId));

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("[profile:updateWorkspaceLogo] Error:", error);
    return { success: false, error: "Failed to update workspace logo" };
  }
}
