"use client";

import {
  IconBuilding,
  IconCamera,
  IconDeviceFloppy,
  IconHash,
  IconLoader2,
  IconMail,
  IconUpload,
  IconUser,
} from "@tabler/icons-react";
import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updateWorkspaceSettings,
  type WorkspaceActionResult,
} from "@/lib/actions";
import {
  createLogoUploadUrl,
  getLogoPublicUrl,
  updateWorkspaceLogo,
} from "@/lib/actions/profile";
import type { Workspace } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

interface WorkspaceFormProps {
  workspace: Workspace;
}

type FormState = WorkspaceActionResult | null;

export function WorkspaceForm({ workspace }: WorkspaceFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const lastResultRef = useRef<FormState>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoUrl, setLogoUrl] = useState(workspace.logo);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const name = formData.get("name") as string;

      // Client-side validation
      if (!name.trim()) {
        return { success: false, error: "Workspace name is required" };
      }

      const result = await updateWorkspaceSettings(formData);
      return result;
    },
    null
  );

  // Show toast when state changes (only once per state change)
  useEffect(() => {
    if (state && state !== lastResultRef.current) {
      if (state.success) {
        toast.success("Changes saved successfully");
      } else if (state.error) {
        toast.error(state.error);
      }
      lastResultRef.current = state;
    }
  }, [state]);

  const handleLogoClick = () => {
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

    setIsUploadingLogo(true);

    try {
      // Get signed upload URL
      const urlResult = await createLogoUploadUrl();
      if (!(urlResult.success && urlResult.data)) {
        toast.error(urlResult.error || "Failed to upload logo");
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
      const publicUrl = await getLogoPublicUrl(urlResult.data.path);
      setLogoUrl(publicUrl);

      // Save the logo URL to the database
      const saveResult = await updateWorkspaceLogo(publicUrl);
      if (saveResult.success) {
        toast.success("Logo uploaded successfully");
      } else {
        toast.error(saveResult.error || "Failed to save logo");
      }
    } catch (error) {
      console.error("Logo upload error:", error);
      toast.error("Failed to upload logo");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  return (
    <form action={formAction} className="space-y-6" ref={formRef}>
      {/* Logo upload */}
      <div className="space-y-2">
        <Label className="font-medium text-sm">Workspace Logo</Label>
        <div className="flex items-center gap-4">
          <button
            className={cn(
              "relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/5 transition-all hover:ring-2 hover:ring-[var(--accent-teal)]",
              isUploadingLogo && "opacity-50"
            )}
            disabled={isUploadingLogo}
            onClick={handleLogoClick}
            type="button"
          >
            {logoUrl ? (
              <Image
                alt="Workspace logo"
                className="object-cover"
                fill
                sizes="80px"
                src={logoUrl}
              />
            ) : (
              <IconBuilding
                className="h-8 w-8"
                style={{ color: "var(--accent-teal)" }}
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
              {isUploadingLogo ? (
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
              disabled={isUploadingLogo}
              onClick={handleLogoClick}
              size="sm"
              type="button"
              variant="outline"
            >
              {isUploadingLogo ? (
                <>
                  <IconLoader2 className="h-4 w-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <IconUpload className="h-4 w-4" />
                  Upload Logo
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
        {/* Workspace Name */}
        <div className="space-y-2">
          <Label className="font-medium text-sm" htmlFor="workspace-name">
            Workspace Name
          </Label>
          <div className="relative">
            <IconBuilding className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              defaultValue={workspace.name}
              disabled={isPending}
              id="workspace-name"
              name="name"
              placeholder="Your company name"
            />
          </div>
        </div>

        {/* Organization Number */}
        <div className="space-y-2">
          <Label className="font-medium text-sm" htmlFor="org-number">
            Organization Number
          </Label>
          <div className="relative">
            <IconHash className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              defaultValue={workspace.organizationNumber || ""}
              disabled={isPending}
              id="org-number"
              name="organizationNumber"
              placeholder="123456789"
            />
          </div>
        </div>

        {/* Contact Email */}
        <div className="space-y-2">
          <Label className="font-medium text-sm" htmlFor="contact-email">
            Contact Email
          </Label>
          <div className="relative">
            <IconMail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              defaultValue={workspace.contactEmail || ""}
              disabled={isPending}
              id="contact-email"
              name="contactEmail"
              placeholder="contact@company.com"
              type="email"
            />
          </div>
        </div>

        {/* Contact Person */}
        <div className="space-y-2">
          <Label className="font-medium text-sm" htmlFor="contact-person">
            Contact Person
          </Label>
          <div className="relative">
            <IconUser className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              defaultValue={workspace.contactPerson || ""}
              disabled={isPending}
              id="contact-person"
              name="contactPerson"
              placeholder="Full name"
            />
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center justify-end border-t pt-4">
        <Button
          className={cn("gap-2 shadow-sm transition-all")}
          disabled={isPending}
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
