"use client";

import React, { useState, useMemo } from "react";
import CustomTable from "@/app/dashboard/components/dashboard/common/CustomTable";
import { gradeColumns } from "@/app/dashboard/config/table/gradeTableConfig";
import {
  Grade,
  Section,
  CreateGradePayload,
  UpdateGradePayload,
} from "@/app/dashboard/types/grade";
import { showConfirm } from "@/lib/sweet-alert";
import { GradeFormType } from "@/lib/validation/grade.schema";
import GradeAddEditModal from "@/app/dashboard/grades/GradeAddEditModal";
import { generateFilterOptions } from "@/app/dashboard/utils/generateFilterOptions";

import {
  useGetAllGrades,
  useDeleteGrade,
  useUpdateGrade,
  useCreateGrade,
} from "@/server-action/api/grade.api";
import { useGetAllSections } from "@/server-action/api/section.api";  
import { create } from "domain";

/* ================= HELPERS ================= */

// Map API Grade → Form
const mapGradeToForm = (grade: Grade): GradeFormType => ({
  name: grade.name,
  sections: grade.sections ?? [],
  isActive: grade.isActive ?? true,
});

// CREATE payload
const buildCreatePayload = (values: GradeFormType): CreateGradePayload => ({
  name: values.name,
  isActive: values.isActive ?? true,
  sectionId: values.sections?.[0]?.id ?? 0, 
});

// UPDATE payload
const buildUpdatePayload = (
  values: GradeFormType,
  grade: Grade
): UpdateGradePayload => ({
  id: grade.id,
  name: values.name !== grade.name ? values.name : undefined,
  isActive:
    values.isActive !== grade.isActive ? values.isActive : undefined,
  sectionId:
    values.sections?.[0]?.id !== grade.sections?.[0]?.id
      ? values.sections?.[0]?.id
      : undefined,
});

/* ================= COMPONENT ================= */

const GradePage = () => {
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [openAddEdit, setOpenAddEdit] = useState(false);

  // API hooks
  const { data: gradesData, isLoading } = useGetAllGrades();
  const grades: Grade[] = Array.isArray(gradesData) ? gradesData : [];

  const { data: sectionsData, isLoading: isLoadingSections } = useGetAllSections();
  
  const sections: Section[] = useMemo(()=>{
    if(!Array.isArray(sectionsData)) return[];
    return sectionsData.map((s:any)=>({
      id: s.id,
      name: s.sectionName,
      isActive: s.isActive,
      createdAt: s.createdAt,
    }));
  },[sectionsData])

  
  const createMutation = useCreateGrade();
  const updateGrade = useUpdateGrade();
  const deleteMutation = useDeleteGrade();


  const statusFilterOptions = useMemo(
    () => generateFilterOptions(grades, "name"),
    [grades]
  );

  /* =============== HANDLERS =============== */

  const handleAdd = () => {
    setEditingGrade(null);
    setOpenAddEdit(true);
  };

  const handleEdit = (grade: Grade) => {
    setEditingGrade(grade);
    setOpenAddEdit(true);
  };

  const handleDelete = async (grade: Grade) => {
    const confirmed = await showConfirm({
      title: "Delete Grade?",
      text: `Are you sure you want to delete ${grade.name}?`,
      confirmButtonText: "Delete",
    });

    if (confirmed) {
      deleteMutation.mutate(grade.id);
    }
  };

  const handleSave = async (values: GradeFormType) => {
    const isEdit = Boolean(editingGrade);

    const confirmed = await showConfirm({
      title: isEdit ? "Update Grade?" : "Add Grade?",
      text: isEdit
        ? "Do you want to save these changes?"
        : "Do you want to add this grade?",
      confirmButtonText: isEdit ? "Update" : "Add",
    });

    if (!confirmed) return;

    try {
      if (isEdit && editingGrade) {
        const payload = buildUpdatePayload(values, editingGrade);
        await updateGrade.mutateAsync(payload);
      } else {
        const payload = buildCreatePayload(values);
        await createMutation.mutateAsync(payload);
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
        <h1 className="text-2xl font-bold">Grades & Sections</h1>
      </div>

      <CustomTable
        caption="Grades & Sections"
        columns={gradeColumns(handleDelete)}
        data={grades}
        isLoading={isLoading}
        limit={5}
        addButtonLabel="Add Grade"
        onAddClick={handleAdd}
        showDelete
        searchableKeys={["name"]}
        filterOptions={statusFilterOptions}
      />

      <GradeAddEditModal
        isOpen={openAddEdit}
        onClose={() => setOpenAddEdit(false)}
        data={editingGrade ? mapGradeToForm(editingGrade) : null}
        sections={sections}
        onSave={handleSave}
      />
    </div>
  );
};

export default GradePage;
