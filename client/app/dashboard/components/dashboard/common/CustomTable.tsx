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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash, Download } from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  className?: string;
  cellClassName?: string;
}

interface CustomTableProps<T> {
  caption?: string;
  columns: Column<T>[];
  data: T[];
  page?: number;
  limit?: number;
  renderCell?: (row: T, key: keyof T) => React.ReactNode;
  onSelectionChange?: (selectedRows: T[]) => void;
  onDelete?: (selectedRows: T[]) => void;
  onExport?: (selectedRows: T[]) => void;
}

const CustomTable = <T extends { [key: string]: any }>({
  caption,
  columns,
  data,
  page = 1,
  limit = 10,
  renderCell,
  onSelectionChange,
  onDelete,
  onExport,
}: CustomTableProps<T>) => {
  const startIndex = (page - 1) * limit + 1;

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const allSelected = selectedRows.size === data.length && data.length > 0;

  const toggleRow = (index: number) => {
    const newSet = new Set(selectedRows);
    if (newSet.has(index)) newSet.delete(index);
    else newSet.add(index);
    setSelectedRows(newSet);
  };

  const toggleAll = () => {
    if (allSelected) setSelectedRows(new Set());
    else setSelectedRows(new Set(data.map((_, idx) => idx)));
  };

  useEffect(() => {
    if (onSelectionChange) {
      const selectedData = Array.from(selectedRows).map(idx => data[idx]);
      onSelectionChange(selectedData);
    }
  }, [selectedRows, data, onSelectionChange]);


  const selectedData = Array.from(selectedRows).map((idx) => data[idx]);

  return (
    <div>
      {/* Bulk Action Buttons */}
      {selectedRows.size > 0 && (
        <div className="flex justify-end gap-2 mb-4">
          <Button
            variant="destructive"
            size="lg"
            className="flex items-center gap-2"
            onClick={() => onDelete?.(selectedData)}
          >
            <Trash className="w-5 h-5 text-white" /> Delete ({selectedRows.size})
          </Button>
          <Button
            variant="default"
            size="lg"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => onExport?.(selectedData)}
          >
            <Download className="w-5 h-5 text-white" /> Export ({selectedRows.size})
          </Button>
        </div>
      )}

      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}

        <TableHeader>
          <TableRow>
            {/* Bulk checkbox */}
            <TableHead className="w-12">
              <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
            </TableHead>

            {columns.map((col) => (
              <TableHead key={String(col.key)} className={col.className || ""}>
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              {/* Row checkbox */}
              <TableCell>
                <Checkbox
                  checked={selectedRows.has(idx)}
                  onCheckedChange={() => toggleRow(idx)}
                />
              </TableCell>

              {columns.map((col) => (
                <TableCell
                  key={String(col.key)}
                  className={col.cellClassName || ""}
                >
                  {col.key === "sn"
                    ? startIndex + idx
                    : col.key === "photo"
                      ? (
                        <img
                          src={row[col.key as keyof T] as unknown as string}
                          alt={row.name ?? ""}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )
                      : renderCell
                        ? renderCell(row, col.key as keyof T)
                        : (row[col.key as keyof T] as unknown as React.ReactNode)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomTable;
