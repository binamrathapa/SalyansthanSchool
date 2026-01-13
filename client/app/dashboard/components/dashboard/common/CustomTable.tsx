"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SearchFilterBar from "@/components/ui/SearchFilterBar ";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { exportWithPreview } from "@/app/dashboard/utils/exportWithPreview";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Download, Trash } from "lucide-react";

<<<<<<< HEAD
/* ---------------- COLUMN TYPES ---------------- */
=======
import { Download, Trash } from "lucide-react";

>>>>>>> 840f115b709da100e16d6bbd5b40713a743d6502
export interface Column<T> {
  key: keyof T | string;
  label: string;
  className?: string;
  cellClassName?: string;
  exportable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
}

/* ---------------- PROPS ---------------- */
interface CustomTableProps<T> {
  caption?: string;
  columns: Column<T>[];
  data: T[];
  limit?: number;
  renderCell?: (row: T, key: keyof T) => React.ReactNode;

  onSelectionChange?: (rows: T[]) => void;
  onDelete?: (rows: T[]) => void;
  showDelete?: boolean;

  addButtonLabel?: string;
  onAddClick?: () => void;

  searchableKeys?: (keyof T)[];
  filterOptions?: { label: string; value: string; key: keyof T }[];
}

<<<<<<< HEAD
/* ---------------- COMPONENT ---------------- */
=======
>>>>>>> 840f115b709da100e16d6bbd5b40713a743d6502
const CustomTable = <T extends Record<string, any>>({
  caption,
  columns,
  data,
  limit = 10,
  renderCell,
  onSelectionChange,
  onDelete,
  showDelete = false,
  addButtonLabel,
  onAddClick,
  searchableKeys = [],
  filterOptions = [],
}: CustomTableProps<T>) => {
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  /* ---------------- FILTER + SEARCH ---------------- */
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchesSearch =
        !search ||
        searchableKeys.some((key) =>
<<<<<<< HEAD
          String(row[key] ?? "")
            .toLowerCase()
            .includes(search.toLowerCase())
=======
          String(row[key]).toLowerCase().includes(search.toLowerCase())
>>>>>>> 840f115b709da100e16d6bbd5b40713a743d6502
        );

      const filterConfig = filterOptions.find((f) => f.value === filter);
      const matchesFilter = filterConfig
        ? row[filterConfig.key] === filterConfig.value
        : true;

      return matchesSearch && matchesFilter;
    });
  }, [data, search, filter, searchableKeys, filterOptions]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredData.length / limit);
  const startIndex = (page - 1) * limit;
  const pageData = filteredData.slice(startIndex, startIndex + limit);

  useEffect(() => {
    setPage(1);
    setSelectedRows(new Set());
  }, [search, filter]);

  /* ---------------- SELECTION ---------------- */
  const toggleRow = (index: number) => {
    const newSet = new Set(selectedRows);
    newSet.has(index) ? newSet.delete(index) : newSet.add(index);
    setSelectedRows(newSet);
  };

<<<<<<< HEAD
  const allSelected =
    filteredData.length > 0 &&
    filteredData.every((_, i) => selectedRows.has(i + startIndex));

  const toggleAll = () => {
    const newSet = new Set(selectedRows);
    if (allSelected) {
      // Deselect all visible rows
      filteredData.forEach((_, i) => newSet.delete(i + startIndex));
    } else {
      filteredData.forEach((_, i) => newSet.add(i + startIndex));
    }
    setSelectedRows(newSet);
  };

  const selectedData = Array.from(selectedRows).map(
    (idx) => filteredData[idx - startIndex] || filteredData[0]
  );
=======
  // allSelected should only consider currently filtered data
  const allSelected =
    filteredData.length > 0 &&
    filteredData.every((_, i) => selectedRows.has(i));

  const toggleAll = () => {
    if (allSelected) {
      // Deselect all filtered rows
      const newSet = new Set(selectedRows);
      filteredData.forEach((_, i) => newSet.delete(i));
      setSelectedRows(newSet);
    } else {
      // Select all filtered rows
      const newSet = new Set(selectedRows);
      filteredData.forEach((_, i) => newSet.add(i));
      setSelectedRows(newSet);
    }
  };

  const selectedData = Array.from(selectedRows).map((idx) => filteredData[idx]);
>>>>>>> 840f115b709da100e16d6bbd5b40713a743d6502

  useEffect(() => {
    onSelectionChange?.(selectedData);
  }, [selectedRows]);

  /* ---------------- EXPORT ---------------- */
  const exportColumns = columns
    .filter((c) => c.exportable !== false)
    .map((c) => ({ key: c.key as keyof T, label: c.label }));

  const handleExport = () =>
    exportWithPreview(selectedData, exportColumns, caption || "Export");

  return (
    <div>
      {/* Bulk Actions */}
      {selectedRows.size > 0 && (
        <div className="flex justify-end gap-2 mb-4">
          {showDelete && onDelete && (
            <Button
              variant="destructive"
              size="lg"
              onClick={() => onDelete(selectedData)}
              className="flex items-center gap-2"
            >
              <Trash className="w-5 h-5" /> Delete ({selectedRows.size})
            </Button>
          )}

          {
            <Button
              variant="default"
              size="lg"
              className="flex items-center gap-2 bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white transition-colors duration-200"
              onClick={handleExport}
            >
              <Download className="w-5 h-5 text-white" /> Export (
              {selectedRows.size})
            </Button>
          }
        </div>
      )}
      {/* Search / Filter */}
      <SearchFilterBar
        search={search}
        filter={filter}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        filterOptions={filterOptions.map(({ label, value }) => ({
          label,
          value,
        }))}
      />

      {/* Add Button */}
      {addButtonLabel && onAddClick && (
        <div className="flex justify-end mb-4">
          <Button
<<<<<<< HEAD
            variant="default"
            size="lg"
            className="flex items-center gap-2 bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white transition-colors duration-200"
            onClick={handleExport}
          >
            <Download className="w-5 h-5 text-white" /> Export ({selectedRows.size})
          </Button>
        </div>
      )}

      {/* Search / Filter */}
      <SearchFilterBar
        search={search}
        filter={filter}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        filterOptions={filterOptions.map(({ label, value }) => ({ label, value }))}
      />

      {/* Add Button */}
      {addButtonLabel && onAddClick && (
        <div className="flex justify-end mb-4">
          <Button
            onClick={onAddClick}
            className="flex items-center gap-2 bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white transition-colors duration-200"
          >
=======
            onClick={onAddClick}
            className="flex items-center gap-2 bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white transition-colors duration-200"
          >
>>>>>>> 840f115b709da100e16d6bbd5b40713a743d6502
            {addButtonLabel}
          </Button>
        </div>
      )}

      {/* Table */}
      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
            </TableHead>
            {columns.map((col) => (
              <TableHead key={String(col.key)}>{col.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {pageData.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Checkbox
                  checked={selectedRows.has(startIndex + idx)}
                  onCheckedChange={() => toggleRow(startIndex + idx)}
                />
              </TableCell>

              {columns.map((col) => (
                <TableCell key={String(col.key)}>
                  {col.key === "sn"
                    ? startIndex + idx + 1
                    : col.render
                    ? col.render(row, startIndex + idx)
                    : renderCell
                    ? renderCell(row, col.key as keyof T)
<<<<<<< HEAD
                    : (row[col.key as keyof T] as React.ReactNode)}
=======
                    : row[col.key]}
>>>>>>> 840f115b709da100e16d6bbd5b40713a743d6502
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4 justify-end">
          <PaginationContent>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            />
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default CustomTable;
