"use client";

import { useMemo, useState } from "react";
import CustomTable from "@/app/dashboard/components/dashboard/common/CustomTable";
import {
  teacherColumns,
} from "@/app/dashboard/config/table/teacherTableConfig";
import { Teacher } from "@/app/dashboard/types/teacher";
import {
  useGetAllTeachers,
  useDeleteTeacher,
  useCreateTeacher,
  useUpdateTeacher,
} from "@/server-action/api/teacher.api";
import TeacherAddEditModal from "@/app/dashboard/teacher/TeacherAddEditModal";
import TeacherViewModal from "@/app/dashboard/teacher/TeacherViewModal";
import { showConfirm } from "@/lib/sweet-alert";
import { TeacherFormType } from "@/lib/validation/teacher.schema";
import { generateFilterOptions } from "@/app/dashboard/utils/generateFilterOptions";
import LoadingWrapper from "../components/dashboard/common/GlobalLoaderWrapper";

// ----------------- HELPERS -----------------

// Map API Teacher to form type
const mapTeacherToForm = (teacher: Teacher): TeacherFormType => ({
  firstName: teacher.firstName,
  middleName: teacher.middleName || "",
  lastName: teacher.lastName,
  gender: teacher.gender || "Male",
  dateOfBirth: teacher.dateOfBirth || "",
  email: teacher.email || "",
  mobileNo: teacher.mobileNo || "",
  address: teacher.address || "",
  panNumber: teacher.panNumber || "",
  nidNumber: teacher.nidNumber || "",
  qualification: teacher.qualification || "",
  joiningDate: teacher.joiningDate || "",
  photo: teacher.photo
    ? teacher.photo.startsWith("http")
      ? teacher.photo
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}${teacher.photo.startsWith("/") ? "" : "/"}${teacher.photo}`
    : undefined,
  isActive: teacher.isActive ?? true,
});

// Build FormData for UPDATE (sending all fields for PUT)
const buildUpdateTeacherFormData = async (
  values: TeacherFormType,
  teacher: Teacher
): Promise<FormData> => {
  const formData = new FormData();
  formData.append("Id", String(teacher.id));
  formData.append("FirstName", values.firstName);
  formData.append("MiddleName", values.middleName || "");
  formData.append("LastName", values.lastName);
  formData.append("Gender", values.gender);
  formData.append("DateOfBirth", values.dateOfBirth || "");
  formData.append("Email", values.email);
  formData.append("MobileNo", values.mobileNo);
  formData.append("Address", values.address || "");
  formData.append("PanNumber", values.panNumber);
  formData.append("NidNumber", values.nidNumber || "");
  formData.append("Qualification", values.qualification);
  formData.append("JoiningDate", values.joiningDate);
  formData.append("IsActive", String(values.isActive));

  if (values.photo && !values.photo.startsWith("http")) {
    try {
      const res = await fetch(values.photo);
      const blob = await res.blob();
      formData.append("Photo", blob, "teacher.jpg");
    } catch (error) {
      console.error("Error processing photo:", error);
    }
  }

  return formData;
};

// Build FormData for CREATE
const buildCreateTeacherFormData = async (
  values: TeacherFormType
): Promise<FormData> => {
  const formData = new FormData();

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
  formData.append("IsActive", String(values.isActive ?? true));

  if (values.photo) {
    try {
      const res = await fetch(values.photo);
      const blob = await res.blob();
      formData.append("Photo", blob, "teacher.jpg");
    } catch (error) {
      console.error("Error processing photo:", error);
    }
  }

  return formData;
};

// ----------------- COMPONENT -----------------

const TeacherList = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [openView, setOpenView] = useState(false);
  const [openAddEdit, setOpenAddEdit] = useState(false);

  const { data: teachersData, isLoading } = useGetAllTeachers();
  const teachers: Teacher[] = Array.isArray(teachersData) ? teachersData : [];

  const createMutation = useCreateTeacher();
  const updateMutation = useUpdateTeacher();
  const deleteMutation = useDeleteTeacher();

  const filterOptions = useMemo(
    () => generateFilterOptions(teachers, "gender"),
    [teachers]
  );

  // ---------------- HANDLERS -----------------

  const handleView = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setOpenView(true);
  };

  const handleAdd = () => {
    setEditingTeacher(null);
    setOpenAddEdit(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setOpenAddEdit(true);
  };

  const handleDelete = async (teacher: Teacher) => {
    const confirmed = await showConfirm({
      title: "Delete Teacher?",
      text: `Are you sure you want to delete ${teacher.fullName || teacher.firstName}?`,
      confirmButtonText: "Delete",
    });

    if (confirmed) {
      deleteMutation.mutate(teacher.id as any);
    }
  };

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
      if (isEdit && editingTeacher) {
        const formData = await buildUpdateTeacherFormData(values, editingTeacher);
        await updateMutation.mutateAsync({
          id: editingTeacher.id,
          data: formData,
        });
      } else {
        const payload = await buildCreateTeacherFormData(values);
        await createMutation.mutateAsync(payload);
      }

      setOpenAddEdit(false);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  // ----------------- RENDER -----------------

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
          isLoading={isLoading}
          limit={5}
          addButtonLabel="Add Teacher"
          onAddClick={handleAdd}
          searchableKeys={["fullName", "email", "mobileNo"]}
          filterOptions={filterOptions}
        />

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
      </LoadingWrapper>
    </div>
  );
};

export default TeacherList;
