"use client";

import { useMemo, useState } from "react";
import CustomTable from "@/app/dashboard/components/dashboard/common/CustomTable";
import {
  studentColumns,
} from "@/app/dashboard/config/table/studentTableConfig";
import { Student } from "@/app/dashboard/types/student";
import StudentAddEditModal from "@/app/dashboard/student/StudentAddEditModal";
import StudentViewModal from "@/app/dashboard/student/StudentViewModal";
import { showConfirm } from "@/lib/sweet-alert";
import { StudentFormType } from "@/lib/validation/student.schema";
import { generateFilterOptions } from "@/app/dashboard/utils/generateFilterOptions";
import {
  useGetAllStudents,
  useDeleteStudent,
  useUpdateStudent,
  useCreateStudent
} from "@/server-action/api/student.api";

// Helper to map API response to StudentFormType
const mapStudentToForm = (student: Student): StudentFormType => ({
  name: student.fullName,
  grade: student.gradeName,
  rollNo: student.rollNo,
  parent: student.guardianName,
  parentContact: student.guardianContact,
  bloodGroup: student.bloodGroup,
  dob: student.dateOfBirth,
  admissionDate: student.admissionDate,
  address: student.address,
  gender: student.gender,
  photo: student.photo ? process.env.NEXT_PUBLIC_BASE_URL + student.photo : undefined,
});



const StudentList = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [openView, setOpenView] = useState(false);
  const [openAddEdit, setOpenAddEdit] = useState(false);

  // Cast the data to Student[] to fix the 'unknown' type issue
  const { data: studentsData, isLoading } = useGetAllStudents();
  const students: Student[] = Array.isArray(studentsData) ? studentsData : [];

  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();

  const statusFilterOptions = useMemo(
    () => generateFilterOptions(students, "gradeName"),
    [students]
  );

  // ---------------- VIEW ----------------
  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setOpenView(true);
  };

  // ---------------- ADD ----------------
  const handleAdd = () => {
    setEditingStudent(null);
    setOpenAddEdit(true);
  };

  // ---------------- EDIT ----------------
  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setOpenAddEdit(true);
  };

  // ---------------- DELETE ----------------
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

  // ---------------- SAVE (ADD / EDIT) ----------------
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
        await updateMutation.mutateAsync({
          id: editingStudent.id,
          ...values,
        });
      } else {
        await createMutation.mutateAsync(values as any);
      }

      setOpenAddEdit(false);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Student Details</h1>
        {/* console.log("Students Data:", students)// Debugging line */}
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
        searchableKeys={["fullName", "guardianName", "gradeName"]}
        filterOptions={statusFilterOptions}
      />

      {/* VIEW MODAL */}
      {selectedStudent && (
        <StudentViewModal
          isOpen={openView}
          onClose={() => setOpenView(false)}
          data={mapStudentToForm(selectedStudent)}
        />
      )}

      {/* ADD/EDIT MODAL */}
      <StudentAddEditModal
        isOpen={openAddEdit}
        onClose={() => setOpenAddEdit(false)}
        data={editingStudent ? mapStudentToForm(editingStudent) : null}
        onSave={handleSave}
      />

      {selectedStudent && (
        <StudentViewModal
          isOpen={openView}
          onClose={() => setOpenView(false)}
          data={selectedStudent as StudentFormType}
        />
      )}

      <StudentAddEditModal
        isOpen={openAddEdit}
        onClose={() => setOpenAddEdit(false)}
        data={editingStudent as Partial<StudentFormType> | null}
        onSave={handleSave}
      />
    </div>
  );
};

export default StudentList;
