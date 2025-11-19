"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { exportExcel, exportPDF } from "@/app/dashboard/utils/exportData";
import { X } from "lucide-react";
import CustomTable from "./CustomTable";
import logo from "@/../public/salyansthan-logo.png"; // <-- IMPORT LOGO

interface PreviewModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  data: T[];
  columns: { key: keyof T; label: string }[];
  title?: string;
}

const PreviewModal = <T extends { [key: string]: any }>({
  isOpen,
  onClose,
  data,
  columns,
  title = "Preview Report",
}: PreviewModalProps<T>) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-6xl h-[80%] flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">{title}</h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* CONTENT */}
        <div className="overflow-auto p-4 flex-1">

          {/* ======= STATIC LETTERHEAD START ======= */}
          <div className="flex flex-row items-start gap-4 mb-6">

            {/* Logo Left */}
            <img
              src={logo.src}
              alt="School Logo"
              className="w-20 h-20 object-cover"
            />

            {/* Right Text */}
            <div className="leading-tight">

              <h1 className="text-2xl font-black uppercase">
                SALYANSTHAN SECONDARY SCHOOL
              </h1>

              <p className="italic text-sm mt-1">“Dedicated to Excellence”</p>

              <p className="text-sm mt-1">Kirtipur-4, Salyansthan, Kathmandu</p>
              <p className="text-sm">Email: schoolsalyansthan@gmail.com</p>
              <p className="text-sm">Phone: 01-5904264</p>
            </div>
          </div>

          {/* Centered Title Below Header */}
          <h2 className="text-center text-xl font-bold my-4">{title}</h2>

          {/* ======= STATIC LETTERHEAD END ======= */}

          {/* TABLE PREVIEW */}
          <CustomTable
            caption={title}
            columns={columns.map((c) => ({
              key: c.key,
              label: c.label,
              exportable: true,
            }))}
            data={data}
            page={1}
            limit={data.length}
            renderCell={(row, key) =>
              key === "sn" ? (
                row["sn"]
              ) : key === "photo" ? (
                <img
                  src={row[key]}
                  alt={row.name || ""}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                row[key]
              )
            }
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <Button
            onClick={() => exportExcel(data, columns, title)}
            className="bg-green-600 text-white"
          >
            Export Excel
          </Button>

          <Button
            onClick={() => exportPDF(data, columns, title)}
            className="bg-blue-600 text-white"
          >
            Export PDF
          </Button>

          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
