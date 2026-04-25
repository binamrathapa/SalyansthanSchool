"use client";

import { useMemo, useState, useEffect } from "react";
import CustomTable from "@/app/dashboard/components/dashboard/common/CustomTable";
import { studentColumns } from "@/app/dashboard/config/table/studentTableConfig";
import { Student, StudentQueryParameters } from "@/app/dashboard/types/student";
import StudentAddEditModal from "@/app/dashboard/student/StudentAddEditModal";
import StudentViewModal from "@/app/dashboard/student/StudentViewModal";
import { showConfirm } from "@/lib/sweet-alert";
import { StudentFormType } from "@/lib/validation/student.schema";
import {
  useDeleteStudent,
  usePatchStudent,
  useCreateStudent,
  useGetAllStudentsPaginated
} from "@/server-action/api/student.api";
import { useGetAllGrades } from "@/server-action/api/grade.api";
import LoadingWrapper from "../components/dashboard/common/GlobalLoaderWrapper";

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


// Build FormData for UPDATE (sending all fields for PUT)
const buildUpdateStudentFormData = async (
  values: StudentFormType,
  student: Student
): Promise<FormData> => {
  const formData = new FormData();
  formData.append("Id", String(student.id));
  formData.append("FirstName", values.firstName);
  formData.append("MiddleName", values.middleName || "");
  formData.append("LastName", values.lastName);
  formData.append("Gender", values.gender);
  formData.append("BloodGroup", values.bloodGroup || "");
  formData.append("DateOfBirth", values.dob || "");
  formData.append("AdmissionDate", values.admissionDate || "");
  formData.append("Address", values.address || "");
  formData.append("GuardianName", values.parent || "");
  formData.append("GuardianContact", values.parentContact || "");
  formData.append("GradeId", String(values.gradeId));
  formData.append("SectionId", String(values.sectionId));
  formData.append("IsActive", String(values.isActive));

  if (values.photo && !values.photo.startsWith("http")) {
    const res = await fetch(values.photo);
    const blob = await res.blob();
    formData.append("PhotoFile", blob, "student.jpg");
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

  // Server-side state
  const [queryParams, setQueryParams] = useState<StudentQueryParameters>({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    sortBy: "id",
    sortDir: "desc",
    gradeId: undefined,
  });

  // Local search state for debouncing
  const [searchTerm, setSearchTerm] = useState("");

  const { data: studentsResponse, isLoading } = useGetAllStudentsPaginated(queryParams);
  const students = studentsResponse?.data || [];
  const totalItems = studentsResponse?.meta?.total || 0;

  const { data: gradesData } = useGetAllGrades();

  const createMutation = useCreateStudent();
  const patchMutation = usePatchStudent();
  const deleteMutation = useDeleteStudent();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setQueryParams(prev => ({ ...prev, search: searchTerm, pageNumber: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const gradeFilterOptions = useMemo(() => {
    if (!gradesData) return [];
    return gradesData.map((grade) => ({
      label: grade.name,
      value: String(grade.id),
      key: "gradeId" as any,
    }));
  }, [gradesData]);

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
        const formData = await buildUpdateStudentFormData(values, editingStudent);
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

  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({ ...prev, pageNumber: page }));
  };

  const handleFilterChange = (val: string) => {
    const gradeId = val === "__all__" ? undefined : Number(val);
    setQueryParams(prev => ({ ...prev, gradeId, pageNumber: 1 }));
  };

  // ----------------- RENDER -----------------

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Student Details</h1>
      </div>
      <LoadingWrapper isLoading={isLoading}>
        <CustomTable
          caption="Student Details"
          columns={studentColumns(handleView, handleEdit, handleDelete)}
          data={students}
          isLoading={isLoading}
          limit={queryParams.pageSize}
          addButtonLabel="Add Student"
          onAddClick={handleAdd}
          showDelete
          serverSide={true}
          totalItems={totalItems}
          currentPage={queryParams.pageNumber}
          onPageChange={handlePageChange}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filterValue={queryParams.gradeId ? String(queryParams.gradeId) : ""}
          onFilterChange={handleFilterChange}
          filterOptions={gradeFilterOptions}
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
      </LoadingWrapper>
    </div>
  );
};

export default StudentList;
