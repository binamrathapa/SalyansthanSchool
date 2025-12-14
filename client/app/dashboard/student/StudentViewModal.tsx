"use client";

import BaseModal from "../components/dashboard/common/modals/BaseModal";
import StudentForm from "../components/dashboard/forms/StudentForm";
import { StudentFormType } from "@/lib/validation/student.schema";

interface StudentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: StudentFormType;
}

export default function StudentViewModal({
  isOpen,
  onClose,
  data,
}: StudentViewModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="View Student"
      size="lg"
    >
      <StudentForm
        initialValues={data}
        mode="view"
      />
    </BaseModal>
  );
}
