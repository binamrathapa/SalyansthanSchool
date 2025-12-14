"use client";

import { useMemo, useState } from "react";
import CustomTable from "@/app/dashboard/components/dashboard/common/CustomTable";
import {
  studentColumns,
  Student,
} from "@/app/dashboard/config/studentTableConfig";
import { students } from "@/app/dashboard/data/studentsData";
import StudentAddEditModal from "@/app/dashboard/student/StudentAddEditModal";
import StudentViewModal from "@/app/dashboard/student/StudentViewModal";
import { showAlert, showConfirm } from "@/lib/sweet-alert";
import { StudentFormType } from "@/lib/validation/student.schema";
import { generateFilterOptions } from "@/app/dashboard/utils/generateFilterOptions";

const StudentList = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [openView, setOpenView] = useState(false);
  const [openAddEdit, setOpenAddEdit] = useState(false);

  /* ✅ CORRECT: memoized filter options */
  const statusFilterOptions = useMemo(
    () => generateFilterOptions(students, "grade"),
    []
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
      text: `Are you sure you want to delete ${student.name}?`,
      confirmButtonText: "Delete",
    });

    if (!confirmed) return;

    console.log("Delete:", student);
    showAlert({ type: "success", title: "Student deleted successfully!" });
  };

  // ---------------- SAVE (ADD / EDIT) ----------------
  const handleSave = async (values: StudentFormType) => {
    console.log("All form data:", values);
    const isEdit = Boolean(editingStudent);

    const confirmed = await showConfirm({
      title: isEdit ? "Update Student?" : "Add Student?",
      text: isEdit
        ? "Do you want to save these changes?"
        : "Do you want to add this student?",
      confirmButtonText: isEdit ? "Update" : "Add",
    });

    if (!confirmed) return;

    if (isEdit) {
      console.log("Updating:", values);
      showAlert({ type: "success", title: "Student updated successfully!" });
    } else {
      console.log("Adding:", values);
      showAlert({ type: "success", title: "Student added successfully!" });
    }

    setOpenAddEdit(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Student Details</h1>
      </div>

      <CustomTable
        caption="Student Details"
        columns={studentColumns(handleView, handleEdit, handleDelete)}
        data={students}
        limit={5}
        addButtonLabel="Add Student"
        onAddClick={handleAdd}
        searchableKeys={["name", "parent", "grade"]}
        filterOptions={statusFilterOptions}
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
