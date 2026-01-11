"use client";

import {
  IconArmchair2,
  IconCamera,
  IconCheck,
  IconCloud,
  IconDeviceTv,
  IconEyeOff,
  IconFocusCentered,
  IconHandStop,
  IconInfoCircle,
  IconPlant,
  IconSun,
  IconTrash,
} from "@tabler/icons-react";
import Image from "next/image";
import * as React from "react";
import { useTranslation } from "react-i18next";
import type { ProjectAITools } from "@/lib/db/schema";
import {
  AI_TOOLS_CONFIG,
  SKY_OPTIONS,
  STYLE_TEMPLATES,
  type SkyOption,
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

// Map config to component-usable format with actual icon components
const AI_TOOLS = AI_TOOLS_CONFIG.map((tool) => ({
  id: tool.id as keyof ProjectAITools,
  icon: ICON_MAP[tool.icon] || IconArmchair2,
  title: tool.title,
  description: tool.description,
  color: tool.color,
  bgColor: tool.bgColor,
  outdoorOnly: tool.outdoorOnly,
  hasOptions: tool.hasOptions,
}));

interface AIEnhancementsStepProps {
  aiTools: ProjectAITools;
  onToggleTool: (tool: keyof ProjectAITools) => void;
  selectedTemplate: StyleTemplate | null;
  onSelectTemplate: (template: StyleTemplate) => void;
  onSelectSkyOption?: (skyOptionId: string | undefined) => void;
  hasOutdoorImages?: boolean; // Whether any uploaded images are outdoor
}

function ToolCard({
  tool,
  checked,
  isSelected,
  onToggle,
  onSelect,
  disabled,
}: {
  tool: (typeof AI_TOOLS)[0];
  checked: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onSelect: () => void;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const IconComponent = tool.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "w-full rounded-xl border bg-background py-2 px-3 text-left transition-all shadow-sm group relative",
        disabled
          ? "opacity-50 cursor-not-allowed border-border"
          : isSelected
            ? "border-[var(--accent-teal)] ring-1 ring-[var(--accent-teal)] bg-[var(--accent-teal)]/5"
            : checked
              ? "border-[var(--accent-teal)]/50 bg-[var(--accent-teal)]/5"
              : "border-border hover:border-[var(--accent-teal)]/30 hover:bg-muted/30"
      )}
    >
      {/* {tool.outdoorOnly && (
        <span className="absolute top-1 right-12 z-10 rounded-[4px] bg-green-100 dark:bg-green-900/40 px-1 py-0.5 text-[9px] font-medium text-green-700 dark:text-green-400 leading-none">
          {t("aiTools.outdoorOnly", "Dış Mekan")}
        </span>
      )} */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={cn("rounded-lg p-2 text-white shrink-0", tool.bgColor)}>
             {/* Note: tool.color usually has text-color but if bgColor is solid, we might need white text.
                 Checking original code: tool.color was applied to Icon. tool.bgColor to container.
                 Original: className={cn("rounded-xl p-2.5", tool.bgColor)} and Icon className={cn("h-6 w-6", tool.color)}
                 Let's keep original logic for colors but change sizing.
             */}
             <IconComponent className={cn("h-5 w-5", tool.color)} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-foreground/90">{t(`aiTools.${tool.id}.title`, tool.title)}</h4>
            </div>
            <p className="text-[11px] leading-tight text-muted-foreground line-clamp-1">
              {t(`aiTools.${tool.id}.description`, tool.description)}
            </p>
          </div>
        </div>
        {/* Toggle switch - click stops propagation */}
        <div
          className={cn(
            "relative inline-flex shrink-0 items-center",
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          )}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) {
              onToggle();
            }
          }}
        >
          <div
            className={cn(
              "h-5 w-9 rounded-full transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-['']",
              checked && !disabled
                ? "bg-[var(--accent-teal)] after:translate-x-full after:border-white"
                : "bg-gray-200 dark:bg-gray-700"
            )}
          />
        </div>
      </div>
    </button>
  );
}

