"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver } from "react-hook-form";
import { studentSchema, StudentFormType, BLOOD_GROUPS, GENDERS } from "@/lib/validation/student.schema";
import { studentFieldConfig } from "@/app/dashboard/config/forms/studentFormConfig";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, AlertCircle } from "lucide-react";

interface StudentFormProps {
  initialValues?: Partial<StudentFormType>;
  onSubmit?: (values: StudentFormType) => Promise<void> | void;
  submitLabel?: string;
  disabled?: boolean;
  mode?: "add" | "edit" | "view";
  grades?: { id: number; name: string; sections: { id: number; name: string }[] }[];
}

/* DEFAULT VALUES */
const DEFAULT_VALUES: StudentFormType = {
  firstName: "",
  middleName: "",
  lastName: "",
  gradeId: undefined as any,
  gradeName: "",
  sectionId: undefined as any,
  sectionName: "",
  parent: "",
  parentContact: "",
  dob: "",
  admissionDate: "",
  address: "",
  gender: "Male",
  bloodGroup: "A+",
  photo: "",
  rollNo: undefined,
  isActive: true,
};

export default function StudentForm({
  initialValues,
  onSubmit,
  submitLabel = "Save",
  disabled = false,
  mode = "add",
  grades = [],
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
    resolver: zodResolver(studentSchema) as unknown as Resolver<StudentFormType>,
    defaultValues: { ...DEFAULT_VALUES, ...initialValues },
  });


  const photo = watch("photo");
  const selectedGradeId = watch("gradeId") ? Number(watch("gradeId")) : undefined;
  const rollNo = watch("rollNo");

  useEffect(() => {
  }, [rollNo]);

  useEffect(() => {
  console.log("FORM ERRORS:", errors);
}, [errors]);


  // Compute sections for selected grade
  const computedSections =
    grades.find((g) => g.id === Number(selectedGradeId))?.sections || [];

  // Reset sectionId when grade changes
  useEffect(() => {
    if (mode === "view") return;
    const currentSectionId = watch("sectionId");
    if (!currentSectionId && computedSections.length > 0) {
      setValue("sectionId", computedSections[0].id);
    }
  }, [selectedGradeId, computedSections, setValue, mode, watch]);


  const submitHandler = async (values: StudentFormType) => {
    if (!isView && onSubmit) {
      await onSubmit({
        ...values,
        gradeId: Number(values.gradeId),
        sectionId: values.sectionId ? Number(values.sectionId) : 1,
      });

    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
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

      {/* FIRST, MIDDLE, LAST NAMES */}
      {["firstName", "middleName", "lastName"].map((name) => (
        <div key={name}>
          <label className="text-sm font-medium">
            {studentFieldConfig.find((f) => f.name === name)?.label || name}
          </label>
          <Input
            {...register(name as keyof StudentFormType)}
            type="text"
            disabled={isView}
            className={errors[name as keyof StudentFormType] ? "border-red-500" : ""}
          />
          {errors[name as keyof StudentFormType] && (
            <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4" />
              {errors[name as keyof StudentFormType]?.message as string}
            </p>
          )}
        </div>
      ))}

      {/* ROLL NO */}
      {mode !== "add" && initialValues?.rollNo !== undefined && (

        <div>
          <label className="text-sm font-medium">Roll No</label>
          <Input
            {...register("rollNo")}
            disabled
          />
        </div>
      )}


      {/* DYNAMIC SELECTS */}
      {["gender", "bloodGroup", "gradeId", "sectionId"].map((name) => {
        const label =
          name === "gender"
            ? "Gender"
            : name === "bloodGroup"
              ? "Blood Group"
              : name === "gradeId"
                ? "Grade"
                : "Section";

        if (isView && (name === "gradeId" || name === "sectionId")) {
          const displayValue =
            name === "gradeId"
              ? initialValues?.gradeName || "-"
              : initialValues?.sectionName || "-";

          return (
            <div key={name} className="flex flex-col">
              <label className="text-sm font-medium mb-1">{label}</label>
              <div className="h-9 px-3 py-1 border rounded-md flex items-center text-gray-700">
                {displayValue}
              </div>
            </div>
          );
        }

        // Normalize options to always have { label, value }
        const options: { label: string; value: string }[] =
          name === "gender"
            ? GENDERS.map((g) => ({ label: g, value: g }))
            : name === "bloodGroup"
              ? BLOOD_GROUPS.map((b) => ({ label: b, value: b }))
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
                    className={`w-full ${errors[name as keyof StudentFormType] ? "border-red-500" : ""
                      }`}
                  >
                    <SelectValue placeholder={`Select ${label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
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
      })}




      {/* OTHER FIELDS */}
      {["parent", "parentContact", "dob", "admissionDate", "address"].map((name) => (
        <div key={name}>
          <label className="text-sm font-medium">
            {studentFieldConfig.find((f) => f.name === name)?.label || name}
          </label>
          <Input
            {...register(name as keyof StudentFormType)}
            type={["dob", "admissionDate"].includes(name) ? "date" : "text"}
            disabled={isView}
            className={errors[name as keyof StudentFormType] ? "border-red-500" : ""}
          />
          {errors[name as keyof StudentFormType] && (
            <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4" />
              {errors[name as keyof StudentFormType]?.message as string}
            </p>
          )}
        </div>
      ))}

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
