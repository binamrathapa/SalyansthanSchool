"use client";

import { useState } from "react";
import { showError } from "@/lib/sweet-alert";
import BaseModal from "../components/dashboard/common/modals/BaseModal";
import StudentForm from "../components/dashboard/forms/StudentForm";
import { useGetAllGrades } from "@/server-action/api/grade.api";

/* ================= TYPES ================= */

export interface StudentFormType {
  firstName: string;
  middleName?: string | null;
  lastName: string;
  gender: string;
  bloodGroup: string;
  dateOfBirth: string;
  admissionDate: string;
  address: string;
  guardianName: string;
  guardianContact: string;
  gradeId: number;
  sectionId?: number;
  photo?: string;
  isActive?: boolean;
}

interface StudentAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: Partial<StudentFormType> | null;
  onSave: (values: StudentFormType) => Promise<void> | void;
}

/* ================= COMPONENT ================= */

export default function StudentAddEditModal({
  isOpen,
  onClose,
  data,
  onSave,
}: StudentAddEditModalProps) {
  const [loading, setLoading] = useState(false);

  // Fetch grades (new API structure)
  const { data: gradesResponse, isLoading: gradesLoading } =
    useGetAllGrades();

    console.log("Grades Response:", gradesResponse);
  const grades = gradesResponse?.data ?? [];
   

  /* ================= INITIAL VALUES ================= */

  const initialValues: StudentFormType = {
    firstName: data?.firstName ?? "",
    middleName: data?.middleName ?? "",
    lastName: data?.lastName ?? "",
    gender: data?.gender ?? "Male",
    bloodGroup: data?.bloodGroup ?? "",
    dateOfBirth: data?.dateOfBirth ?? "",
    admissionDate: data?.admissionDate ?? "",
    address: data?.address ?? "",
    guardianName: data?.guardianName ?? "",
    guardianContact: data?.guardianContact ?? "",
    gradeId: data?.gradeId ?? 0,
    sectionId: data?.sectionId ?? undefined,
    photo: data?.photo ?? "",
    isActive: data?.isActive ?? true,
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (values: StudentFormType) => {
    try {
      setLoading(true);
      await onSave(values);
      onClose();
    } catch (error: any) {
      showError(error?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={data ? "Edit Student" : "Add Student"}
      size="lg"
    >
      <StudentForm
        key={data ? "edit" : "add"}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        disabled={loading || gradesLoading}
        submitLabel={data ? "Update" : "Add"}
        grades={grades}
      />
    </BaseModal>
  );
}
