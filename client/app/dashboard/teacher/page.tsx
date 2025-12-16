"use client";

import { useMemo, useState } from "react";
import CustomTable from "@/app/dashboard/components/dashboard/common/CustomTable";
import {
  teacherColumns,
  Teacher,
} from "@/app/dashboard/config/table/teacherTableConfig";
import { teachers } from "@/app/dashboard/data/teachersData";
import TeacherAddEditModal from "@/app/dashboard/teacher/TeacherAddEditModal";
import TeacherViewModal from "@/app/dashboard/teacher/TeacherViewModal";
import { showAlert, showConfirm } from "@/lib/sweet-alert";
import { TeacherFormType } from "@/lib/validation/teacher.schema";
import { generateFilterOptions } from "@/app/dashboard/utils/generateFilterOptions";

const TeacherList = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [openView, setOpenView] = useState(false);
  const [openAddEdit, setOpenAddEdit] = useState(false);

  /* ✅ memoized filter options (example: department) */
  const departmentFilterOptions = useMemo(
    () => generateFilterOptions(teachers, "gender"),
    []
  );

  // ---------------- VIEW ----------------
  const handleView = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setOpenView(true);
  };

  // ---------------- ADD ----------------
  const handleAdd = () => {
    setEditingTeacher(null);
    setOpenAddEdit(true);
  };

  // ---------------- EDIT ----------------
  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setOpenAddEdit(true);
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (teacher: Teacher) => {
    const confirmed = await showConfirm({
      title: "Delete Teacher?",
      text: `Are you sure you want to delete ${teacher.name}?`,
      confirmButtonText: "Delete",
    });

    if (!confirmed) return;

    showAlert({
      type: "success",
      title: "Teacher deleted successfully!",
    });
  };

  // ---------------- BULK DELETE ----------------
  const handleBulkDelete = async (selectedTeachers: Teacher[]) => {
    const confirmed = await showConfirm({
      title: "Delete Teachers?",
      text: `Are you sure you want to delete ${selectedTeachers.length} teachers?`,
      confirmButtonText: "Delete",
    });

    if (!confirmed) return;

    // 👉 Call API here (later)
    // await deleteTeachers(selectedTeachers.map(t => t.id));

    showAlert({
      type: "success",
      title: `${selectedTeachers.length} teachers deleted successfully!`,
    });
  };

  // ---------------- SAVE (ADD / EDIT) ----------------
  const handleSave = async (values: TeacherFormType) => {
    const isEdit = Boolean(editingTeacher);

    const confirmed = await showConfirm({
      title: isEdit ? "Update Teacher?" : "Add Teacher?",
      text: isEdit
        ? "Do you want to save these changes?"
        : "Do you want to add this teacher?",
      confirmButtonText: isEdit ? "Update" : "Add",
    });

    if (!confirmed) return;

    showAlert({
      type: "success",
      title: isEdit
        ? "Teacher updated successfully!"
        : "Teacher added successfully!",
    });

    setOpenAddEdit(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Teacher Details</h1>
      </div>

      <CustomTable
        caption="Teacher Details"
        columns={teacherColumns(handleView, handleEdit, handleDelete)}
        data={teachers}
        limit={5}
        addButtonLabel="Add Teacher"
        onAddClick={handleAdd}
        showDelete
        onDelete={handleBulkDelete}
        searchableKeys={["name", "designation", "subject"]}
        filterOptions={departmentFilterOptions}
        renderCell={(row, key) => {
          if (key === "photo") {
            return (
              <img
                src={row.photo}
                alt={row.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            );
          }
          return row[key];
        }}
      />

      {selectedTeacher && (
        <TeacherViewModal
          isOpen={openView}
          onClose={() => setOpenView(false)}
          data={selectedTeacher as TeacherFormType}
        />
      )}

      <TeacherAddEditModal
        isOpen={openAddEdit}
        onClose={() => setOpenAddEdit(false)}
        data={editingTeacher as Partial<TeacherFormType> | null}
        onSave={handleSave}
      />
    </div>
  );
};

export default TeacherList;
