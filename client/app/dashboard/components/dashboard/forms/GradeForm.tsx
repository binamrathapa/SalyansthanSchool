"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GradeFormType } from "@/lib/validation/grade.schema";
import { AlertCircle } from "lucide-react";

interface GradeFormProps {
  initialValues: GradeFormType;
  sections: { id: number; name: string }[];
  onSubmit: (values: GradeFormType) => void | Promise<void>;
  submitLabel?: string;
  disabled?: boolean;
}

export default function GradeForm({
  initialValues,
  sections,
  onSubmit,
  submitLabel = "Save",
  disabled = false,
}: GradeFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GradeFormType>({
    defaultValues: initialValues,
  });

  const submitHandler = async (values: GradeFormType) => {
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      {/* 2-Column Grid for Grade Name and Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Grade Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white">Grade Name</label>
          <Input
            className="
      bg-transparent
      text-white
      border-slate-700
      focus-visible:ring-2
      focus-visible:ring-[#4ade80]
      focus-visible:ring-offset-0
      transition-all
    "
            {...register("name", { required: "Grade name is required" })}
            disabled={disabled}
            placeholder="Enter grade name"
          />
          {errors.name && (
            <p className="text-red-400 text-sm flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4" />
              {errors.name.message}
            </p>
          )}
        </div>
        {/* Section Select */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white">Section</label>
          <Controller
            name="sections"
            control={control}
            rules={{ required: "Section is required" }}
            render={({ field }) => (
              <Select
                disabled={disabled}
                value={field.value?.[0]?.id?.toString() ?? ""}
                onValueChange={(value) => {
                  const selected = sections.find((s) => s.id === Number(value));
                  field.onChange(selected ? [selected] : []);
                }}
              >
                <SelectTrigger
                  className="w-full bg-white text-slate-900 border-2 border-transparent focus:ring-2 focus:ring-[#4ade80] transition-all"
                >
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {sections.map((section) => (
                    <SelectItem
                      key={section.id}
                      value={section.id.toString()}
                    >
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {/* Error Message */}
          {errors.sections && (
            <p className="text-red-400 text-sm flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4" />
              {errors.sections.message as string}
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