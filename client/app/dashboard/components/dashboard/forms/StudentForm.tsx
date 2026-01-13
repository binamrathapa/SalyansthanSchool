"use client";

<<<<<<< HEAD
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { studentSchema, StudentFormType } from "@/lib/validation/student.schema";
=======
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  studentSchema,
  StudentFormType,
} from "@/lib/validation/student.schema";

>>>>>>> 840f115b709da100e16d6bbd5b40713a743d6502
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
<<<<<<< HEAD
  grades?: { id: number; name: string; sections: { id: number; name: string }[] }[];
  sections?: { id: number; name: string }[];
}

/* DEFAULT VALUES */
const DEFAULT_VALUES: StudentFormType = {
  photo: "",
  name: "",
  gradeId: "",
  sectionId: "",
=======
}

/* DEFAULT VALUES (important for ADD) */
const DEFAULT_VALUES: StudentFormType = {
  photo: "",
  name: "",
  grade: "",
>>>>>>> 840f115b709da100e16d6bbd5b40713a743d6502
  rollNo: "",
  parent: "",
  dob: "",
  admissionDate: "",
  address: "",
  parentContact: "",
  gender: "Male",
<<<<<<< HEAD
  bloodGroup: "A+",
=======
>>>>>>> 840f115b709da100e16d6bbd5b40713a743d6502
};

export default function StudentForm({
  initialValues,
  onSubmit,
  submitLabel = "Save",
  disabled = false,
  mode = "add",
<<<<<<< HEAD
  grades = [],
  sections = [],
=======
>>>>>>> 840f115b709da100e16d6bbd5b40713a743d6502
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
<<<<<<< HEAD
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

=======

  const submitHandler = async (values: StudentFormType) => {
    if (!isView && onSubmit) {
      await onSubmit(values);
    }
  };

>>>>>>> 840f115b709da100e16d6bbd5b40713a743d6502
  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
<<<<<<< HEAD
      {/* PHOTO UPLOAD */}
      <div className="md:col-span-2 flex flex-col items-center gap-2">
        <label className="text-sm font-medium">Photo</label>
=======
      {/* PHOTO */}
      <div className="md:col-span-2 flex flex-col items-center gap-2">
        <label className="text-sm font-medium">Photo</label>

>>>>>>> 840f115b709da100e16d6bbd5b40713a743d6502
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
<<<<<<< HEAD
=======

>>>>>>> 840f115b709da100e16d6bbd5b40713a743d6502
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
<<<<<<< HEAD
                reader.onload = () => setValue("photo", reader.result as string);
=======
                reader.onload = () =>
                  setValue("photo", reader.result as string);
>>>>>>> 840f115b709da100e16d6bbd5b40713a743d6502
                reader.readAsDataURL(file);
              }}
            />
          </label>
        )}
<<<<<<< HEAD
=======

>>>>>>> 840f115b709da100e16d6bbd5b40713a743d6502
        {errors.photo && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.photo.message}
          </p>
        )}
      </div>

<<<<<<< HEAD
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
=======
      {/* FIELDS */}
      {studentFieldConfig.map(({ name, label, type, restrictInput }) => {
        if (name === "gender") {
          return (
            <div key={name}>
              <label className="text-sm font-medium">{label}</label>

              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select
                    value={field.value}
>>>>>>> 840f115b709da100e16d6bbd5b40713a743d6502
                    onValueChange={field.onChange}
                    disabled={isView}
                  >
                    <SelectTrigger
                      className={`w-full ${
<<<<<<< HEAD
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
=======
                        errors.gender ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
>>>>>>> 840f115b709da100e16d6bbd5b40713a743d6502
                    </SelectContent>
                  </Select>
                )}
              />
<<<<<<< HEAD
              {errors[name as keyof StudentFormType] && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors[name as keyof StudentFormType]?.message as string}
=======

              {errors.gender && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.gender.message}
>>>>>>> 840f115b709da100e16d6bbd5b40713a743d6502
                </p>
              )}
            </div>
          );
        }

<<<<<<< HEAD
        // Normal text/date fields
        return (
          <div key={name}>
            <label className="text-sm font-medium">{label}</label>
=======
        return (
          <div key={name}>
            <label className="text-sm font-medium">{label}</label>

>>>>>>> 840f115b709da100e16d6bbd5b40713a743d6502
            <Input
              {...register(name as keyof StudentFormType)}
              type={type || "text"}
              disabled={isView}
              onInput={(e) => {
<<<<<<< HEAD
                if (restrictInput)
                  e.currentTarget.value = e.currentTarget.value.replace(restrictInput, "");
              }}
              className={errors[name as keyof StudentFormType] ? "border-red-500" : ""}
            />
=======
                if (restrictInput) {
                  e.currentTarget.value = e.currentTarget.value.replace(
                    restrictInput,
                    ""
                  );
                }
              }}
              className={
                errors[name as keyof StudentFormType] ? "border-red-500" : ""
              }
            />

>>>>>>> 840f115b709da100e16d6bbd5b40713a743d6502
            {errors[name as keyof StudentFormType] && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4" />
                {errors[name as keyof StudentFormType]?.message as string}
              </p>
            )}
          </div>
        );
      })}

<<<<<<< HEAD
      {/* SUBMIT BUTTON */}
=======
      {/* ACTIONS */}
>>>>>>> 840f115b709da100e16d6bbd5b40713a743d6502
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
