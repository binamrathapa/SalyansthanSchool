"use client";

import BaseModal from "../components/dashboard/common/modals/BaseModal";
import TeacherForm from "../components/dashboard/forms/TeacherForm";
import { TeacherFormType } from "@/lib/validation/teacher.schema";

interface TeacherViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TeacherFormType;
}

export default function TeacherViewModal({
  isOpen,
  onClose,
  data,
}: TeacherViewModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="View Teacher"
      size="lg"
    >
      {/* Render the form in view-only mode */}
      <TeacherForm initialValues={data} mode="view" />
    </BaseModal>
  );
}
