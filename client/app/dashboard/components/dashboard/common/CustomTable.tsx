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

export interface Column<T> {
  key: keyof T | string;
  label: string;
  className?: string;
  cellClassName?: string;
  exportable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface CustomTableProps<T> {
  caption?: string;
  columns: Column<T>[];
  data: T[];
  limit?: number;
  renderCell?: (row: T, key: keyof T) => React.ReactNode;

  onSelectionChange?: (rows: T[]) => void;
  onDelete?: (rows: T[]) => void;

  addButtonLabel?: string;
  onAddClick?: () => void;

  searchableKeys?: (keyof T)[];
  filterOptions?: { label: string; value: string; key: keyof T }[];
}

const CustomTable = <T extends Record<string, any>>({
  caption,
  columns,
  data,
  limit = 10,
  renderCell,
  onSelectionChange,
  onDelete,
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
          String(row[key]).toLowerCase().includes(search.toLowerCase())
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

  const allSelected =
    selectedRows.size === filteredData.length && filteredData.length > 0;

  const toggleAll = () => {
    allSelected
      ? setSelectedRows(new Set())
      : setSelectedRows(new Set(filteredData.map((_, i) => i)));
  };

  const selectedData = Array.from(selectedRows).map((idx) => filteredData[idx]);

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
      <div className="flex justify-end mb-4">
        <Button
          onClick={onAddClick}
          className="
    bg-[var(--brand-600)]
    hover:bg-[var(--brand-700)]
    text-white  mb-4
  "
        >
          {addButtonLabel ?? "Add"}
        </Button>
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
                    ? col.render(row)
                    : renderCell
                    ? renderCell(row, col.key as keyof T)
                    : row[col.key]}
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
