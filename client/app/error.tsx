'use client';

import { useEffect, useRef } from 'react';
import { ServerCrash, RefreshCcw } from 'lucide-react';
import { gsap } from 'gsap';

export default function GlobalError({ reset }: { reset: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(ref.current, { opacity: 0, y: 30, duration: 0.6 });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 px-4">
      <div ref={ref} className="text-center max-w-md">
        <ServerCrash className="mx-auto h-24 w-24 text-green-600 mb-6" />

        <h1 className="text-5xl font-extrabold text-green-700 mb-2">500</h1>
        <p className="text-lg font-medium text-gray-800 mb-2">
          Something went wrong
        </p>
        <p className="text-sm text-gray-600 mb-8">
          An unexpected error occurred. Please try again.
        </p>

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-white text-sm font-medium hover:bg-green-700"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}
