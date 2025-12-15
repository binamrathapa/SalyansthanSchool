'use client';

import { useEffect, useRef } from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { gsap } from 'gsap';
import Link from 'next/link';

export default function ForbiddenPage() {
  const wrap = useRef<HTMLDivElement>(null);
  const icon = useRef<SVGSVGElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from(wrap.current, { opacity: 0, duration: 0.5 })
      .from(icon.current, { scale: 0.6, y: -40, opacity: 0 }, '-=0.3')
      .from(text.current, { y: 30, opacity: 0 }, '-=0.3')
      .from(btn.current, { y: 20, opacity: 0 }, '-=0.2');
  }, []);

  return (
    <div ref={wrap} className="flex min-h-screen items-center justify-center bg-green-50 px-4">
      <div className="text-center max-w-md">
        <ShieldAlert ref={icon} className="mx-auto h-24 w-24 text-green-600 mb-6" />

        <div ref={text}>
          <h1 className="text-5xl font-extrabold text-green-700 mb-2">403</h1>
          <p className="text-lg font-medium text-gray-800 mb-2">
            Access Denied
          </p>
          <p className="text-sm text-gray-600 mb-8">
            You don’t have permission to access this page.
          </p>
        </div>

        <span ref={btn} className="inline-block">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-white text-sm font-medium hover:bg-green-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </span>
      </div>
    </div>
  );
}
