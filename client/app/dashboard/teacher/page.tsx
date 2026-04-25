"use client";

import React, { useMemo, useState } from "react";
import CustomTable from "@/app/dashboard/components/dashboard/common/CustomTable";
import {
  teacherColumns,
} from "@/app/dashboard/config/table/teacherTableConfig";
import { Teacher } from "@/app/dashboard/types/teacher";
import TeacherAddEditModal from "@/app/dashboard/teacher/TeacherAddEditModal";
import TeacherViewModal from "@/app/dashboard/teacher/TeacherViewModal";
import { showAlert, showConfirm } from "@/lib/sweet-alert";
import { TeacherFormType } from "@/lib/validation/teacher.schema";
import { generateFilterOptions } from "@/app/dashboard/utils/generateFilterOptions";
import {
  useGetAllTeachers,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
} from "@/server-action/api/teacher.api";
import LoadingWrapper from "../components/dashboard/common/GlobalLoaderWrapper";

// ----------------- HELPERS -----------------

const mapTeacherToForm = (teacher: Teacher): TeacherFormType => ({
  firstName: teacher.firstName,
  middleName: teacher.middleName || "",
  lastName: teacher.lastName,
  gender: teacher.gender || "Male",
  dateOfBirth: teacher.dateOfBirth || "",
  email: teacher.email,
  mobileNo: teacher.mobileNo,
  address: teacher.address || "",
  panNumber: teacher.panNumber,
  nidNumber: teacher.nidNumber || "",
  citizenshipNumber: teacher.citizenshipNumber || "",
  qualification: teacher.qualification,
  joiningDate: teacher.joiningDate,
  photo: teacher.photo
    ? teacher.photo.startsWith("http")
      ? teacher.photo
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}${teacher.photo.startsWith("/") ? "" : "/"}${teacher.photo}`
    : undefined,
  isActive: teacher.isActive ?? true,
});

const buildTeacherFormData = async (
  values: TeacherFormType,
  id?: number
): Promise<FormData> => {
  const formData = new FormData();
  if (id) formData.append("Id", String(id));
  formData.append("FirstName", values.firstName);
  formData.append("MiddleName", values.middleName || "");
  formData.append("LastName", values.lastName);
  formData.append("Gender", values.gender);
  formData.append("DateOfBirth", values.dateOfBirth);
  formData.append("Email", values.email);
  formData.append("MobileNo", values.mobileNo);
  formData.append("Address", values.address || "");
  formData.append("PanNumber", values.panNumber);
  formData.append("NidNumber", values.nidNumber || "");
  formData.append("Qualification", values.qualification);
  formData.append("JoiningDate", values.joiningDate);
  formData.append("IsActive", String(values.isActive));

  if (values.photo && !values.photo.startsWith("http")) {
    const res = await fetch(values.photo);
    const blob = await res.blob();
    formData.append("Photo", blob, "teacher.jpg");
  }

  return formData;
};

const TeacherList = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [openView, setOpenView] = useState(false);
  const [openAddEdit, setOpenAddEdit] = useState(false);

  // API hooks
  const { data: teachersData, isLoading } = useGetAllTeachers();
  const teachers: Teacher[] = Array.isArray(teachersData) ? teachersData : [];

  const createMutation = useCreateTeacher();
  const updateMutation = useUpdateTeacher();
  const deleteMutation = useDeleteTeacher();

  /* ✅ memoized filter options */
  const genderFilterOptions = useMemo(
    () => generateFilterOptions(teachers, "gender"),
    [teachers]
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
      text: `Are you sure you want to delete ${teacher.fullName}?`,
      confirmButtonText: "Delete",
    });

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(teacher.id);
      showAlert({
        type: "success",
        title: "Teacher deleted successfully!",
      });
    } catch (error) {
      console.error("Delete error:", error);
    }
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

    try {
      const formData = await buildTeacherFormData(values, editingTeacher?.id);

      if (isEdit && editingTeacher) {
        await updateMutation.mutateAsync({
          id: editingTeacher.id,
          data: formData,
        } as any);
      } else {
        await createMutation.mutateAsync(formData);
      }

      showAlert({
        type: "success",
        title: isEdit
          ? "Teacher updated successfully!"
          : "Teacher added successfully!",
      });

      setOpenAddEdit(false);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Teacher Details</h1>
      </div>

      <LoadingWrapper isLoading={isLoading}>
        <CustomTable
          caption="Teacher Details"
          columns={teacherColumns(handleView, handleEdit, handleDelete)}
          data={teachers}
          limit={5}
          addButtonLabel="Add Teacher"
          onAddClick={handleAdd}
          showDelete
          searchableKeys={["fullName", "email", "mobileNo"]}
          filterOptions={genderFilterOptions}
          renderCell={(row, key) => {
            if (key === "photo") {
              return (
                <img
                  src={row.photo || ""}
                  alt={row.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              );
            }
            return (row as any)[key];
          }}
        />
      </LoadingWrapper>

      {selectedTeacher && (
        <TeacherViewModal
          isOpen={openView}
          onClose={() => setOpenView(false)}
          data={mapTeacherToForm(selectedTeacher)}
        />
      )}

      <TeacherAddEditModal
        isOpen={openAddEdit}
        onClose={() => setOpenAddEdit(false)}
        data={editingTeacher ? mapTeacherToForm(editingTeacher) : null}
        onSave={handleSave}
      />
    </div>
  );
};

export default TeacherList;
