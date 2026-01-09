"use client";

import {
  IconCamera,
  IconDeviceFloppy,
  IconLoader2,
  IconUser,
} from "@tabler/icons-react";
import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createAvatarUploadUrl,
  getAvatarPublicUrl,
  type ProfileActionResult,
  updateProfileAction,
  updateProfileImage,
} from "@/lib/actions/profile";
import { cn } from "@/lib/utils";

interface ProfileFormProps {
  userName: string;
  userEmail: string;
  userImage: string | null;
}

type FormState = ProfileActionResult | null;

export function ProfileForm({
  userName,
  userEmail,
  userImage,
}: ProfileFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const lastResultRef = useRef<FormState>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(userImage);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const name = formData.get("name") as string;

      // Client-side validation
      if (!name.trim()) {
        return { success: false, error: "Display name is required" };
      }

      // Add the current avatar URL to the form data
      if (avatarUrl) {
        formData.set("image", avatarUrl);
      }

      const result = await updateProfileAction(formData);
      return result;
    },
    null
  );

  // Show toast when state changes (only once per state change)
  useEffect(() => {
    if (state && state !== lastResultRef.current) {
      if (state.success) {
        toast.success("Profile updated successfully");
      } else if (state.error) {
        toast.error(state.error);
      }
      lastResultRef.current = state;
    }
  }, [state]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Get signed upload URL
      const urlResult = await createAvatarUploadUrl();
      if (!(urlResult.success && urlResult.data)) {
        toast.error(urlResult.error || "Failed to upload avatar");
        return;
      }

      // Upload to Supabase
      const response = await fetch(urlResult.data.signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      // Get public URL
      const publicUrl = await getAvatarPublicUrl(urlResult.data.path);
      setAvatarUrl(publicUrl);

      // Auto-save to database immediately
      const saveResult = await updateProfileImage(publicUrl);
      if (saveResult.success) {
        toast.success("Profile photo updated");
      } else {
        toast.error(saveResult.error || "Failed to save profile photo");
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <form action={formAction} className="space-y-6" ref={formRef}>
      {/* Avatar upload */}
      <div className="space-y-2">
        <Label className="font-medium text-sm">Profile Photo</Label>
        <div className="flex items-center gap-4">
          <button
            className={cn(
              "relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-muted ring-1 ring-foreground/5 transition-all hover:ring-2 hover:ring-[var(--accent-teal)]",
              isUploadingAvatar && "opacity-50"
            )}
            disabled={isUploadingAvatar}
            onClick={handleAvatarClick}
            type="button"
          >
            {avatarUrl ? (
              <Image
                alt="Profile"
                className="object-cover"
                fill
                sizes="80px"
                src={avatarUrl}
              />
            ) : (
              <IconUser
                className="h-8 w-8"
                style={{ color: "var(--accent-teal)" }}
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
              {isUploadingAvatar ? (
                <IconLoader2 className="h-6 w-6 animate-spin text-white" />
              ) : (
                <IconCamera className="h-6 w-6 text-white" />
              )}
            </div>
          </button>
          <input
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
            type="file"
          />
          <div className="space-y-1">
            <Button
              className="gap-2"
              disabled={isUploadingAvatar}
              onClick={handleAvatarClick}
              size="sm"
              type="button"
              variant="outline"
            >
              {isUploadingAvatar ? (
                <>
                  <IconLoader2 className="h-4 w-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <IconCamera className="h-4 w-4" />
                  Change Photo
                </>
              )}
            </Button>
            <p className="text-muted-foreground text-xs">
              PNG, JPG up to 2MB. Recommended 200x200px.
            </p>
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Display Name */}
        <div className="space-y-2">
          <Label className="font-medium text-sm" htmlFor="display-name">
            Display Name
          </Label>
          <div className="relative">
            <IconUser className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              defaultValue={userName}
              disabled={isPending}
              id="display-name"
              name="name"
              placeholder="Your name"
            />
          </div>
        </div>

        {/* Email (read-only) */}
        <div className="space-y-2">
          <Label className="font-medium text-sm" htmlFor="email">
            Email Address
          </Label>
          <Input
            className="bg-muted"
            defaultValue={userEmail}
            disabled
            id="email"
            readOnly
          />
          <p className="text-muted-foreground text-xs">
            Email cannot be changed
          </p>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center justify-end border-t pt-4">
        <Button
          className={cn("gap-2 shadow-sm transition-all")}
          disabled={isPending || isUploadingAvatar}
          style={{
            backgroundColor: "var(--accent-teal)",
          }}
          type="submit"
        >
          {isPending ? (
            <>
              <IconLoader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <IconDeviceFloppy className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
