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
import SearchFilterBar from "@/components/ui/SearchFilterBar";
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

export interface Column<T> {
  key: keyof T | string;
  label: string;
  className?: string;
  cellClassName?: string;
  exportable?: boolean;
  visible?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
}

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
  isLoading?: boolean;

  // Server-side props
  serverSide?: boolean;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onSearchChange?: (search: string) => void;
  onFilterChange?: (filter: string) => void;
  searchValue?: string;
  filterValue?: string;
}

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
  isLoading = false,
  serverSide = false,
  totalItems,
  currentPage,
  onPageChange,
  onSearchChange,
  onFilterChange,
  searchValue,
  filterValue,
}: CustomTableProps<T>) => {
  const [internalPage, setInternalPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [internalSearch, setInternalSearch] = useState("");
  const [internalFilter, setInternalFilter] = useState("");

  const page = serverSide && currentPage !== undefined ? currentPage : internalPage;
  const search = serverSide ? (searchValue ?? "") : internalSearch;
  const filter = serverSide ? (filterValue ?? "") : internalFilter;

  // If serverSide, search and filter state should probably be lifted to parent.
  // But for backward compatibility, we can keep internal state and just use it as "initial" or "local".
  // Let's refine this: if serverSide is true, we use props for state.


  /* ---------------- FILTER + SEARCH ---------------- */
  const filteredData = useMemo(() => {
    if (serverSide) return data; // Data is already filtered by server

    return data.filter((row) => {
      const matchesSearch =
        !search ||
        searchableKeys.some((key) =>
          String(row[key]).toLowerCase().includes(search.toLowerCase())
        );

      const filterConfig = filterOptions.find((f) => f.value === filter);
      const matchesFilter = filterConfig
        ? row[filterConfig.key] === filterConfig.value
        : true;

      return matchesSearch && matchesFilter;
    });
  }, [data, search, filter, searchableKeys, filterOptions, serverSide]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = serverSide && totalItems !== undefined
    ? Math.ceil(totalItems / limit)
    : Math.ceil(filteredData.length / limit);

  const startIndex = (page - 1) * limit;
  const pageData = serverSide ? data : filteredData.slice(startIndex, startIndex + limit);

  useEffect(() => {
    if (!serverSide) {
      setInternalPage(1);
      setSelectedRows(new Set());
    }
  }, [search, filter, serverSide]);

  /* ---------------- SELECTION ---------------- */
  const toggleRow = (index: number) => {
    const newSet = new Set(selectedRows);
    newSet.has(index) ? newSet.delete(index) : newSet.add(index);
    setSelectedRows(newSet);
  };

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

  useEffect(() => {
    onSelectionChange?.(selectedData);
  }, [selectedRows]);

  /* ---------------- EXPORT ---------------- */
  const exportColumns = columns
    .filter((c) => c.exportable !== false)
    .map((c) => ({ key: c.key as keyof T, label: c.label }));

  const visibleColumns = columns.filter((c) => c.visible !== false);


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
        onSearchChange={(val: any) => {
          if (serverSide) onSearchChange?.(val);
          else setInternalSearch(val);
        }}
        onFilterChange={(val: any) => {
          if (serverSide) onFilterChange?.(val);
          else setInternalFilter(val);
        }}
        filterOptions={filterOptions.map(({ label, value }) => ({
          label,
          value,
        }))}
      />

      {/* Add Button */}
      {addButtonLabel && onAddClick && (
        <div className="flex justify-end mb-4">
          <Button
            onClick={onAddClick}
            className="flex items-center gap-2 bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white transition-colors duration-200"
          >
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
            {visibleColumns.map((col) => (
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

              {visibleColumns.map((col) => (
                <TableCell key={String(col.key)} className={col.cellClassName}>
                  {col.render
                    ? col.render(row, startIndex + idx)
                    : col.key === "sn"
                      ? startIndex + idx + 1
                      : col.key in row
                        ? row[col.key as keyof T]
                        : null}
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
              onClick={() => {
                if (serverSide) onPageChange?.(Math.max(page - 1, 1));
                else setInternalPage((p) => Math.max(p - 1, 1));
              }}
            />
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => {
                    if (serverSide) onPageChange?.(i + 1);
                    else setInternalPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext
              onClick={() => {
                if (serverSide) onPageChange?.(Math.min(page + 1, totalPages));
                else setInternalPage((p) => Math.min(p + 1, totalPages));
              }}
            />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default CustomTable; 