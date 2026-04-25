"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionFormType } from "@/lib/validation/section.schema";
import { AlertCircle } from "lucide-react";

interface SectionFormProps {
  initialValues: SectionFormType;
  onSubmit: (values: SectionFormType) => void | Promise<void>;
  submitLabel?: string;
  disabled?: boolean;
}

export default function SectionForm({
  initialValues,
  onSubmit,
  submitLabel = "Save",
  disabled = false,
}: SectionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SectionFormType>({
    defaultValues: initialValues,
  });

  const submitHandler = async (values: SectionFormType) => {
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Section Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white">Section Name</label>
          <Input
            className="
              bg-transparent
              text-slate-900
              border-slate-700
              focus-visible:ring-2
              focus-visible:ring-[#4ade80]
              focus-visible:ring-offset-0
              transition-all
            "
            {...register("sectionName", { required: "Section name is required" })}
            disabled={disabled}
            placeholder="Enter section name"
          />
          {errors.sectionName && (
            <p className="text-red-400 text-sm flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4" />
              {errors.sectionName.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      {!disabled && (
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSubmitting || disabled}
            className="bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white px-8"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      )}
    </form>
  );
}
