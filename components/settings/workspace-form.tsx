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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const lastResultRef = useRef<FormState>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoUrl, setLogoUrl] = useState(workspace.logo);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const name = formData.get("name") as string;

      if (!name.trim()) {
        return { success: false, error: t("workspace.nameRequired", "Çalışma alanı adı gerekli") };
      }

      const result = await updateWorkspaceSettings(formData);
      return result;
    },
    null
  );

  useEffect(() => {
    if (state && state !== lastResultRef.current) {
      if (state.success) {
        toast.success(t("workspace.saveSuccess", "Değişiklikler kaydedildi"));
      } else if (state.error) {
        toast.error(state.error);
      }
      lastResultRef.current = state;
    }
  }, [state, t]);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("errors.invalidImage", "Lütfen bir görsel dosyası seçin"));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("errors.imageTooLarge", "Görsel 2MB'dan küçük olmalıdır"));
      return;
    }

    setIsUploadingLogo(true);

    try {
      const urlResult = await createLogoUploadUrl();
      if (!(urlResult.success && urlResult.data)) {
        toast.error(urlResult.error || t("workspace.logoUploadFailed", "Logo yüklenemedi"));
        return;
      }

      const response = await fetch(urlResult.data.signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!response.ok) throw new Error("Upload failed");

      const publicUrl = await getLogoPublicUrl(urlResult.data.path);
      setLogoUrl(publicUrl);

      const saveResult = await updateWorkspaceLogo(publicUrl);
      if (saveResult.success) {
        toast.success(t("workspace.logoUploadSuccess", "Logo yüklendi"));
      } else {
        toast.error(saveResult.error || t("workspace.logoSaveFailed", "Logo kaydedilemedi"));
      }
    } catch (error) {
      console.error("Logo upload error:", error);
      toast.error(t("workspace.logoUploadFailed", "Logo yüklenemedi"));
    } finally {
      setIsUploadingLogo(false);
    }
  };

  return (
    <form action={formAction} className="space-y-6" ref={formRef}>
      {/* Logo upload */}
      <div className="space-y-2">
        <Label className="font-medium text-sm">{t("workspace.logo", "Çalışma Alanı Logosu")}</Label>
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
              <Image alt="Workspace logo" className="object-cover" fill sizes="80px" src={logoUrl} />
            ) : (
              <IconBuilding className="h-8 w-8" style={{ color: "var(--accent-teal)" }} />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
              {isUploadingLogo ? (
                <IconLoader2 className="h-6 w-6 animate-spin text-white" />
              ) : (
                <IconCamera className="h-6 w-6 text-white" />
              )}
            </div>
          </button>
          <input accept="image/*" className="hidden" onChange={handleFileChange} ref={fileInputRef} type="file" />
          <div className="space-y-1">
            <Button className="gap-2" disabled={isUploadingLogo} onClick={handleLogoClick} size="sm" type="button" variant="outline">
              {isUploadingLogo ? (
                <>
                  <IconLoader2 className="h-4 w-4 animate-spin" />
                  {t("settings.profile.uploading")}
                </>
              ) : (
                <>
                  <IconUpload className="h-4 w-4" />
                  {t("workspace.uploadLogo", "Logo Yükle")}
                </>
              )}
            </Button>
            <p className="text-muted-foreground text-xs">{t("settings.profile.uploadHint")}</p>
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="font-medium text-sm" htmlFor="workspace-name">{t("workspace.name", "Çalışma Alanı Adı")}</Label>
          <div className="relative">
            <IconBuilding className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-10" defaultValue={workspace.name} disabled={isPending} id="workspace-name" name="name" placeholder={t("workspace.namePlaceholder", "Şirket adı")} />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-medium text-sm" htmlFor="org-number">{t("workspace.orgNumber", "Organizasyon Numarası")}</Label>
          <div className="relative">
            <IconHash className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-10" defaultValue={workspace.organizationNumber || ""} disabled={isPending} id="org-number" name="organizationNumber" placeholder="123456789" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-medium text-sm" htmlFor="contact-email">{t("workspace.contactEmail", "İletişim E-postası")}</Label>
          <div className="relative">
            <IconMail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-10" defaultValue={workspace.contactEmail || ""} disabled={isPending} id="contact-email" name="contactEmail" placeholder="iletisim@sirket.com" type="email" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-medium text-sm" htmlFor="contact-person">{t("workspace.contactPerson", "İletişim Kişisi")}</Label>
          <div className="relative">
            <IconUser className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-10" defaultValue={workspace.contactPerson || ""} disabled={isPending} id="contact-person" name="contactPerson" placeholder={t("workspace.fullName", "Ad Soyad")} />
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center justify-end border-t pt-4">
        <Button className={cn("gap-2 shadow-sm transition-all")} disabled={isPending} style={{ backgroundColor: "var(--accent-teal)" }} type="submit">
          {isPending ? (
            <>
              <IconLoader2 className="h-4 w-4 animate-spin" />
              {t("settings.profile.saving")}
            </>
          ) : (
            <>
              <IconDeviceFloppy className="h-4 w-4" />
              {t("settings.profile.saveChanges")}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
