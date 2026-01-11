"use client";

import {
  IconLayoutGrid,
  IconPlus,
  IconSearch,
  IconSparkles,
  IconTable,
  IconX,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { EmptyProjects } from "@/components/dashboard/empty-projects";
import { ProjectsGrid } from "@/components/dashboard/projects-grid";
import { StatsBar } from "@/components/dashboard/stats-bar";
import { DataTable } from "@/components/tables/properties/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Project } from "@/lib/db/schema";
import { STYLE_TEMPLATES } from "@/lib/style-templates";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "table";

function ViewToggle({
  view,
  onViewChange,
}: {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center rounded-lg bg-muted/50 p-1 ring-1 ring-foreground/5">
      <button
        aria-label={t("dashboard.filters.grid")}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200",
          view === "grid"
            ? "bg-background shadow-sm ring-1 ring-foreground/5"
            : "text-muted-foreground hover:text-foreground"
        )}
        onClick={() => onViewChange("grid")}
        type="button"
      >
        <IconLayoutGrid
          className="h-4 w-4"
          style={{ color: view === "grid" ? "var(--accent-teal)" : undefined }}
        />
      </button>
      <button
        aria-label={t("dashboard.filters.table")}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200",
          view === "table"
            ? "bg-background shadow-sm ring-1 ring-foreground/5"
            : "text-muted-foreground hover:text-foreground"
        )}
        onClick={() => onViewChange("table")}
        type="button"
      >
        <IconTable
          className="h-4 w-4"
          style={{ color: view === "table" ? "var(--accent-teal)" : undefined }}
        />
      </button>
    </div>
  );
}

interface DashboardContentProps {
  projects: Project[];
  stats: {
    totalProjects: number;
    completedProjects: number;
    processingProjects: number;
    failedProjects: number;
    totalImages: number;
  };
}

const PROJECT_STATUSES = [
  "pending",
  "processing",
  "completed",
  "failed",
] as const;

// Get unique styles used in projects
function getUsedStyles(projects: Project[]) {
  const styleIds = new Set(projects.map((p) => p.styleTemplateId));
  return STYLE_TEMPLATES.filter((t) => styleIds.has(t.id) && !t.comingSoon);
}

