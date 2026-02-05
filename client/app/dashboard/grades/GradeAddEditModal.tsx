"use client";

import React, { useState } from "react";
import { showError } from "@/lib/sweet-alert";
import BaseModal from "../components/dashboard/common/modals/BaseModal";
import GradeForm from "../components/dashboard/forms/GradeForm";
import { GradeFormType } from "@/lib/validation/grade.schema";

interface GradeAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: Partial<GradeFormType> | null;
  sections: {id: number, name: string}[];
  onSave: (values: GradeFormType) => void | Promise<void>;
}

export default function GradeAddEditModal({
  isOpen,
  onClose,
  data,
  sections,
  onSave,
}: GradeAddEditModalProps) {
  const [loading, setLoading] = useState(false);

  const initialValues: GradeFormType = {
    name: data?.name ?? "",
    sections: data?.sections ?? [],
    isActive: data?.isActive ?? true,
  };

  const handleSubmit = async (values: GradeFormType) => {
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
      title={"Add Grade"}
      size="lg"
    >
      <GradeForm
        key={"add"}
        initialValues={initialValues}
        sections={sections}
        onSubmit={handleSubmit}
        disabled={loading}
        submitLabel={ "Add Grade"}
      />
    </BaseModal>
  );
}