function StyleCard({
  template,
  isSelected,
  onClick,
}: {
  template: StyleTemplate;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      className="group cursor-pointer text-left"
      onClick={onClick}
      disabled={template.comingSoon}
    >
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden rounded-2xl border-2 transition-all",
          template.comingSoon
            ? "cursor-not-allowed opacity-60 border-border"
            : isSelected
              ? "border-[var(--accent-teal)] ring-4 ring-[var(--accent-teal)]/10 shadow-lg"
              : "border-border shadow-md group-hover:border-[var(--accent-teal)]/50"
        )}
      >
        <Image
          alt={template.name}
          className={cn(
            "object-cover transition-transform duration-500",
            template.comingSoon
              ? "grayscale"
              : isSelected
                ? "scale-105"
                : "group-hover:scale-110"
          )}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={template.thumbnail}
        />
        {isSelected && !template.comingSoon && (
          <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-teal)] text-white shadow-lg">
            <IconCheck className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-3 px-1">
        <h4
          className={cn(
            "text-[15px] font-bold transition-colors",
            isSelected ? "text-[var(--accent-teal)]" : "group-hover:text-[var(--accent-teal)]"
          )}
        >
          {t(`styles.${template.id}.name`, template.name)}
        </h4>
        <p className="mt-1 text-xs text-muted-foreground">{t(`styles.${template.id}.description`, template.description)}</p>
      </div>
    </button>
  );
}

function SkyOptionCard({
  skyOption,
  isSelected,
  onClick,
}: {
  skyOption: SkyOption;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      className="group cursor-pointer text-left"
      onClick={onClick}
    >
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all",
          isSelected
            ? "border-[var(--accent-teal)] ring-4 ring-[var(--accent-teal)]/10 shadow-lg"
            : "border-border shadow-sm group-hover:border-[var(--accent-teal)]/50"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={skyOption.label}
          className={cn(
            "h-full w-full object-cover transition-transform duration-300",
            isSelected ? "scale-105" : "group-hover:scale-110"
          )}
          src={skyOption.thumbnail}
        />
        {isSelected && (
          <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent-teal)] text-white shadow-lg">
            <IconCheck className="h-3 w-3" />
          </div>
        )}
      </div>
      <div className="mt-2 px-0.5">
        <h5
          className={cn(
            "text-sm font-semibold transition-colors",
            isSelected ? "text-[var(--accent-teal)]" : "group-hover:text-[var(--accent-teal)]"
          )}
        >
          {t(`skyOptions.${skyOption.id}`, skyOption.label)}
        </h5>
      </div>
    </button>
  );
}

