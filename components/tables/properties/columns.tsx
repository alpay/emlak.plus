"use client";

import {
  IconAlertTriangle,
  IconCheck,
  IconClock,
  IconDotsVertical,
  IconDownload,
  IconEye,
  IconLoader2,
  IconPhoto,
  IconTrash,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import NextImage from "next/image";
import Link from "next/link";
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Project, ProjectStatus } from "@/lib/db/schema";
import { getTemplateById } from "@/lib/style-templates";

// Status config using CSS custom properties
const statusConfig: Record<
  ProjectStatus,
  { color: string; label: string; icon: React.ReactNode }
> = {
  completed: {
    color: "var(--accent-green)",
    label: "Completed",
    icon: <IconCheck className="h-3 w-3" />,
  },
  processing: {
    color: "var(--accent-amber)",
    label: "Processing",
    icon: <IconLoader2 className="h-3 w-3 animate-spin" />,
  },
  pending: {
    color: "var(--accent-teal)",
    label: "Pending",
    icon: <IconClock className="h-3 w-3" />,
  },
  failed: {
    color: "var(--accent-red, #ef4444)",
    label: "Failed",
    icon: <IconAlertTriangle className="h-3 w-3" />,
  },
};

// Memoized cell components for performance
const ProjectNameCell = memo(
  ({
    name,
    styleTemplateId,
    thumbnailUrl,
    id,
  }: {
    name: string;
    styleTemplateId: string;
    thumbnailUrl: string | null;
    id: string;
  }) => {
    const template = getTemplateById(styleTemplateId);
    return (
      <Link
        className="group flex min-w-0 items-center gap-3"
        href={`/dashboard/${id}`}
      >
        <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
          {thumbnailUrl ? (
            <NextImage
              alt={name}
              className="object-cover transition-transform group-hover:scale-105"
              fill
              sizes="56px"
              src={thumbnailUrl}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <IconPhoto className="h-4 w-4 text-muted-foreground/50" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <span className="block truncate font-medium transition-colors group-hover:text-[var(--accent-teal)]">
            {name}
          </span>
          <span className="block truncate text-muted-foreground text-xs">
            {template?.name || "Unknown Style"}
          </span>
        </div>
      </Link>
    );
  }
);
ProjectNameCell.displayName = "ProjectNameCell";

const StatusCell = memo(({ status }: { status: ProjectStatus }) => {
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <Badge
      className="gap-1 border-transparent"
      style={{
        backgroundColor: `color-mix(in oklch, ${config.color} 15%, transparent)`,
        color: config.color,
      }}
      variant="outline"
    >
      {config.icon}
      {config.label}
    </Badge>
  );
});
StatusCell.displayName = "StatusCell";

const ImageCountCell = memo(
  ({
    imageCount,
    completedCount,
  }: {
    imageCount: number;
    completedCount: number;
  }) => (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm">
        {completedCount}/{imageCount}
      </span>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${imageCount > 0 ? (completedCount / imageCount) * 100 : 0}%`,
            backgroundColor: "var(--accent-teal)",
          }}
        />
      </div>
    </div>
  )
);
ImageCountCell.displayName = "ImageCountCell";

const DateCell = memo(({ date }: { date: Date }) => (
  <span className="text-muted-foreground text-sm">
    {format(new Date(date), "MMM d, yyyy")}
  </span>
));
DateCell.displayName = "DateCell";

const ActionsCell = memo(({ project }: { project: Project }) => (
  <div className="flex items-center justify-center">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-8 w-8 p-0" variant="ghost">
          <IconDotsVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/${project.id}`}>
            <IconEye className="mr-2 h-4 w-4" />
            View details
          </Link>
        </DropdownMenuItem>
        {project.status === "completed" && (
          <DropdownMenuItem asChild>
            <a href={`/api/download/${project.id}`}>
              <IconDownload className="mr-2 h-4 w-4" />
              Download all
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => {
            // TODO: Implement delete with confirmation
            console.log("Delete", project.id);
          }}
        >
          <IconTrash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
));
ActionsCell.displayName = "ActionsCell";

export const columns: ColumnDef<Project>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Project",
    size: 300,
    minSize: 200,
    cell: ({ row }) => (
      <ProjectNameCell
        id={row.original.id}
        name={row.original.name}
        styleTemplateId={row.original.styleTemplateId}
        thumbnailUrl={row.original.thumbnailUrl}
      />
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    size: 130,
    minSize: 110,
    cell: ({ row }) => (
      <StatusCell status={row.original.status as ProjectStatus} />
    ),
  },
  {
    id: "images",
    accessorKey: "imageCount",
    header: "Images",
    size: 140,
    minSize: 120,
    cell: ({ row }) => (
      <ImageCountCell
        completedCount={row.original.completedCount}
        imageCount={row.original.imageCount}
      />
    ),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created",
    size: 120,
    minSize: 100,
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
  },
  {
    id: "actions",
    header: "",
    size: 60,
    minSize: 60,
    maxSize: 60,
    enableResizing: false,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => <ActionsCell project={row.original} />,
  },
];
