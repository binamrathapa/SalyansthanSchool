"use client";

import { LucideIcon } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "purple" | "orange" | "rose";
  className?: string;
}

const colorMap = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    border: "border-blue-100",
  },
  green: {
    bg: "bg-green-50",
    icon: "text-green-600",
    border: "border-green-100",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    border: "border-purple-100",
  },
  orange: {
    bg: "bg-orange-50",
    icon: "text-orange-600",
    border: "border-orange-100",
  },
  rose: {
    bg: "bg-rose-50",
    icon: "text-rose-600",
    border: "border-rose-100",
  },
};

export default function SummaryCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = "blue",
  className,
}: SummaryCardProps) {
  const styles = colorMap[color];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md",
        // styles.border,
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-bold tracking-tight text-gray-900">
              {value}
            </h3>
            {trend && (
              <span
                className={cn(
                  "text-xs font-semibold",
                  trend.isPositive ? "text-green-600" : "text-rose-600"
                )}
              >
                {trend.isPositive ? "+" : "-"}
                {trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs text-gray-400">{description}</p>
          )}
        </div>

        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            styles.bg
          )}
        >
          <Icon className={cn("h-6 w-6", styles.icon)} />
        </div>
      </div>

      {/* Subtle Bottom Accent */}
    </div>
  );
}
