"use client";

import { useTranslation } from "react-i18next";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ColumnConfig {
  id: string;
  label: string;
  width: number;
  minWidth?: number;
  maxWidth?: number;
}

export function DataTableHeader() {
  const { t } = useTranslation();

  const columnConfigs: ColumnConfig[] = [
    {
      id: "name",
      label: t("dashboard.projects", "Project"),
      width: 300,
      minWidth: 200,
    },
    {
      id: "status",
      label: t("dashboard.filters.status", "Status"),
      width: 130,
      minWidth: 110,
      maxWidth: 150,
    },
    {
      id: "images",
      label: t("pricing.images", "Images"),
      width: 140,
      minWidth: 120,
      maxWidth: 160,
    },
    {
      id: "createdAt",
      label: t("common.date", "Created"), // Need to check if date key exists, if not use generic
      width: 120,
      minWidth: 100,
      maxWidth: 140,
    },
    { id: "actions", label: "", width: 60, minWidth: 60, maxWidth: 60 },
  ];

  return (
    <TableHeader>
      <TableRow className="flex hover:bg-transparent">
        {columnConfigs.map((column) => {
          const isFlexColumn = column.id === "name";
          return (
            <TableHead
              className="flex items-center"
              key={column.id}
              style={
                isFlexColumn
                  ? { flex: 1, minWidth: column.minWidth }
                  : {
                      width: column.width,
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                    }
              }
            >
              <span className="font-medium text-muted-foreground">
                {column.label}
              </span>
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
}
