"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { Project } from "@/lib/db/schema";
import { columns } from "./columns";
import { EmptyState } from "./empty-states";
import { DataTableHeader } from "./table-header";
import { VirtualRow } from "./virtual-row";

const ROW_HEIGHT = 64;

interface DataTableProps {
  projects: Project[];
}

export function DataTable({ projects }: DataTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Set up TanStack Table
  const table = useReactTable({
    data: projects,
    getRowId: (row) => row.id,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  // Set up row virtualization
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  // Empty state (no data)
  if (projects.length === 0) {
    return <EmptyState />;
  }

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div className="relative overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-foreground/10">
      {/* Table Header */}
      <div className="border-border border-b">
        <Table>
          <DataTableHeader />
        </Table>
      </div>

      {/* Scrollable body with virtualization */}
      <div
        className="scrollbar-thin overflow-auto"
        ref={parentRef}
        style={{ height: "calc(100vh - 420px)", minHeight: "300px" }}
      >
        <Table>
          <TableBody
            className="relative block"
            style={{ height: rowVirtualizer.getTotalSize() }}
          >
            {virtualItems.length > 0 ? (
              virtualItems.map((virtualRow) => {
                const row = rows[virtualRow.index];
                if (!row) {
                  return null;
                }

                return (
                  <VirtualRow
                    key={row.id}
                    row={row}
                    rowHeight={ROW_HEIGHT}
                    virtualStart={virtualRow.start}
                  />
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer with count */}
      <div className="border-t px-4 py-3 text-muted-foreground text-sm">
        <span
          className="font-mono font-semibold"
          style={{ color: "var(--accent-teal)" }}
        >
          {projects.length}
        </span>{" "}
        project{projects.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
