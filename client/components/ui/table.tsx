"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
      style={{
        backgroundColor: "var(--sidebar-bg)",
        border: "1px solid var(--sidebar-border)",
        borderRadius: "8px"
      }}
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("", className)}
      style={{
        backgroundColor: "var(--brand-100)",
        borderBottom: "1px solid var(--brand-100)"
      }}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody data-slot="table-body" className={cn("", className)} {...props} />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn("transition-colors", className)}
      style={{
        borderBottom: "1px solid var(--sidebar-border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--brand-50)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-12 px-3 text-left align-middle font-semibold whitespace-nowrap",
        className
      )}
      style={{ color: "var(--text-default)" }}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn("p-3 align-middle whitespace-nowrap", className)}
      style={{ color: "var(--text-muted)" }}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-3 text-sm", className)}
      style={{ color: "var(--text-muted)" }}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
