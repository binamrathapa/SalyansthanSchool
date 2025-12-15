"use client";

import { useEffect, useRef } from "react";
import { ServerCrash, RotateCcw } from "lucide-react";
import { gsap } from "gsap";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(containerRef.current, { opacity: 0, duration: 0.5 })
      .from(iconRef.current, { scale: 0.6, opacity: 0, duration: 0.7 }, "-=0.3")
      .from(textRef.current, { y: 30, opacity: 0, duration: 0.5 }, "-=0.4")
      .from(buttonRef.current, { y: 20, opacity: 0, duration: 0.4 }, "-=0.3");
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center bg-green-50 px-4"
    >
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-green-200 blur-3xl opacity-40" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-green-300 blur-3xl opacity-30" />

      <div className="relative z-10 max-w-md text-center">
        <ServerCrash
          ref={iconRef}
          className="mx-auto mb-6 h-24 w-24 text-green-600"
        />

        <div ref={textRef}>
          <h1 className="mb-2 text-3xl font-bold text-green-700">
            Something went wrong
          </h1>
          <p className="mb-6 text-sm text-gray-600">
            A system error occurred in the dashboard.
          </p>
        </div>

        <button
          ref={buttonRef}
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-green-600/20 transition-all hover:-translate-y-0.5 hover:bg-green-700"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </div>
  );
}
