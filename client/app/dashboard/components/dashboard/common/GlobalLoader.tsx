"use client";

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="loader" />
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