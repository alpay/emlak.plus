"use client";

import {
  IconArmchair2,
  IconCamera,
  IconCheck,
  IconDeviceTv,
  IconFocusCentered,
  IconHandStop,
  IconSun,
} from "@tabler/icons-react";
import Image from "next/image";
import * as React from "react";
import { useTranslation } from "react-i18next";
import type { ProjectAITools } from "@/lib/db/schema";
import {
  AI_TOOLS_CONFIG,
  STYLE_TEMPLATES,
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

// Map config to component-usable format with actual icon components
const AI_TOOLS = AI_TOOLS_CONFIG.map((tool) => ({
  id: tool.id as keyof ProjectAITools,
  icon: ICON_MAP[tool.icon] || IconArmchair2,
  title: tool.title,
  description: tool.description,
  color: tool.color,
  bgColor: tool.bgColor,
}));

interface AIEnhancementsStepProps {
  aiTools: ProjectAITools;
  onToggleTool: (tool: keyof ProjectAITools) => void;
  selectedTemplate: StyleTemplate | null;
  onSelectTemplate: (template: StyleTemplate) => void;
}

function ToolCard({
  tool,
  checked,
  isSelected,
  onToggle,
  onSelect,
}: {
  tool: (typeof AI_TOOLS)[0];
  checked: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onSelect: () => void;
}) {
  const IconComponent = tool.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-2xl border-2 bg-background p-3 text-left transition-all shadow-sm",
        isSelected
          ? "border-[var(--accent-teal)] ring-4 ring-[var(--accent-teal)]/10"
          : checked
            ? "border-[var(--accent-teal)]/50"
            : "border-border hover:border-[var(--accent-teal)]/50"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={cn("rounded-xl p-2.5", tool.bgColor)}>
            <IconComponent className={cn("h-6 w-6", tool.color)} />
          </div>
          <div>
            <h4 className="text-[14px] font-bold">{tool.title}</h4>
            <p className="text-[11px] leading-tight text-muted-foreground">
              {tool.description}
            </p>
          </div>
        </div>
        {/* Toggle switch - click stops propagation */}
        <div
          className="relative inline-flex shrink-0 cursor-pointer items-center"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          <div
            className={cn(
              "h-6 w-10 rounded-full transition-colors after:absolute after:left-[3px] after:top-[3px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-['']",
              checked
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
          {template.name}
        </h4>
        <p className="mt-1 text-xs text-muted-foreground">{template.description}</p>
      </div>
    </button>
  );
}

export function AIEnhancementsStep({
  aiTools,
  onToggleTool,
  selectedTemplate,
  onSelectTemplate,
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
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold">{title}</h3>
        <span className="text-sm text-muted-foreground">
          Eşyaları değiştirmek için bir stil seçin
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

function ToolDetailContent({
  toolId,
  title,
}: {
  toolId: string;
  title: string;
}) {
  if (toolId === "cleanHands") {
    return (
      <div className="rounded-2xl border bg-background p-6">
        <h3 className="mb-4 text-lg font-bold">{title}</h3>
        <p className="mb-6 text-muted-foreground">
          Fotoğraftaki yansımalarda görünen elleri otomatik olarak algılar ve temizler.
        </p>
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            ✓ Ayna ve cam yansımalarındaki eller temizlenir<br />
            ✓ Tripod tutuş izleri kaldırılır<br />
            ✓ Doğal görünüm korunur
          </p>
        </div>
      </div>
    );
  }

  if (toolId === "cleanCamera") {
    return (
      <div className="rounded-2xl border bg-background p-6">
        <h3 className="mb-4 text-lg font-bold">{title}</h3>
        <p className="mb-6 text-muted-foreground">
          Fotoğraftaki tripod, kamera ekipmanı ve yansımalarını otomatik olarak temizler.
        </p>
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            ✓ Tripod ayakları kaldırılır<br />
            ✓ Kamera yansımaları temizlenir<br />
            ✓ Ekipman gölgeleri düzenlenir
          </p>
        </div>
      </div>
    );
  }

  if (toolId === "turnOffScreens") {
    return (
      <div className="rounded-2xl border bg-background p-6">
        <h3 className="mb-4 text-lg font-bold">{title}</h3>
        <p className="mb-6 text-muted-foreground">
          TV, monitör ve diğer ekranları algılar ve karartır.
        </p>
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            ✓ TV ekranları karartılır<br />
            ✓ Bilgisayar monitörleri temizlenir<br />
            ✓ Yansımalar giderilir
          </p>
        </div>
      </div>
    );
  }

  if (toolId === "lensCorrection") {
    return (
      <div className="rounded-2xl border bg-background p-6">
        <h3 className="mb-4 text-lg font-bold">{title}</h3>
        <p className="mb-6 text-muted-foreground">
          Geniş açı lens distorsiyonunu düzeltir ve çizgileri düzleştirir.
        </p>
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            ✓ Varil distorsiyonu giderilir<br />
            ✓ Duvar ve kapı çizgileri düzleştirilir<br />
            ✓ Perspektif düzeltmesi uygulanır
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
          Renk sıcaklığını optimize eder ve doğal beyaz dengesi sağlar.
        </p>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Sıcaklık Ayarı</label>
            <input
              type="range"
              min="-100"
              max="100"
              defaultValue="0"
              className="w-full accent-[var(--accent-teal)]"
              disabled
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>Soğuk</span>
              <span>Doğal</span>
              <span>Sıcak</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground italic">
            * Slider ayarı yakında aktif olacak
          </p>
        </div>
      </div>
    );
  }

  return null;
}

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
      {/* Left sidebar - AI Tools */}
      <aside className="space-y-3 lg:col-span-4 xl:col-span-3">
        <h3 className="mb-4 px-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          AI Araçları
        </h3>
        {AI_TOOLS.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            checked={aiTools[tool.id]}
            isSelected={selectedTool === tool.id}
            onToggle={() => handleToolToggle(tool.id)}
            onSelect={() => handleToolSelect(tool.id)}
          />
        ))}
      </aside>

      {/* Main area - Tool detail panel */}
      <div className="lg:col-span-8 xl:col-span-9">
        {!selectedTool ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30">
            <p className="text-muted-foreground">
              Detayları görmek için bir AI aracı seçin
            </p>
          </div>
        ) : selectedTool === "replaceFurniture" ? (
          <FurnitureSelectionPanel
            selectableTemplates={selectableTemplates}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={onSelectTemplate}
            title={getPanelTitle(selectedTool)}
          />
        ) : (
          <ToolDetailContent
            toolId={selectedTool}
            title={getPanelTitle(selectedTool)}
          />
        )}
      </div>
    </div>
  );
}

