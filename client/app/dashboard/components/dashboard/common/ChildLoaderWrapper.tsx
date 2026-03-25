"use client";

import { cn } from "@/lib/utils";

interface ChildLoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function ChildLoadingWrapper({
  isLoading,
  children,
  className,
}: ChildLoadingWrapperProps) {
  return (
    <div className={cn("relative w-full h-screen", className)}>
      {/* Overlay Loader */}
      <div
        className={cn(
          "absolute inset-0 z-50 flex items-center justify-center transition-all duration-300",
          isLoading
            ? "opacity-100 visible bg-white/70 backdrop-blur-sm"
            : "opacity-0 invisible"
        )}
      >
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
          width: 40px;
          height: 20px;
          --c: no-repeat radial-gradient(
            farthest-side,
            var(--brand-600) 93%,
            transparent
          );
          background:
            var(--c) 0 0,
            var(--c) 50% 0,
            var(--c) 100% 0;
          background-size: 8px 8px;
          position: relative;
          animation: l4-0 1s linear infinite alternate;
        }

        .loader::before {
          content: "";
          position: absolute;
          width: 8px;
          height: 12px;
          background: var(--brand-600);
          left: 0;
          top: 0;
          animation:
            l4-1 1s linear infinite alternate,
            l4-2 0.5s cubic-bezier(0, 200, 0.8, 200) infinite;
        }

        @keyframes l4-0 {
          0% {
            background-position:
              0 100%,
              50% 0,
              100% 0;
          }
          8%,
          42% {
            background-position:
              0 0,
              50% 0,
              100% 0;
          }
          50% {
            background-position:
              0 0,
              50% 100%,
              100% 0;
          }
          58%,
          92% {
            background-position:
              0 0,
              50% 0,
              100% 0;
          }
          100% {
            background-position:
              0 0,
              50% 0,
              100% 100%;
          }
        }

        @keyframes l4-1 {
          100% {
            left: calc(100% - 8px);
          }
        }

        @keyframes l4-2 {
          100% {
            top: -0.1px;
          }
        }
      `}</style>
    </div>
  );
}