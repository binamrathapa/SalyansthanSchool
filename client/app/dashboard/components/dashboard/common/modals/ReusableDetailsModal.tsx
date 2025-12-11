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
  Clock,
  FileText,
  Image as ImageIcon,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  XCircle,
  Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type FieldType =
  | "text"
  | "image"
  | "date"
  | "datetime"
  | "number"
  | "boolean"
  | "email"
  | "phone"
  | "url";

interface DetailsModalField<T> {
  label: string;
  key: keyof T;
  type?: FieldType;
  render?: (value: any, data: T) => React.ReactNode;
  className?: string;
  icon?: ReactNode;
}

interface DetailsModalProps<T> {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  data: T | null;
  fields: DetailsModalField<T>[];
  size?: "sm" | "md" | "lg" | "xl";
}

const defaultTypeIcons = {
  text: <FileText className="w-4 h-4" />,
  image: <ImageIcon className="w-4 h-4" />,
  date: <Calendar className="w-4 h-4" />,
  datetime: <Clock className="w-4 h-4" />,
  number: <Hash className="w-4 h-4" />,
  boolean: <FileText className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  phone: <Phone className="w-4 h-4" />,
  url: <Globe className="w-4 h-4" />,
};

const sizeClasses = {
  sm: "sm:max-w-lg",
  md: "sm:max-w-2xl",
  lg: "sm:max-w-3xl",
  xl: "sm:max-w-4xl",
};

export default function ReusableDetailsModal<T>({
  open,
  onClose,
  title = "Details",
  subtitle,
  data,
  fields,
  size = "lg",
}: DetailsModalProps<T>) {
  if (!data) return null;

  // Separate image fields from other fields
  const imageFields = fields.filter((field) => field.type === "image");
  const otherFields = fields.filter((field) => field.type !== "image");

  // Group other fields into rows of 2 for better layout
  const groupedFields: DetailsModalField<T>[][] = [];
  for (let i = 0; i < otherFields.length; i += 2) {
    groupedFields.push(otherFields.slice(i, i + 2));
  }

  const getFieldIcon = (field: DetailsModalField<T>) => {
    // Use custom icon if provided
    if (field.icon) return field.icon;

    // Use default icon based on type
    if (field.type && defaultTypeIcons[field.type]) {
      return defaultTypeIcons[field.type];
    }

    // Fallback to text icon
    return defaultTypeIcons.text;
  };

  const getFieldValue = (field: DetailsModalField<T>) => {
    const value = data[field.key];

    if (field.render) {
      return field.render(value, data);
    }

    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic">Not set</span>;
    }

    switch (field.type) {
      case "image":
        return (
          <div className="flex items-center  justify-center    gap-3">
            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
              <img
                src={String(value)}
                alt={field.label}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/100?text=No+Image";
                }}
              />
            </div>
            <div className="text-sm text-gray-500 truncate max-w-[200px]">
              {String(value)}
            </div>
          </div>
        );

      case "date":
        try {
          return new Date(String(value)).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        } catch {
          return String(value);
        }

      case "datetime":
        try {
          return new Date(String(value)).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        } catch {
          return String(value);
        }

      case "boolean":
        return (
          <div className="flex items-center gap-2">
            {value ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                value
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}
            >
              {value ? "Yes" : "No"}
            </span>
          </div>
        );

      case "email":
        return <span className="text-gray-700">{String(value)}</span>;

      case "phone":
        return <span className="text-gray-700">{String(value)}</span>;

      case "url":
        return (
          <a
            href={String(value)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline truncate max-w-[300px]"
          >
            <Globe className="w-4 h-4 " />
            <span className="truncate">{String(value)}</span>
          </a>
        );

      case "number":
        return (
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-gray-400" />
            <span>{Number(value).toLocaleString()}</span>
          </div>
        );

      default:
        return String(value);
    }
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
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
          {/* Image Gallery Section */}
          {imageFields.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                Images
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imageFields.map((field) => {
                  const value = data[field.key];
                  if (!value) return null;

                  return (
                    <div key={String(field.key)} className="space-y-2">
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 border">
                        <img
                          src={String(value)}
                          alt={field.label}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/300?text=No+Image";
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 text-center truncate">
                        {field.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Details Grid */}
          {groupedFields.length > 0 && (
            <div className="space-y-6">
              {imageFields.length > 0 && otherFields.length > 0 && (
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Details
                </h3>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groupedFields.flatMap((row, rowIndex) =>
                  row.map((field, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={cn("space-y-2", field.className)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-gray-900 font-bold  ">
                          {getFieldIcon(field)}
                        </div>
                        <label className="text-md  font-semibold text-gray-900">
                          {field.label}:
                        </label>

                        <div className="text-gray-900">
                          {getFieldValue(field)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
