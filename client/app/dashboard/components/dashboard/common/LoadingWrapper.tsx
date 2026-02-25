"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function LoadingWrapper({
  isLoading,
  children,
  className,
}: LoadingWrapperProps) {
  return (
    <div className={cn("relative w-full min-h-[200px]", className)}>
      
      {/* Overlay Loader */}
      <div
        className={cn(
          "absolute inset-0 z-50 flex items-center justify-center transition-all duration-300",
          isLoading
            ? "opacity-100 visible bg-white/70 backdrop-blur-sm"
            : "opacity-0 invisible"
        )}
      >
        {/* Modern Pulse Loader */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-16 w-16 rounded-full border-4 border-[var(--brand-200)] opacity-30" />
          <div className="absolute h-16 w-16 rounded-full border-4 border-t-[var(--brand-600)] animate-spin" />
          <div className="h-12 w-12 rounded-full bg-[var(--brand-600)] animate-pulse" />
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          "transition-all duration-300",
          isLoading && "opacity-50 pointer-events-none"
        )}
      >
        {children}
      </div>
    </div>
  );
}