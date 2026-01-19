"use client";

import { useState } from "react";
import { showError } from "@/lib/sweet-alert";
import BaseModal from "../components/dashboard/common/modals/BaseModal";
import StudentForm from "../components/dashboard/forms/StudentForm";
import { useGetAllGrades } from "@/server-action/api/grade.api";
import { StudentFormType } from "@/lib/validation/student.schema";
import { Grade } from "@/app/dashboard/types/grade"; 

interface StudentAddEditModalProps {
  isOpen: boolean;  
  onClose: () => void;
  data?: Partial<StudentFormType> | null;
  onSave: (values: StudentFormType) => void | Promise<void>;
}

export default function StudentAddEditModal({
  isOpen,
  onClose,
  data,
  onSave,
}: StudentAddEditModalProps) {
  const [loading, setLoading] = useState(false);

  const { data: gradesResponse, isLoading: gradesLoading } = useGetAllGrades() as { data?: Grade[]; isLoading: boolean };
  const grades: Grade[] = gradesResponse ?? [];



  const initialValues: StudentFormType = {
    firstName: data?.firstName ?? "",
    middleName: data?.middleName ?? "",
    lastName: data?.lastName ?? "",
    gradeId: data?.gradeId ?? (grades[0]?.id ?? 0),
    sectionId: data?.sectionId ?? (grades[0]?.sections?.[0]?.id ?? 0),
    rollNo: data?.rollNo ?? 0,
    gender: data?.gender ?? "Male",
    bloodGroup: data?.bloodGroup ?? "A+",
    dob: data?.dob ?? "",
    admissionDate: data?.admissionDate ?? "",
    address: data?.address ?? "",
    parent: data?.parent ?? "",
    parentContact: data?.parentContact ?? "",
    photo: data?.photo ?? "",
    isActive: data?.isActive ?? true,
  };

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
        submitLabel={data ? "Update Student" : "Add Student"}
        grades={grades}
      />
    </BaseModal>
  );
}