export function DashboardContent({ projects, stats }: DashboardContentProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [view, setView] = useQueryState(
    "view",
    parseAsStringLiteral(["grid", "table"] as const).withDefault("grid")
  );
  const [statusFilter, setStatusFilter] = useQueryState(
    "status",
    parseAsStringLiteral(PROJECT_STATUSES)
  );
  const [searchQuery, setSearchQuery] = useQueryState("q", parseAsString);
  const [styleFilter, setStyleFilter] = useQueryState("style", parseAsString);

  // Available styles based on projects
  const usedStyles = useMemo(() => getUsedStyles(projects), [projects]);

  // Filter projects based on status, search, and style
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Status filter
    if (statusFilter) {
      if (statusFilter === "processing") {
        filtered = filtered.filter(
          (p) => p.status === "processing" || p.status === "pending"
        );
      } else {
        filtered = filtered.filter((p) => p.status === statusFilter);
      }
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(query));
    }

    // Style filter
    if (styleFilter) {
      filtered = filtered.filter((p) => p.styleTemplateId === styleFilter);
    }

    return filtered;
  }, [projects, statusFilter, searchQuery, styleFilter]);

  const hasProjects = projects.length > 0;
  const hasFilteredProjects = filteredProjects.length > 0;
  const hasActiveFilters = !!(statusFilter || searchQuery || styleFilter);

  const clearAllFilters = () => {
    setStatusFilter(null);
    setSearchQuery(null);
    setStyleFilter(null);
  };

  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8">
      {/* Page header with icon badge */}
      <div className="animate-fade-in-up space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ring-1 ring-white/10"
              style={{ backgroundColor: "var(--accent-teal)" }}
            >
              <IconSparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-2xl tracking-tight">{t("dashboard.projects")}</h1>
              <p className="text-muted-foreground text-sm">
                {t("dashboard.subtitle", "Gayrimenkul fotoğraflarınızı AI ile dönüştürün")}
              </p>
            </div>
          </div>

          {/* Actions: View Toggle + New Project */}
          {hasProjects && (
            <div className="flex items-center gap-3">
              <ViewToggle onViewChange={setView} view={view} />
              <Button
                className="gap-2 shadow-sm"
                onClick={() => router.push("/dashboard/new")}
                style={{ backgroundColor: "var(--accent-teal)" }}
              >
                <IconPlus className="h-4 w-4" />
                <span className="hidden sm:inline">{t("dashboard.newProject")}</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {hasProjects ? (
        <>
          {/* Stats bar */}
          <StatsBar
            activeStatus={statusFilter}
            completedProperties={stats.completedProjects}
            failedProperties={stats.failedProjects}
            onStatusFilter={(status) => setStatusFilter(status)}
            processingProperties={stats.processingProjects}
            totalEdits={stats.totalImages}
            totalProperties={stats.totalProjects}
          />

          {/* Search and filters toolbar */}
          <div className="stagger-2 animate-fade-in-up">
            <div className="flex flex-col gap-3 rounded-xl bg-muted/30 p-3 ring-1 ring-foreground/5 sm:flex-row sm:items-center">
              {/* Search input */}
              <div className="relative flex-1 sm:max-w-[320px]">
                <IconSearch className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="border-foreground/10 bg-background/80 pl-9 transition-shadow focus:ring-2 focus:ring-[var(--accent-teal)]/20"
                  onChange={(e) => setSearchQuery(e.target.value || null)}
                  placeholder={t("dashboard.searchProjects", "İlan ara...")}
                  value={searchQuery || ""}
                />
              </div>

              {/* Style filter */}
              {usedStyles.length > 1 && (
                <Select
                  onValueChange={(value) =>
                    setStyleFilter(value === "all" ? null : value)
                  }
                  value={styleFilter || "all"}
                >
                  <SelectTrigger className="w-full border-foreground/10 bg-background/80 sm:w-[180px]">
                    <SelectValue placeholder={t("dashboard.allStyles", "Tüm stiller")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("dashboard.allStyles", "Tüm stiller")}</SelectItem>
                    {usedStyles.map((style) => (
                      <SelectItem key={style.id} value={style.id}>
                        {style.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Clear filters */}
              {hasActiveFilters && (
                <Button
                  className="text-muted-foreground transition-colors hover:text-destructive"
                  onClick={clearAllFilters}
                  size="sm"
                  variant="ghost"
                >
                  <IconX className="mr-1 h-3.5 w-3.5" />
                  {t("common.clearFilters")}
                </Button>
              )}
            </div>
          </div>

          {/* Content based on view mode */}
          <div className="stagger-3 animate-fade-in-up">
            {!hasFilteredProjects && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-foreground/10 border-dashed py-12 text-center">
                <IconSearch className="mb-4 h-10 w-10 text-muted-foreground/30" />
                <p className="text-muted-foreground">
                  {t("dashboard.noMatchingProjects", "Filtrelerinize uygun ilan bulunamadı")}
                </p>
                <Button
                  className="mt-4"
                  onClick={clearAllFilters}
                  variant="outline"
                >
                  {t("common.clearFilters")}
                </Button>
              </div>
            )}
            {hasFilteredProjects && view === "grid" && (
              <ProjectsGrid projects={filteredProjects} />
            )}
            {hasFilteredProjects && view === "table" && (
              <DataTable projects={filteredProjects} />
            )}
          </div>
        </>
      ) : (
        /* Empty state */
        <EmptyProjects onCreateClick={() => router.push("/dashboard/new")} />
      )}
    </div>
  );
}
