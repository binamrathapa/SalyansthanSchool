"use client";

import React, { useState, useMemo } from "react";
import CustomTable from "@/app/dashboard/components/dashboard/common/CustomTable";
import { sectionColumns } from "@/app/dashboard/config/table/sectionTableConfig";
import { Section } from "@/app/dashboard/types/grade";
import { showConfirm } from "@/lib/sweet-alert";
import { SectionFormType } from "@/lib/validation/section.schema";
import SectionAddEditModal from "./SectionAddEditModal";
import { generateFilterOptions } from "@/app/dashboard/utils/generateFilterOptions";
import LoadingWrapper from "../../components/dashboard/common/GlobalLoaderWrapper";

import {
  useGetAllSections,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
  useFullUpdateSection,
} from "@/server-action/api/section.api";

/* ================= HELPERS ================= */

// Map API Section → Form
const mapSectionToForm = (section: Section): SectionFormType => ({
  sectionName: section.name,
  isActive: true, // Assuming default active
});

/* ================= COMPONENT ================= */

const SectionPage = () => {
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [openAddEdit, setOpenAddEdit] = useState(false);

  // API hooks
  const { data: sectionsData, isLoading } = useGetAllSections();

  const sections: Section[] = useMemo(() => {
    if (!Array.isArray(sectionsData)) return [];
    return sectionsData.map((s: any) => ({
      id: s.id,
      name: s.sectionName,
    }));
  }, [sectionsData]);

  const createMutation = useCreateSection();
  const updateMutation = useFullUpdateSection();
  const deleteMutation = useDeleteSection();

  const filterOptions = useMemo(
    () => generateFilterOptions(sections, "name"),
    [sections]
  );

  /* =============== HANDLERS =============== */

  const handleAdd = () => {
    setEditingSection(null);
    setOpenAddEdit(true);
  };

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    setOpenAddEdit(true);
  };

  const handleDelete = async (section: Section) => {
    const confirmed = await showConfirm({
      title: "Delete Section?",
      text: `Are you sure you want to delete ${section.name}?`,
      confirmButtonText: "Delete",
    });

    if (confirmed) {
      deleteMutation.mutate(section.id);
    }
  };

  const handleSave = async (values: SectionFormType) => {
    const isEdit = Boolean(editingSection);

    const confirmed = await showConfirm({
      title: isEdit ? "Update Section?" : "Add Section?",
      text: isEdit
        ? "Do you want to save these changes?"
        : "Do you want to add this section?",
      confirmButtonText: isEdit ? "Update" : "Add",
    });

    if (!confirmed) return;

    try {
      if (isEdit && editingSection) {
        await updateMutation.mutateAsync({
          id: editingSection.id,
          sectionName: values.sectionName,
          isActive: values.isActive,
        } as any);
      } else {
        await createMutation.mutateAsync({
          sectionName: values.sectionName,
          isActive: values.isActive,
        } as any);
      }

      setOpenAddEdit(false);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Sections</h1>
      </div>

      <LoadingWrapper isLoading={isLoading}>
        <CustomTable
          caption="Sections List"
          columns={sectionColumns(handleEdit, handleDelete)}
          data={sections}
          isLoading={isLoading}
          limit={10}
          addButtonLabel="Add Section"
          onAddClick={handleAdd}
          showDelete
          searchableKeys={["name"]}
          filterOptions={filterOptions}
        />

        <SectionAddEditModal
          isOpen={openAddEdit}
          onClose={() => setOpenAddEdit(false)}
          data={editingSection ? mapSectionToForm(editingSection) : null}
          onSave={handleSave}
        />
      </LoadingWrapper>
    </div>
  );
};

export default SectionPage;
