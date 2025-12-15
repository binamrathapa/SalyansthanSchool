"use client";

import { showConfirm, showError, showSuccess } from "@/lib/sweet-alert";
import { StudentFormType } from "@/lib/validation/student.schema";
import { useState } from "react";
import BaseModal from "../components/dashboard/common/modals/BaseModal";
import StudentForm from "../components/dashboard/forms/StudentForm";

interface StudentAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: Partial<StudentFormType> | null;
  onSave: (values: StudentFormType) => Promise<void> | void;
}

export default function StudentAddEditModal({
  isOpen,
  onClose,
  data,
  onSave,
}: StudentAddEditModalProps) {
  const [loading, setLoading] = useState(false);

  const initialValues: StudentFormType = {
  photo: data?.photo ?? "",
  name: data?.name ?? "",
  grade: data?.grade ?? "",
  rollNo: data?.rollNo ?? "",
  parent: data?.parent ?? "",
  dob: data?.dob ?? "",
  admissionDate: data?.admissionDate ?? "",
  address: data?.address ?? "",
  parentContact: data?.parentContact ?? "",
  gender: data?.gender ?? "",
};


  const handleSubmit = async (values: StudentFormType) => {
    try {
      setLoading(true);
      await onSave(values); // parent handles confirm
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
        disabled={loading}
        submitLabel={data ? "Update" : "Add"}
      />
    </BaseModal>
  );
}
