"use client";

import {
  IconArmchair2,
  IconCamera,
  IconDeviceTv,
  IconFocusCentered,
  IconHandStop,
  IconPencil,
  IconSparkles,
  IconSun,
  IconWallet,
} from "@tabler/icons-react";
import Image from "next/image";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { NewUploadedImage } from "@/hooks/use-new-project-creation";
import type { ProjectAITools } from "@/lib/db/schema";
import {
  AI_TOOLS_CONFIG,
  getRoomTypeById,
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
    const toolId = tool.id as keyof ProjectAITools;
    return toolId !== "replaceFurniture" && aiTools[toolId];
  });
}

function ProjectThumb({ image }: { image: NewUploadedImage }) {
  const roomType = getRoomTypeById(image.roomType);
  const envLabel = image.environment === "indoor" ? "İç Mekan" : "Dış Mekan";

  return (
    <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={image.name}
          className="h-full w-full object-cover"
          src={image.preview}
        />
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
          <span className="rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-md">
            {roomType?.label || image.roomType}
          </span>
          <span className="rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-md">
            {envLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({
  icon: IconComponent,
  title,
  subtitle,
  image,
  variant,
  color,
  bgColor,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  image?: string;
  variant?: "blue" | "indigo";
  color?: string;
  bgColor?: string;
}) {
  let iconClass = "bg-gray-100 dark:bg-gray-800/30 text-gray-500";
  let iconColorClass = "text-gray-500";
  if (variant === "blue") {
    iconClass = "bg-blue-100 dark:bg-blue-900/30";
    iconColorClass = "text-blue-600 dark:text-blue-300";
  }
  if (variant === "indigo") {
    iconClass = "bg-indigo-100 dark:bg-indigo-900/30";
    iconColorClass = "text-indigo-600 dark:text-indigo-300";
  }

  // Use specific color overrides if provided
  if (color && bgColor) {
    iconClass = bgColor;
    iconColorClass = color;
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-3">
      {image ? (
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
          <Image
            alt="Style preview"
            className="object-cover"
            fill
            src={image}
          />
        </div>
      ) : (
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
            iconClass
          )}
        >
          {IconComponent && <IconComponent className={cn("h-6 w-6", iconColorClass)} />}
        </div>
      )}
      <div className="flex-grow">
        <p className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
          {title}
        </p>
        <p className="text-sm font-semibold">{subtitle}</p>
      </div>
      {image && (
        <button
          type="button"
          className="rounded-lg p-1.5 text-[var(--accent-teal)] transition-colors hover:bg-[var(--accent-teal)]/10"
        >
          <IconSparkles className="h-5 w-5" />
        </button>
      )}
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

  const activeTools = getActiveTools(aiTools);

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
      {/* Left side - Images */}
      <div className="space-y-6 lg:col-span-7">
        {/* Image thumbnails */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {images.slice(0, 6).map((image) => (
            <ProjectThumb key={image.id} image={image} />
          ))}
        </div>
      </div>

      {/* Right side - Summary panel */}
      <div className="lg:col-span-5">
        <div className="sticky top-24 rounded-2xl border bg-background p-6 shadow-lg">
          {/* Project name input */}
          <div className="mb-6">
            <Label className="mb-2 block text-sm font-medium" htmlFor="project-name">
              İlan Adı
            </Label>
            <div className="relative">
              <Input
                id="project-name"
                className="h-12 pl-10"
                placeholder="örn. Atatürk Cad. No:123 Satılık Daire"
                value={projectName}
                onChange={(e) => onProjectNameChange(e.target.value)}
              />
              <span className="pointer-events-none absolute left-3 top-3.5 text-muted-foreground">
                <IconPencil className="h-5 w-5" />
              </span>
            </div>
          </div>

          {/* Summary cards */}
          <div className="mb-8 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Özet Bilgiler
            </h4>

            {/* Style summary */}
            {aiTools.replaceFurniture && selectedTemplate && (
              <SummaryItem
                title="Eşyaları Değiştir"
                subtitle={selectedTemplate.name}
                image={selectedTemplate.thumbnail}
              />
            )}

            {/* AI tools summary */}
            {activeTools.map((tool, index) => {
              const IconComp = ICON_MAP[tool.icon];
              return (
                <SummaryItem
                  key={tool.id}
                  icon={IconComp}
                  title="AI Düzenleme"
                  subtitle={tool.title}
                  color={tool.color}
                  bgColor={tool.bgColor}
                />
              );
            })}
          </div>

          {/* Cost breakdown */}
          <div className="border-t border-dashed pt-6 pb-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Görsel Sayısı</span>
              <span className="text-sm font-medium">{images.length} Adet</span>
            </div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Görsel Başına Maliyet</span>
              <span className="text-sm font-medium">1 Kredi</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-bold">Toplam Tutar</span>
              <div className="flex items-center gap-1.5 rounded-lg border border-green-100 bg-green-50 px-3 py-1 dark:border-green-900/30 dark:bg-green-900/20">
                <IconWallet className="h-5 w-5 text-green-500" />
                <span className="text-lg font-bold text-green-500">
                  {creditCost} Kredi
                </span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            Bu işlemden sonra hesabınızda{" "}
            <span className="font-bold text-foreground">
              {remainingCredits} kredi
            </span>{" "}
            kalacaktır.
          </p>
        </div>
      </div>
    </div>
  );
}
