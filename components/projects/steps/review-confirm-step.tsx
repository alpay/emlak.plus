"use client";

import {
  IconArmchair,
  IconArmchair2,
  IconCamera,
  IconCloud,
  IconCoin,
  IconDeviceTv,
  IconEyeOff,
  IconFocusCentered,
  IconHandStop,
  IconPlant,
  IconSun,
  IconTrash,
  IconWand,
} from "@tabler/icons-react";
import Image from "next/image";
import * as React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import type { NewUploadedImage } from "@/hooks/use-new-project-creation";
import type { ProjectAITools } from "@/lib/db/schema";
import {
  AI_TOOLS_CONFIG,
  getRoomTypesByEnvironment,
  type StyleTemplate,
} from "@/lib/style-templates";
import { cn } from "@/lib/utils";

// Icon map for rendering Tabler icons from string names
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  IconArmchair2,
  IconHandStop,
  IconCamera,
  IconDeviceTv,
  IconFocusCentered,
  IconSun,
  IconTrash,
  IconPlant,
  IconEyeOff,
  IconCloud,
};

interface ReviewConfirmStepProps {
  images: NewUploadedImage[];
  aiTools: ProjectAITools;
  selectedTemplate: StyleTemplate | null;
  projectName: string;
  onProjectNameChange: (name: string) => void;
  creditCost: number;
  remainingCredits: number;
}

// Get active AI tools with their config
function getActiveTools(aiTools: ProjectAITools) {
  return AI_TOOLS_CONFIG.filter((tool) => {
    // Check if the tool is enabled in the aiTools object
    const toolId = tool.id as keyof ProjectAITools;
    return aiTools[toolId];
  });
}

function ProjectThumb({ image }: { image: NewUploadedImage }) {
  const { t } = useTranslation();
  const roomTypes = getRoomTypesByEnvironment(image.environment);
  const roomType = roomTypes.find((r) => r.id === image.roomType);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={image.name}
        className="h-full w-full object-cover"
        src={image.preview}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-2 left-2 right-2">
        <p className="font-semibold text-white text-xs truncate">
          {t(`roomTypes.${image.roomType}.label`, roomType?.label || image.roomType)}
        </p>
        <p className="text-[10px] text-white/80">
          {t(`roomTypes.environments.${image.environment}`, image.environment === "indoor" ? "İç Mekan" : "Dış Mekan")}
        </p>
      </div>
    </div>
  );
}

function SummaryItem({
  icon: IconComponent,
  label,
  children,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3 text-sm">
      {IconComponent && (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-background shadow-sm">
          <IconComponent className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <div className="flex flex-1 items-center justify-between gap-4">
        <span className="text-muted-foreground">{label}</span>
        <div className="text-right">{children}</div>
      </div>
    </div>
  );
}

export function ReviewConfirmStep({
  images,
  aiTools,
  selectedTemplate,
  projectName,
  onProjectNameChange,
  creditCost,
  remainingCredits,
}: ReviewConfirmStepProps) {
  const { t } = useTranslation();
  const selectedTools = getActiveTools(aiTools);
  const imageCount = images.length;
  const costPerImage = 1;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-8">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                {t("project.confirm.projectName", "İlan Adı")}
              </label>
              <Input
                placeholder={t("project.confirm.placeholder", "örn. Atatürk Cad. No:123 Satılık Daire")}
                value={projectName}
                onChange={(e) => onProjectNameChange(e.target.value)}
                className="bg-background"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {images.map((image) => (
                <ProjectThumb key={image.id} image={image} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="sticky top-6 space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold">{t("project.confirm.summary", "Özet Bilgiler")}</h3>

          <div className="space-y-4 text-sm">
            <SummaryItem
              icon={IconArmchair}
              label={t("project.confirm.replaceFurniture", "Eşyaları Değiştir")}
            >
              {selectedTemplate ? (
                <span className="font-medium text-[var(--accent-teal)]">
                  {t(`styles.${selectedTemplate.id}.name`, selectedTemplate.name)}
                </span>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </SummaryItem>

            <SummaryItem
              icon={IconWand}
              label={t("project.confirm.aiEditing", "AI Düzenleme")}
            >
              {selectedTools.length > 0 ? (
                <div className="flex flex-wrap justify-end gap-1">
                  {selectedTools.map((tool) => (
                    <span
                      key={tool.id}
                      className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium"
                    >
                      {t(`aiTools.${tool.id}.title`, tool.title)}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </SummaryItem>

            <div className="my-4 h-px bg-border" />

            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("project.confirm.imageCount", "Görsel Sayısı")}</span>
                <span className="font-medium">{imageCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("project.confirm.costPerImage", "Görsel Başına Maliyet")}</span>
                <span className="font-medium">{costPerImage} {t("common.credit", "kredi")}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[var(--accent-teal)] border-t border-dashed pt-3 mt-1">
                <span>{t("project.confirm.totalCost", "Toplam Tutar")}</span>
                <span>{creditCost} {t("common.credit", "kredi")}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-orange-500/10 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-orange-500/20 p-2 text-orange-600">
                <IconCoin className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <Trans
                    i18nKey="project.confirm.creditsRemaining"
                    count={remainingCredits}
                    components={{ bold: <span className="font-bold text-foreground" /> }}
                    defaults="Bu işlemden sonra hesabınızda <bold>{{count}} kredi</bold> kalacaktır."
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
