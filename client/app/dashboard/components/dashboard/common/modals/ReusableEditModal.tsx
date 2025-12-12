"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/dashboard/components/ui/dialog";
import {
  X,
  Calendar,
  Phone,
  Globe,
  FileText,
  Hash,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/app/dashboard/components/ui/input";
import { Button } from "@/app/dashboard/components/ui/button";

type FieldType =
  | "text"
  | "image"
  | "date"
  | "number"
  | "email"
  | "phone"
  | "url";

interface EditModalField<T> {
  label: string;
  key: keyof T;
  type: FieldType;
  icon?: React.ReactNode;
  className?: string;
}

interface EditModalProps<T> {
  open: boolean;
  onClose: () => void;
  title?: string;
  data: T | null;
  fields: EditModalField<T>[];
  onSubmit: (updatedData: T) => void;
  size?: "sm" | "md" | "lg" | "xl";
}

const typeIcons = {
  text: <FileText className="w-4 h-4" />,
  number: <Hash className="w-4 h-4" />,
  image: <ImageIcon className="w-4 h-4" />,
  date: <Calendar className="w-4 h-4" />,
  phone: <Phone className="w-4 h-4" />,
  email: <Globe className="w-4 h-4" />,
  url: <Globe className="w-4 h-4" />,
};

const sizeClasses = {
  sm: "sm:max-w-lg",
  md: "sm:max-w-2xl",
  lg: "sm:max-w-3xl",
  xl: "sm:max-w-4xl",
};

export default function ReusableEditModal<T>({
  open,
  onClose,
  title = "Edit",
  data,
  fields,
  onSubmit,
  size = "lg",
}: EditModalProps<T>) {
  if (!data) return null;

  const [formData, setFormData] = useState<T>({ ...data });

  const handleChange = (key: keyof T, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn("rounded-lg p-0 overflow-hidden", sizeClasses[size])}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                {title}
              </DialogTitle>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={String(field.key)} className={field.className}>
              <label className="flex items-center gap-2 mb-2 font-semibold text-gray-800">
                {field.icon || typeIcons[field.type]}
                {field.label}
              </label>

              {field.type === "image" ? (
                <div className="flex flex-col gap-3">
                  {/* SAME SIZE AS DETAILS MODAL */}
                  <div className="relative w-32 h-32 rounded-md overflow-hidden bg-gray-100 border">
                    <img
                      src={String(formData[field.key])}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/150?text=No+Image";
                      }}
                    />
                  </div>

                  {/* FILE INPUT */}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const reader = new FileReader();
                      reader.onload = () => {
                        handleChange(field.key, reader.result);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>
              ) : (
                <Input
                  type={field.type === "phone" ? "text" : field.type}
                  value={String(formData[field.key] || "")}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <div className=" bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
          <Button variant="destructive" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-[var(--brand-700)] hover:bg-[var(--brand-600)] text-white"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
