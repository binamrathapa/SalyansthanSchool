"use client";

import { useMemo, useState } from "react";
import CustomTable from "@/app/dashboard/components/dashboard/common/CustomTable";
import { studentColumns } from "@/app/dashboard/config/table/studentTableConfig";
import { Student } from "@/app/dashboard/types/student";
import StudentAddEditModal from "@/app/dashboard/student/StudentAddEditModal";
import StudentViewModal from "@/app/dashboard/student/StudentViewModal";
import { showConfirm } from "@/lib/sweet-alert";
import { StudentFormType } from "@/lib/validation/student.schema";
import { generateFilterOptions } from "@/app/dashboard/utils/generateFilterOptions";
import {
  useGetAllStudents,
  useDeleteStudent,
  usePatchStudent,
  useCreateStudent
} from "@/server-action/api/student.api";

// ----------------- HELPERS -----------------

// Map API Student to form type
const mapStudentToForm = (student: Student): StudentFormType => ({
  firstName: student.firstName,
  middleName: student.middleName || "",
  lastName: student.lastName,
  gradeId: student.gradeId ?? undefined,
  gradeName: student.gradeName || "",
  sectionId: student.sectionId ?? undefined,
  sectionName: student.sectionName || "",
  rollNo: student.rollNo,
  parent: student.guardianName || "",
  parentContact: student.guardianContact || "",
  bloodGroup: student.bloodGroup || "A+",
  dob: student.dateOfBirth || "",
  admissionDate: student.admissionDate || "",
  address: student.address || "",
  gender: student.gender || "Male",
  photo: student.photo
    ? student.photo.startsWith("http")
      ? student.photo
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}${student.photo.startsWith("/") ? "" : "/"}${student.photo}`
    : undefined, isActive: student.isActive ?? true,

});


//Patch
const buildPatchStudentFormData = async (
  values: StudentFormType,
  student: Student
): Promise<FormData> => {
  const formData = new FormData();
  formData.append("id", String(student.id));
  if (values.firstName !== student.firstName) formData.append("firstName", values.firstName);
  if ((values.middleName || "") !== (student.middleName || "")) formData.append("middleName", values.middleName || "");
  if (values.lastName !== student.lastName) formData.append("lastName", values.lastName);
  if (values.gender !== student.gender) formData.append("gender", values.gender);
  if (values.bloodGroup !== student.bloodGroup) formData.append("bloodGroup", values.bloodGroup || "");
  if (values.dob !== student.dateOfBirth) formData.append("dateOfBirth", values.dob || "");
  if (values.address !== student.address) formData.append("address", values.address || "");
  if (values.parent !== student.guardianName) formData.append("guardianName", values.parent || "");
  if (values.parentContact !== student.guardianContact) formData.append("guardianContact", values.parentContact || "");
  if (values.gradeId !== student.gradeId) formData.append("gradeId", String(values.gradeId));
  if (values.sectionId !== student.sectionId) formData.append("sectionId", String(values.sectionId));
  if (values.isActive !== student.isActive) formData.append("isActive", String(values.isActive));

  if (values.photo && !values.photo.startsWith("http")) {
    const res = await fetch(values.photo);
    const blob = await res.blob();
    formData.append("photoFile", blob, "student.jpg");
  }

  return formData;
};



// CreateStudentPayload
const buildCreateStudentFormData = async (
  values: StudentFormType
): Promise<FormData> => {
  const formData = new FormData();

  formData.append("FirstName", values.firstName);
  formData.append("MiddleName", values.middleName || "");
  formData.append("LastName", values.lastName);
  formData.append("Gender", values.gender);
  formData.append("BloodGroup", values.bloodGroup);
  formData.append("DateOfBirth", values.dob);
  formData.append("AdmissionDate", values.admissionDate);
  formData.append("Address", values.address || "");
  formData.append("GuardianName", values.parent || "");
  formData.append("GuardianContact", values.parentContact || "");
  formData.append("GradeId", String(values.gradeId));
  formData.append("SectionId", String(values.sectionId));
  formData.append("IsActive", "true");
  if (values.photo) {
    const res = await fetch(values.photo);
    const blob = await res.blob();
    formData.append("PhotoFile", blob, "student.jpg");
  }

  return formData;
};



// ----------------- COMPONENT -----------------

const StudentList = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [openView, setOpenView] = useState(false);
  const [openAddEdit, setOpenAddEdit] = useState(false);

  const { data: studentsData, isLoading } = useGetAllStudents();
  const students: Student[] = Array.isArray(studentsData) ? studentsData : [];

  const createMutation = useCreateStudent();
  const patchMutation = usePatchStudent();
  const deleteMutation = useDeleteStudent();

  const statusFilterOptions = useMemo(
    () => generateFilterOptions(students, "gradeName"),
    [students]
  );

  // ---------------- HANDLERS -----------------

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setOpenView(true);
  };

  const handleAdd = () => {
    setEditingStudent(null);
    setOpenAddEdit(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setOpenAddEdit(true);
  };

  const handleDelete = async (student: Student) => {
    const confirmed = await showConfirm({
      title: "Delete Student?",
      text: `Are you sure you want to delete ${student.fullName}?`,
      confirmButtonText: "Delete",
    });

    if (confirmed) {
      deleteMutation.mutate(student.id);
    }
  };

  const handleSave = async (values: StudentFormType) => {

    const isEdit = Boolean(editingStudent);

    const confirmed = await showConfirm({
      title: isEdit ? "Update Student?" : "Add Student?",
      text: isEdit
        ? "Do you want to save these changes?"
        : "Do you want to add this student?",
      confirmButtonText: isEdit ? "Update" : "Add",
    });

    if (!confirmed) return;

    try {
      if (isEdit && editingStudent) {
        const formData = await buildPatchStudentFormData(values, editingStudent);
        await patchMutation.mutateAsync({
          id: editingStudent.id,
          data: formData,
        });
      } else {
        const payload = await buildCreateStudentFormData(values);
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
        <h1 className="text-2xl font-bold">Student Details</h1>
      </div>

      <CustomTable
        caption="Student Details"
        columns={studentColumns(handleView, handleEdit, handleDelete)}
        data={students}
        isLoading={isLoading}
        limit={5}
        addButtonLabel="Add Student"
        onAddClick={handleAdd}
        showDelete
        searchableKeys={["fullName", "guardianName", "dateOfBirth"]}
        filterOptions={statusFilterOptions}
      />

      {selectedStudent && (
        <StudentViewModal
          isOpen={openView}
          onClose={() => setOpenView(false)}
          data={mapStudentToForm(selectedStudent)}
        />
      )}

      <StudentAddEditModal
        isOpen={openAddEdit}
        onClose={() => setOpenAddEdit(false)}
        data={editingStudent ? mapStudentToForm(editingStudent) : null}
        onSave={handleSave}
      />
    </div>
  );
};

export default StudentList;
