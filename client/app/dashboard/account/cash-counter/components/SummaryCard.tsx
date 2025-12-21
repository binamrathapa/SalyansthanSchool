"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  amount: string;
  icon: LucideIcon;
}

export function SummaryCard({
  title,
  amount,
  icon: Icon,
}: SummaryCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-xl font-semibold">Rs. {amount}</h3>
        </div>

        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
      </CardContent>
    </Card>
  );
}
