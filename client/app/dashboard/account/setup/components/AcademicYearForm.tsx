"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Props {
  data: { name: string; startDate: string; endDate: string; isActive: boolean };
  onChange: (key: string, value: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function AcademicYearForm({ data, onChange, onSubmit, onCancel, isEditing }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle>{isEditing ? "Edit" : "Add"} Academic Year</CardTitle></CardHeader>
      <CardContent className="flex flex-wrap items-end gap-4">
        <div className="space-y-1">
          <Label>Year Name</Label>
          <Input value={data.name} placeholder="e.g. 2082" onChange={(e) => onChange("name", e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Start Date</Label>
          <Input type="date" value={data.startDate} onChange={(e) => onChange("startDate", e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>End Date</Label>
          <Input type="date" value={data.endDate} onChange={(e) => onChange("endDate", e.target.value)} />
        </div>
        <div className="flex items-center gap-2 pb-3">
          <Switch checked={data.isActive} onCheckedChange={(val) => onChange("isActive", val)} id="year-active" />
          <Label htmlFor="year-active">Active</Label>
        </div>
        <div className="flex gap-2">
          <Button onClick={onSubmit} className="bg-green-600 hover:bg-green-700 text-white">
            {isEditing ? "Update" : "Add"}
          </Button>
          {isEditing && <Button variant="outline" onClick={onCancel}>Cancel</Button>}
        </div>
      </CardContent>
    </Card>
  );
}