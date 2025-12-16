"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  teacherSchema,
  TeacherFormType,
} from "@/lib/validation/teacher.schema";
import { teacherFieldConfig } from "@/app/dashboard/config/forms/teacherFormConfig";

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

interface TeacherFormProps {
  initialValues?: Partial<TeacherFormType>;
  onSubmit?: (values: TeacherFormType) => Promise<void> | void;
  submitLabel?: string;
  disabled?: boolean;
  mode?: "add" | "edit" | "view";
}

/* DEFAULT VALUES (important for ADD) */
const DEFAULT_VALUES: TeacherFormType = {
  photo: "",
  name: "",
  subject: "",
  qualification: "",
  designation: "",
  experience: "",
  dob: "",
  joiningDate: "",
  address: "",
  contact: "",
  panNumber: "",
  nidNumber: "",
  citizenshipNumber: "",
  gender: "Male",
};

export default function TeacherForm({
  initialValues,
  onSubmit,
  submitLabel = "Save",
  disabled = false,
  mode = "add",
}: TeacherFormProps) {
  const isView = mode === "view";

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<TeacherFormType>({
    resolver: isView ? undefined : zodResolver(teacherSchema),
    defaultValues: { ...DEFAULT_VALUES, ...initialValues },
  });

  const photo = watch("photo");

  const submitHandler = async (values: TeacherFormType) => {
    if (!isView && onSubmit) {
      await onSubmit(values);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* PHOTO */}
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
                reader.onload = () =>
                  setValue("photo", reader.result as string);
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

      {/* FIELDS */}
      {teacherFieldConfig.map(
        ({ name, label, type, restrictInput, options }) => {
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
                      onValueChange={field.onChange}
                      disabled={isView}
                    >
                      <SelectTrigger
                        className={`w-full ${
                          errors.gender ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.gender && (
                  <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.gender.message}
                  </p>
                )}
              </div>
            );
          }

          return (
            <div key={name}>
              <label className="text-sm font-medium">{label}</label>

              <Input
                {...register(name as keyof TeacherFormType)}
                type={type || "text"}
                disabled={isView}
                onInput={(e) => {
                  if (restrictInput) {
                    e.currentTarget.value = e.currentTarget.value.replace(
                      restrictInput,
                      ""
                    );
                  }
                }}
                className={
                  errors[name as keyof TeacherFormType] ? "border-red-500" : ""
                }
              />

              {errors[name as keyof TeacherFormType] && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors[name as keyof TeacherFormType]?.message as string}
                </p>
              )}
            </div>
          );
        }
      )}

      {/* ACTIONS */}
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
