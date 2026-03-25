"use client";

import { cn } from "@/lib/utils";

interface GlobalLoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function GloabalLoadingWrapper({
  isLoading,
  children,
  className,
}: GlobalLoadingWrapperProps) {
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
        {/* Custom 4-dot rotating loader */}
        <div className="loader" />
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

      <style jsx>{`
        .loader {
          width: 50px;
          aspect-ratio: 1;
          --_c: no-repeat radial-gradient(
            farthest-side,
            var(--brand-600) 92%,
            transparent
          );
          background:
            var(--_c) top,
            var(--_c) left,
            var(--_c) right,
            var(--_c) bottom;
          background-size: 12px 12px;
          animation: l7 1s infinite linear;
        }

        @keyframes l7 {
          to {
            transform: rotate(0.5turn);
          }
        }
      `}</style>
    </div>
  );
}