"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  footer?: React.ReactNode; // optional custom footer
  primaryActionLabel?: string; // Add / Update label
  onPrimaryAction?: () => void; // callback for primary action
  primaryActionLoading?: boolean; // loading state
}

const sizeClasses = {
  sm: "sm:max-w-lg",
  md: "sm:max-w-2xl",
  lg: "sm:max-w-3xl",
  xl: "sm:max-w-4xl",
};

export default function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  size = "lg",
  className,
  footer,
  primaryActionLabel,
  onPrimaryAction,
  primaryActionLoading = false,
}: BaseModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "rounded-lg p-0 overflow-hidden flex flex-col max-h-[90vh]",
          sizeClasses[size],
          className
        )}
      >
        {/* HEADER */}
        <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex justify-between items-center">
          <DialogTitle className="text-xl font-bold text-gray-900">{title}</DialogTitle>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY (scrollable) */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {/* FOOTER */}
        {/* <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
          {footer ?? (
            <>
              <Button variant="destructive" onClick={onClose}>
                Cancel
              </Button>

              {primaryActionLabel && onPrimaryAction && (
                <Button
                  onClick={onPrimaryAction}
                  className="bg-[var(--brand-700)] hover:bg-[var(--brand-600)] text-white"
                  disabled={primaryActionLoading}
                >
                  {primaryActionLoading ? "Saving..." : primaryActionLabel}
                </Button>
              )}
            </>
          )}
        </div> */}
      </DialogContent>
    </Dialog>
  );
}
