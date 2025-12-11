"use client";
import { useState } from "react";
import CustomTable from "@/app/dashboard/components/dashboard/common/CustomTable";
import {
  studentColumns,
  Student,
  studentModalFields,
} from "@/app/dashboard/config/studentTableConfig";
import { students } from "@/app/dashboard/data/studentsData";
import ReusableDetailsModal from "@/app/dashboard/components/dashboard/common/modals/ReusableDetailsModal";

const StudentList = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [open, setOpen] = useState(false);

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setOpen(true);
  };

  const handleEdit = (student: Student) => {
    alert("Edit:");
  };

  const handleDelete = (student: Student) => {
    console.log("Delete:", student);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Student Details</h1>

      <CustomTable
        caption="Student Details"
        columns={studentColumns(handleView, handleEdit, handleDelete)}
        data={students}
        limit={5}
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

      <ReusableDetailsModal
        open={open}
        onClose={() => setOpen(false)}
        title="Student Details"
        subtitle={`Viewing details for ${selectedStudent?.name}`}
        data={selectedStudent}
        fields={studentModalFields}
        size="lg"
      />
    </div>
  );
};

export default StudentList;
