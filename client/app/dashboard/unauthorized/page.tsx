'use client';

import { useEffect, useRef } from 'react';
import { Lock, LogIn } from 'lucide-react';
import { gsap } from 'gsap';
import Link from 'next/link';

export default function UnauthorizedPage() {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(box.current, {
      scale: 0.9,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 px-4">
      <div ref={box} className="text-center max-w-md">
        <Lock className="mx-auto h-24 w-24 text-green-600 mb-6" />

        <h1 className="text-5xl font-extrabold text-green-700 mb-2">401</h1>
        <p className="text-lg font-medium text-gray-800 mb-2">
          Unauthorized
        </p>
        <p className="text-sm text-gray-600 mb-8">
          Please log in to continue.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-white text-sm font-medium hover:bg-green-700"
        >
          <LogIn className="h-4 w-4" />
          Go to Login
        </Link>
      </div>
    </div>
  );
}
