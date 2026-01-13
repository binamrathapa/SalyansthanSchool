"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { studentSchema, StudentFormType } from "@/lib/validation/student.schema";
import { studentFieldConfig } from "@/app/dashboard/config/forms/studentFormConfig";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Upload, X, AlertCircle } from "lucide-react";

interface StudentFormProps {
  initialValues?: Partial<StudentFormType>;
  onSubmit?: (values: StudentFormType) => Promise<void> | void;
  submitLabel?: string;
  disabled?: boolean;
  mode?: "add" | "edit" | "view";
  grades?: { id: number; name: string; sections: { id: number; name: string }[] }[];
  sections?: { id: number; name: string }[];
}

/* DEFAULT VALUES */
const DEFAULT_VALUES: StudentFormType = {
  photo: "",
  name: "",
  gradeId: "",
  sectionId: "",
  rollNo: "",
  parent: "",
  dob: "",
  admissionDate: "",
  address: "",
  parentContact: "",
  gender: "Male",
  bloodGroup: "A+",
};

export default function StudentForm({
  initialValues,
  onSubmit,
  submitLabel = "Save",
  disabled = false,
  mode = "add",
  grades = [],
  sections = [],
}: StudentFormProps) {
  const isView = mode === "view";

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<StudentFormType>({
    resolver: isView ? undefined : zodResolver(studentSchema),
    defaultValues: { ...DEFAULT_VALUES, ...initialValues },
  });

  const photo = watch("photo");
  const selectedGradeId = watch("gradeId");

  // Reset sectionId when grade changes
  useEffect(() => {
    setValue("sectionId", "");
  }, [selectedGradeId, setValue]);

  const submitHandler = async (values: StudentFormType) => {
    if (!isView && onSubmit) {
      // Convert gradeId & sectionId to numbers for backend
      await onSubmit({
        ...values,
        gradeId: Number(values.gradeId),
        sectionId: values.sectionId ? Number(values.sectionId) : undefined,
      });
    }
  };

  // Compute sections for selected grade
  const computedSections =
    grades.find((g) => String(g.id) === selectedGradeId)?.sections || [];

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* PHOTO UPLOAD */}
      <div className="md:col-span-2 flex flex-col items-center gap-2">
        <label className="text-sm font-medium">Photo</label>
        <div className="relative w-32 h-32 border rounded-md overflow-hidden bg-muted">
          {photo ? (
            <>
              <img src={photo} className="w-full h-full object-cover" />
              {!isView && (
                <button
                  type="button"
                  onClick={() => setValue("photo", "")}
                  className="absolute top-1 right-1 bg-white/80 rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              No Image
            </div>
          )}
        </div>
        {!isView && (
          <label className="flex items-center gap-2 border rounded-md px-3 py-1.5 cursor-pointer text-sm">
            <Upload className="w-4 h-4" />
            Upload photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => setValue("photo", reader.result as string);
                reader.readAsDataURL(file);
              }}
            />
          </label>
        )}
        {errors.photo && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.photo.message}
          </p>
        )}
      </div>

      {/* DYNAMIC FIELDS */}
      {studentFieldConfig.map(({ name, label, type, restrictInput }) => {
        // Dropdown fields: gender, bloodGroup, gradeId, sectionId
        if (["gender", "bloodGroup", "gradeId", "sectionId"].includes(name)) {
          const options =
            name === "gender"
              ? ["Male", "Female", "Other"]
              : name === "bloodGroup"
              ? ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
              : name === "gradeId"
              ? grades.map((g) => ({ label: g.name, value: String(g.id) }))
              : computedSections.map((s) => ({ label: s.name, value: String(s.id) }));

          return (
            <div key={name}>
              <label className="text-sm font-medium">{label}</label>
              <Controller
                control={control}
                name={name as keyof StudentFormType}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={field.onChange}
                    disabled={isView}
                  >
                    <SelectTrigger
                      className={`w-full ${
                        errors[name as keyof StudentFormType] ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((opt: any) => (
                        <SelectItem key={opt.value} value={String(opt.value)}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors[name as keyof StudentFormType] && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors[name as keyof StudentFormType]?.message as string}
                </p>
              )}
            </div>
          );
        }

        // Normal text/date fields
        return (
          <div key={name}>
            <label className="text-sm font-medium">{label}</label>
            <Input
              {...register(name as keyof StudentFormType)}
              type={type || "text"}
              disabled={isView}
              onInput={(e) => {
                if (restrictInput)
                  e.currentTarget.value = e.currentTarget.value.replace(restrictInput, "");
              }}
              className={errors[name as keyof StudentFormType] ? "border-red-500" : ""}
            />
            {errors[name as keyof StudentFormType] && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4" />
                {errors[name as keyof StudentFormType]?.message as string}
              </p>
            )}
          </div>
        );
      })}

      {/* SUBMIT BUTTON */}
      {!isView && (
        <div className="md:col-span-2 flex justify-end mt-2">
          <Button
            type="submit"
            disabled={isSubmitting || disabled}
            className="bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white mb-4"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      )}
    </form>
  );
}
