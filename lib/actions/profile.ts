"use server";

import { createClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";

// Supabase client for avatar uploads
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!(supabaseUrl && supabaseKey)) {
  throw new Error("Missing Supabase environment variables");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

const AVATARS_BUCKET = "avatars";

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
