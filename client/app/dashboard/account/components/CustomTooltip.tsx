"use client";

import { CustomTooltipProps } from '@/app/dashboard/types/finance.types';

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white rounded-xl p-2.5 shadow-lg border border-green-200">
      {label && (
        <p className="text-green-900 mb-1 text-xs font-semibold">
          {label}
        </p>
      )}

      {payload.map((p, i) => (
        <p key={i} className="text-xs font-bold text-green-900">
          {p.name}:{" "}
          {typeof p.value === "number" && p.value > 999
            ? `Rs.${(p.value / 1000).toFixed(0)}K`
            : p.value}
        </p>
      ))}
    </div>
  );
};

export default CustomTooltip;