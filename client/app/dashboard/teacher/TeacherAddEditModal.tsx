"use client";

import { showError } from "@/lib/sweet-alert";
import { TeacherFormType } from "@/lib/validation/teacher.schema";
import { useState } from "react";
import BaseModal from "@/app/dashboard/components/dashboard/common/modals/BaseModal";
import TeacherForm from "@/app/dashboard/components/dashboard/forms/TeacherForm";

interface TeacherAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: Partial<TeacherFormType> | null;
  onSave: (values: TeacherFormType) => Promise<void> | void;
}

export default function TeacherAddEditModal({
  isOpen,
  onClose,
  data,
  onSave,
}: TeacherAddEditModalProps) {
  const [loading, setLoading] = useState(false);

  const initialValues: TeacherFormType = {
  photo: data?.photo ?? "",
  name: data?.name ?? "",
  subject: data?.subject ?? "",
  qualification: data?.qualification ?? "",
  designation: data?.designation ?? "",
  experience: data?.experience ?? "",
  dob: data?.dob ?? "",
  joiningDate: data?.joiningDate ?? "",
  address: data?.address ?? "",
  contact: data?.contact ?? "",
  panNumber: data?.panNumber ?? "",
  nidNumber: data?.nidNumber ?? "",
  citizenshipNumber: data?.citizenshipNumber ?? "",
  gender: data?.gender ?? "Male",
};



  const handleSubmit = async (values: TeacherFormType) => {
    try {
      setLoading(true);
      await onSave(values); 
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
      title={data ? "Edit Teacher" : "Add Teacher"}
      size="lg"
    >
      <TeacherForm
        key={data ? "edit" : "add"}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        disabled={loading}
        submitLabel={data ? "Update Teacher" : "Add Teacher"}
      />
    </BaseModal>
  );
}
