"use client";

import React, { useState } from "react";
import { showError } from "@/lib/sweet-alert";
import BaseModal from "../../components/dashboard/common/modals/BaseModal";
import SectionForm from "../../components/dashboard/forms/SectionForm";
import { SectionFormType } from "@/lib/validation/section.schema";

interface SectionAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: Partial<SectionFormType> | null;
  onSave: (values: SectionFormType) => void | Promise<void>;
}

export default function SectionAddEditModal({
  isOpen,
  onClose,
  data,
  onSave,
}: SectionAddEditModalProps) {
  const [loading, setLoading] = useState(false);

  const initialValues: SectionFormType = {
    sectionName: data?.sectionName ?? "",
    isActive: data?.isActive ?? true,
  };

  const handleSubmit = async (values: SectionFormType) => {
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
      title={data ? "Edit Section" : "Add Section"}
      size="md"
    >
      <SectionForm
        key={data ? "edit" : "add"}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        disabled={loading}
        submitLabel={data ? "Update Section" : "Add Section"}
      />
    </BaseModal>
  );
}
