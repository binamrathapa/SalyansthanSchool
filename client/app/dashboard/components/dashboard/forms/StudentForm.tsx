"use client";

import React from "react";
import { Formik, Form, Field } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  studentSchema,
  StudentFormType,
} from "@/lib/validation/student.schema";
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
  initialValues: StudentFormType;
  onSubmit?: (values: StudentFormType) => Promise<void> | void;
  submitLabel?: string;
  disabled?: boolean;
  mode?: "add" | "edit" | "view";
}

export default function StudentForm({
  initialValues,
  onSubmit,
  submitLabel = "Save",
  disabled = false,
  mode = "add",
}: StudentFormProps) {
  const isView = mode === "view";

  const handleSubmit = async (values: StudentFormType) => {
    if (!isView && onSubmit) {
      await onSubmit(values);
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={
        isView ? undefined : toFormikValidationSchema(studentSchema)
      }
      validateOnChange
      validateOnBlur
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({
        values,
        setFieldValue,
        touched,
        errors,
        isSubmitting,
        handleSubmit,
      }) => (
        <Form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          {/* PHOTO */}
          <div className="md:col-span-2 flex flex-col items-center gap-2">
            <label className="block text-sm font-medium">Photo</label>
            <div className="relative w-32 h-32 border rounded-md overflow-hidden bg-muted">
              {values.photo ? (
                <>
                  <img
                    src={values.photo}
                    className="w-full h-full object-cover"
                  />
                  {!isView && (
                    <button
                      type="button"
                      onClick={() => setFieldValue("photo", undefined)}
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
                    reader.onload = () => setFieldValue("photo", reader.result);
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            )}

            {touched.photo && errors.photo && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4" /> {errors.photo}
              </p>
            )}
          </div>

          {/* DYNAMIC FIELDS FROM CONFIG */}
          {studentFieldConfig.map(({ name, label, type, restrictInput }) => {
            const hasError =
              touched[name as keyof typeof touched] &&
              errors[name as keyof typeof errors];

            // Special handling for gender select
            if (name === "gender") {
              return (
                <div key={name}>
                  <label className="block text-sm font-medium">{label}</label>
                  <Select
                    value={values.gender}
                    onValueChange={(value) =>
                      !isView && setFieldValue("gender", value)
                    }
                    disabled={isView}
                  >
                    <SelectTrigger
                      className={
                        hasError
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "w-full focus-visible:ring-[var(--brand-500)]"
                      }
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {hasError && (
                    <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                      <AlertCircle className="w-4 h-4" /> {errors.gender}
                    </p>
                  )}
                </div>
              );
            }

            return (
              <div key={name}>
                <label className="block text-sm font-medium">{label}</label>
                <Field name={name}>
                  {({ field }: any) => (
                    <Input
                      {...field}
                      type={type || "text"}
                      disabled={isView}
                      onInput={(e: React.FormEvent<HTMLInputElement>) => {
                        if (restrictInput) {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            restrictInput,
                            ""
                          );
                          setFieldValue(name, e.currentTarget.value);
                        }
                      }}
                      className={
                        hasError
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "focus-visible:ring-[var(--brand-500)]"
                      }
                    />
                  )}
                </Field>
                {hasError && (
                  <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                    <AlertCircle className="w-4 h-4" />{" "}
                    {errors[name as keyof typeof errors]}
                  </p>
                )}
              </div>
            );
          })}

          {/* ACTIONS */}
          {!isView && (
            <div className="md:col-span-2 flex justify-end mt-2">
              <Button
                type="submit"
                disabled={isSubmitting || disabled}
                className="
    bg-[var(--brand-600)]
    hover:bg-[var(--brand-700)]
    text-white  mb-4
  "
              >
                {isSubmitting ? "Saving..." : submitLabel}
              </Button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
}
