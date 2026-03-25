"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeeCategory } from "@/app/dashboard/types/account";

interface Props {
  name: string;
  selected?: FeeCategory | null;
  loading?: boolean;
  onNameChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function FeeCategoryForm({
  name,
  selected,
  loading = false,
  onNameChange,
  onSubmit,
  onCancel,
  isEditing = false,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {selected ? "Update Fee Category" : "Add Fee Category"}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex gap-3">
        <Input
          placeholder="Category Name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />

        <Button onClick={onSubmit} disabled={loading}
          className="bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white transition-colors duration-200">
          {isEditing ? "Update Category" : "Add Category"}
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