export function AIEnhancementsStep({
  aiTools,
  onToggleTool,
  selectedTemplate,
  onSelectTemplate,
  onSelectSkyOption,
  hasOutdoorImages = false,
}: AIEnhancementsStepProps) {
  const { t } = useTranslation();
  const [selectedTool, setSelectedTool] = React.useState<keyof ProjectAITools | null>(
    aiTools.replaceFurniture ? "replaceFurniture" : null
  );

  const selectableTemplates = STYLE_TEMPLATES.filter((tpl) => !tpl.comingSoon);

  // Handle tool card click - just select the tool to show its panel
  const handleToolSelect = (toolId: keyof ProjectAITools) => {
    setSelectedTool(toolId);
  };

  // Handle toggle switch - toggle the tool on/off
  const handleToolToggle = (toolId: keyof ProjectAITools) => {
    onToggleTool(toolId);
    // If enabling a tool, also select it
    if (!aiTools[toolId]) {
      setSelectedTool(toolId);
    }
  };

  // Handle sky option selection
  const handleSkyOptionSelect = (skyOptionId: string) => {
    onSelectSkyOption?.(skyOptionId);
  };

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
      {/* Left sidebar - AI Tools */}
      <aside className="space-y-2 lg:col-span-4 xl:col-span-3">
        <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
          {t("project.aiEnhancements.toolsTitle", "AI Araçları")}
        </h3>
        {AI_TOOLS.map((tool) => {
          // Disable outdoor-only tools if no outdoor images
          const isDisabled = tool.outdoorOnly && !hasOutdoorImages;

          return (
            <ToolCard
              key={tool.id}
              tool={tool}
              checked={Boolean(aiTools[tool.id])}
              isSelected={selectedTool === tool.id}
              onToggle={() => handleToolToggle(tool.id)}
              onSelect={() => handleToolSelect(tool.id)}
              disabled={isDisabled}
            />
          );
        })}

        {/* Info about outdoor-only tools */}
        {!hasOutdoorImages && (
          <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 p-3 text-xs text-amber-700 dark:text-amber-400">
            <div className="flex items-start gap-2">
              <IconInfoCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p>{t("project.aiEnhancements.outdoorToolsInfo", "Dış mekan araçlarını kullanmak için en az bir dış mekan fotoğrafı yükleyin.")}</p>
            </div>
          </div>
        )}
      </aside>

      {/* Main area - Tool detail panel */}
      <div className="lg:col-span-8 xl:col-span-9">
        {!selectedTool ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30">
            <p className="text-muted-foreground">
              {t("project.aiEnhancements.selectToolPrompt", "Detayları görmek için bir AI aracı seçin")}
            </p>
          </div>
        ) : selectedTool === "replaceFurniture" ? (
          <FurnitureSelectionPanel
            selectableTemplates={selectableTemplates}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={onSelectTemplate}
            title={t("aiTools.replaceFurniture.title", "Eşyaları Değiştir")}
          />
        ) : selectedTool === "skyReplacement" ? (
          <SkySelectionPanel
            selectedSkyOption={aiTools.selectedSkyOption}
            onSelectSkyOption={handleSkyOptionSelect}
            title={t("aiTools.skyReplacement.title", "Gökyüzü Değiştirme")}
          />
        ) : (
          <ToolDetailContent
            toolId={selectedTool}
            title={t(`aiTools.${selectedTool}.title`, getPanelTitle(selectedTool))}
          />
        )}
      </div>
    </div>
  );
}

const getPanelTitle = (selectedTool: string | null) => {
  if (!selectedTool) return "Bir araç seçin";
  const tool = AI_TOOLS_CONFIG.find((t) => t.id === selectedTool);
  return tool ? tool.title : "";
};

function FurnitureSelectionPanel({
  selectableTemplates,
  selectedTemplate,
  onSelectTemplate,
  title,
}: {
  selectableTemplates: StyleTemplate[];
  selectedTemplate: StyleTemplate | null;
  onSelectTemplate: (t: StyleTemplate) => void;
  title: string;
}) {
  const { t } = useTranslation();
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold">{title}</h3>
        <span className="text-sm text-muted-foreground">
          {t("project.aiEnhancements.selectStylePrompt", "Eşyaları değiştirmek için bir stil seçin")}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {selectableTemplates.map((template) => (
          <StyleCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate?.id === template.id}
            onClick={() => onSelectTemplate(template)}
          />
        ))}
      </div>
    </>
  );
}

function SkySelectionPanel({
  selectedSkyOption,
  onSelectSkyOption,
  title,
}: {
  selectedSkyOption: string | undefined;
  onSelectSkyOption: (skyOptionId: string) => void;
  title: string;
}) {
  const { t } = useTranslation();
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold">{title}</h3>
        <span className="text-sm text-muted-foreground">
          {t("project.aiEnhancements.selectSkyPrompt", "Dış mekan fotoğrafları için gökyüzü seçin")}
        </span>
      </div>
      <div className="rounded-xl bg-sky-50 dark:bg-sky-900/20 p-4 mb-6">
        <p className="text-sm text-sky-700 dark:text-sky-300">
          {t("project.aiEnhancements.skyReplacementInfo", "Bu özellik sadece dış mekan fotoğraflarına uygulanır. Mevcut gökyüzü seçtiğiniz stil ile değiştirilecektir.")}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {SKY_OPTIONS.map((skyOption) => (
          <SkyOptionCard
            key={skyOption.id}
            skyOption={skyOption}
            isSelected={selectedSkyOption === skyOption.id}
            onClick={() => onSelectSkyOption(skyOption.id)}
          />
        ))}
      </div>
    </>
  );
}

