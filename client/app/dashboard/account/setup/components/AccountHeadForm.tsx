"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeeCategory } from "@/app/dashboard/types/account";

interface Props {
  name: string;
  feeCategoryId: string;
  categories: FeeCategory[];
  onNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  loading?: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function AccountHeadForm({
  name,
  feeCategoryId,
  categories,
  onNameChange,
  onCategoryChange,
  loading = false,
  onSubmit,
  onCancel,
  isEditing = false,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Account Head" : "Add Account Head"}</CardTitle>
      </CardHeader>

      <CardContent className="flex gap-3">
        <Input
          placeholder="Account Head Name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />

        <Select value={feeCategoryId} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={onSubmit}
          className="bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white transition-colors duration-200">
          {isEditing ? "Update Account Head" : "Add Account Head"}
        </Button>

        {isEditing && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
