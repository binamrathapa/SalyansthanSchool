"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/dashboard/components/ui/table";
import SearchFilterBar from "@/app/dashboard/components/ui/SearchFilterBar ";
import { Checkbox } from "@/app/dashboard/components/ui/checkbox";
import { Button } from "@/app/dashboard/components/ui/button";
import { Trash, Download } from "lucide-react";
import { exportWithPreview } from "@/app/dashboard/utils/exportWithPreview";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/app/dashboard/components/ui/pagination";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  className?: string;
  cellClassName?: string;
  exportable?: boolean;
  render?: (row: T) => React.ReactNode; // column-level custom render
}

interface CustomTableProps<T> {
  caption?: string;
  columns: Column<T>[];
  data: T[];
  limit?: number;
  renderCell?: (row: T, key: keyof T) => React.ReactNode; // fallback render
  onSelectionChange?: (selectedRows: T[]) => void;
  onDelete?: (selectedRows: T[]) => void;
}

const CustomTable = <T extends { [key: string]: any }>({
  caption,
  columns,
  data,
  limit = 10,
  renderCell,
  onSelectionChange,
  onDelete,
}: CustomTableProps<T>) => {
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const allSelected = selectedRows.size === data.length && data.length > 0;

  const totalPages = Math.ceil(data.length / limit);
  const startIndex = (page - 1) * limit;
  const pageData = data.slice(startIndex, startIndex + limit);

  const toggleRow = (index: number) => {
    const newSet = new Set(selectedRows);
    newSet.has(index) ? newSet.delete(index) : newSet.add(index);
    setSelectedRows(newSet);
  };

  const toggleAll = () => {
    allSelected
      ? setSelectedRows(new Set())
      : setSelectedRows(new Set(data.map((_, idx) => idx)));
  };

  useEffect(() => {
    if (onSelectionChange) {
      const selectedData = Array.from(selectedRows).map((idx) => data[idx]);
      onSelectionChange(selectedData);
    }
  }, [selectedRows, data]);

  const selectedData = Array.from(selectedRows).map((idx) => data[idx]);

  const exportColumns = columns
    .filter((c) => c.exportable !== false)
    .map((c) => ({ key: c.key as keyof T, label: c.label }));

  const handleExport = () => {
    exportWithPreview(selectedData, exportColumns, caption || "Export");
  };

  return (
    <div>
      {/* Bulk Actions */}
      {selectedRows.size > 0 && (
        <div className="flex justify-end gap-2 mb-4">
          <Button
            variant="destructive"
            size="lg"
            onClick={() => onDelete?.(selectedData)}
            className="flex items-center gap-2"
          >
            <Trash className="w-5 h-5" /> Delete ({selectedRows.size})
          </Button>

          <Button
            variant="default"
            size="lg"
            className="flex items-center gap-2 bg-green-600 text-white"
            onClick={handleExport}
          >
            <Download className="w-5 h-5 text-white" /> Export (
            {selectedRows.size})
          </Button>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex justify-end mb-4 gap-2">
        <SearchFilterBar
          search={search}
          filter={filter}
          onSearchChange={setSearch}
          onFilterChange={setFilter}
          filterOptions={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
        />
      </div>

      {/* Table */}
      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}

        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
            </TableHead>

            {columns.map((col) => (
              <TableHead key={String(col.key)} className={col.className}>
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {pageData.map((row, idx) => (
            <TableRow key={startIndex + idx}>
              <TableCell>
                <Checkbox
                  checked={selectedRows.has(startIndex + idx)}
                  onCheckedChange={() => toggleRow(startIndex + idx)}
                />
              </TableCell>

              {columns.map((col) => (
                <TableCell key={String(col.key)} className={col.cellClassName}>
                  {col.render
                    ? col.render(row) 
                    : renderCell
                    ? renderCell(row, col.key as keyof T) 
                    : row[col.key]}{" "}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 w-full flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} –{" "}
            {Math.min(startIndex + limit, data.length)} of {data.length}
          </div>

          <Pagination>
            <PaginationContent className="flex items-center gap-2">
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.max(p - 1, 1));
                  }}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(p);
                    }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {totalPages > 5 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.min(p + 1, totalPages));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default CustomTable;
