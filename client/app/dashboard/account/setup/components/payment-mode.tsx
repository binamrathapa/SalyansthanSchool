"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PaymentMode() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Modes</CardTitle>
      </CardHeader>

      <CardContent className="flex gap-3">
        <Badge variant="outline">Cash</Badge>
        <Badge variant="outline">Bank</Badge>
      </CardContent>
    </Card>
  );
}
