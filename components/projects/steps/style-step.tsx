"use client";

import { IconCheck, IconClock } from "@tabler/icons-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { STYLE_TEMPLATES, type StyleTemplate } from "@/lib/style-templates";
import { cn } from "@/lib/utils";

interface StyleStepProps {
  selectedTemplate: StyleTemplate | null;
  onSelectTemplate: (template: StyleTemplate) => void;
}

export function StyleStep({ selectedTemplate, onSelectTemplate }: StyleStepProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <p className="text-muted-foreground text-sm">
          {t("style.description", "Fotoğraflarınıza uygulanacak bir stil seçin. Her stil, görsellerinizi dönüştürmek için AI kullanır.")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {STYLE_TEMPLATES.map((template, index) => {
          const isSelected = selectedTemplate?.id === template.id;
          const isComingSoon = template.comingSoon;

          return (
            <button
              className={cn(
                "group relative flex animate-fade-in-up flex-col overflow-hidden rounded-xl text-left ring-2 transition-all duration-200",
                isComingSoon
                  ? "cursor-not-allowed opacity-60 ring-transparent"
                  : isSelected
                    ? "shadow-lg ring-[var(--accent-teal)]"
                    : "ring-transparent hover:ring-foreground/10"
              )}
              disabled={isComingSoon}
              key={template.id}
              onClick={() => !isComingSoon && onSelectTemplate(template)}
              style={{ animationDelay: `${index * 50}ms` }}
              type="button"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  alt={template.name}
                  className={cn(
                    "object-cover transition-transform duration-300",
                    isComingSoon ? "grayscale" : isSelected ? "scale-105" : "group-hover:scale-105"
                  )}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  src={template.thumbnail}
                />

                {isSelected && !isComingSoon && (
                  <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-teal)] shadow-md">
                    <IconCheck className="h-4 w-4 text-white" />
                  </div>
                )}

                {isComingSoon && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 font-medium text-[10px] text-white backdrop-blur-sm">
                    <IconClock className="h-3 w-3" />
                    {t("style.comingSoon", "Yakında")}
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {!isComingSoon && (
                  <div className="absolute bottom-2 left-2">
                    <span className="rounded-full bg-white/20 px-2 py-0.5 font-medium text-[10px] text-white uppercase tracking-wider backdrop-blur-sm">
                      {template.category}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-1 p-3">
                <h3 className={cn("font-semibold leading-tight", isComingSoon ? "text-muted-foreground" : "text-foreground")}>
                  {template.name}
                </h3>
                <p className="line-clamp-2 text-muted-foreground text-xs">{template.description}</p>
              </div>

              {isSelected && !isComingSoon && (
                <div className="absolute inset-0 rounded-xl ring-2 ring-inset" style={{ borderColor: "var(--accent-teal)" }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