function ToolDetailContent({
  toolId,
  title,
}: {
  toolId: string;
  title: string;
}) {
  const { t } = useTranslation();

  // Declutter tool
  if (toolId === "declutter") {
    const features = t("project.aiEnhancements.toolDetails.declutter.features", { returnObjects: true }) as string[];
    return (
      <div className="rounded-2xl border bg-background p-6">
        <h3 className="mb-4 text-lg font-bold">{title}</h3>
        <p className="mb-6 text-muted-foreground">
          {t("project.aiEnhancements.toolDetails.declutter.description", "Fotoğraftaki dağınıklığı, yerdeki eşyaları ve çer çöpü otomatik olarak temizler.")}
        </p>
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            {Array.isArray(features) ? features.map((feature, i) => (
              <React.Fragment key={i}>
                ✓ {feature}<br />
              </React.Fragment>
            )) : null}
          </p>
        </div>
      </div>
    );
  }

  if (toolId === "cleanHands") {
    const features = t("project.aiEnhancements.toolDetails.cleanHands.features", { returnObjects: true }) as string[];
    return (
      <div className="rounded-2xl border bg-background p-6">
        <h3 className="mb-4 text-lg font-bold">{title}</h3>
        <p className="mb-6 text-muted-foreground">
          {t("project.aiEnhancements.toolDetails.cleanHands.description", "Fotoğraftaki yansımalarda görünen elleri otomatik olarak algılar ve temizler.")}
        </p>
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            {Array.isArray(features) ? features.map((feature, i) => (
              <React.Fragment key={i}>
                ✓ {feature}<br />
              </React.Fragment>
            )) : null}
          </p>
        </div>
      </div>
    );
  }

  if (toolId === "cleanCamera") {
    const features = t("project.aiEnhancements.toolDetails.cleanCamera.features", { returnObjects: true }) as string[];
    return (
      <div className="rounded-2xl border bg-background p-6">
        <h3 className="mb-4 text-lg font-bold">{title}</h3>
        <p className="mb-6 text-muted-foreground">
          {t("project.aiEnhancements.toolDetails.cleanCamera.description", "Fotoğraftaki tripod, kamera ekipmanı ve yansımalarını otomatik olarak temizler.")}
        </p>
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            {Array.isArray(features) ? features.map((feature, i) => (
              <React.Fragment key={i}>
                ✓ {feature}<br />
              </React.Fragment>
            )) : null}
          </p>
        </div>
      </div>
    );
  }

  if (toolId === "turnOffScreens") {
    const features = t("project.aiEnhancements.toolDetails.turnOffScreens.features", { returnObjects: true }) as string[];
    return (
      <div className="rounded-2xl border bg-background p-6">
        <h3 className="mb-4 text-lg font-bold">{title}</h3>
        <p className="mb-6 text-muted-foreground">
          {t("project.aiEnhancements.toolDetails.turnOffScreens.description", "TV, monitör ve diğer ekranları algılar ve karartır.")}
        </p>
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            {Array.isArray(features) ? features.map((feature, i) => (
              <React.Fragment key={i}>
                ✓ {feature}<br />
              </React.Fragment>
            )) : null}
          </p>
        </div>
      </div>
    );
  }

  if (toolId === "lensCorrection") {
    const features = t("project.aiEnhancements.toolDetails.lensCorrection.features", { returnObjects: true }) as string[];
    return (
      <div className="rounded-2xl border bg-background p-6">
        <h3 className="mb-4 text-lg font-bold">{title}</h3>
        <p className="mb-6 text-muted-foreground">
          {t("project.aiEnhancements.toolDetails.lensCorrection.description", "Geniş açı lens distorsiyonunu düzeltir ve çizgileri düzleştirir.")}
        </p>
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            {Array.isArray(features) ? features.map((feature, i) => (
              <React.Fragment key={i}>
                ✓ {feature}<br />
              </React.Fragment>
            )) : null}
          </p>
        </div>
      </div>
    );
  }

  if (toolId === "whiteBalance") {
    return (
      <div className="rounded-2xl border bg-background p-6">
        <h3 className="mb-4 text-lg font-bold">{title}</h3>
        <p className="mb-6 text-muted-foreground">
          {t("project.aiEnhancements.toolDetails.whiteBalance.description", "Renk sıcaklığını optimize eder ve doğal beyaz dengesi sağlar.")}
        </p>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              {t("project.aiEnhancements.toolDetails.whiteBalance.labels.temperature", "Sıcaklık Ayarı")}
            </label>
            <input
              type="range"
              min="-100"
              max="100"
              defaultValue="0"
              className="w-full accent-[var(--accent-teal)]"
              disabled
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>{t("project.aiEnhancements.toolDetails.whiteBalance.labels.cool", "Soğuk")}</span>
              <span>{t("project.aiEnhancements.toolDetails.whiteBalance.labels.natural", "Doğal")}</span>
              <span>{t("project.aiEnhancements.toolDetails.whiteBalance.labels.warm", "Sıcak")}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground italic">
            {t("project.aiEnhancements.toolDetails.whiteBalance.labels.comingSoon", "* Slider ayarı yakında aktif olacak")}
          </p>
        </div>
      </div>
    );
  }

  // Grass Greening tool
  if (toolId === "grassGreening") {
    const features = t("project.aiEnhancements.toolDetails.grassGreening.features", { returnObjects: true }) as string[];
    return (
      <div className="rounded-2xl border bg-background p-6">
        <h3 className="mb-4 text-lg font-bold">{title}</h3>
        <p className="mb-6 text-muted-foreground">
          {t("project.aiEnhancements.toolDetails.grassGreening.description", "Bahçe ve dış mekanlardaki çimleri canlı yeşil görünüme kavuşturur.")}
        </p>
        <div className="rounded-xl bg-green-50 dark:bg-green-900/20 p-4 mb-4">
          <p className="text-sm text-green-700 dark:text-green-300">
            {t("project.aiEnhancements.toolDetails.grassGreening.note", "Bu özellik sadece bahçe, arka bahçe, cephe, havuz alanı ve teras fotoğraflarına uygulanır. Mevcut olmayan alanlara çim eklenmez.")}
          </p>
        </div>
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            {Array.isArray(features) ? features.map((feature, i) => (
              <React.Fragment key={i}>
                ✓ {feature}<br />
              </React.Fragment>
            )) : null}
          </p>
        </div>
      </div>
    );
  }

  // Blur Sensitive Info tool
  if (toolId === "blurSensitiveInfo") {
    const features = t("project.aiEnhancements.toolDetails.blurSensitiveInfo.features", { returnObjects: true }) as string[];
    return (
      <div className="rounded-2xl border bg-background p-6">
        <h3 className="mb-4 text-lg font-bold">{title}</h3>
        <p className="mb-6 text-muted-foreground">
          {t("project.aiEnhancements.toolDetails.blurSensitiveInfo.description", "Fotoğraftaki hassas ve özel bilgileri otomatik olarak bulanıklaştırır.")}
        </p>
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 mb-4">
          <p className="text-sm text-red-700 dark:text-red-300">
            {t("project.aiEnhancements.toolDetails.blurSensitiveInfo.note", "Gizlilik için önemli: Aile fotoğrafları, plakalar, tam adresler ve kişisel belgeler otomatik olarak bulanıklaştırılır.")}
          </p>
        </div>
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            {Array.isArray(features) ? features.map((feature, i) => (
              <React.Fragment key={i}>
                ✓ {feature}<br />
              </React.Fragment>
            )) : null}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
