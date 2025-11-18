
"use client";

import { Trash, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button"; 

import React from "react";
import CustomTable from "@/app/dashboard/components/dashboard/common/CustomTable";
import { studentColumns, Student } from "@/app/dashboard/config/studentTableConfig";

const students: Student[] = [
  {
    photo: "/students/student1.jpg",
    name: "Yujan Rai",
    grade: "10th",
    rollNo: "001",
    parent: "Sudip",
  },
  {
    photo: "/students/student2.jpg",
    name: "Anita Sharma",
    grade: "9th",
    rollNo: "002",
    parent: "Sudip",
  },
];

const StudentList: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Student Details</h1>
     <CustomTable
  caption="List of Students"
  columns={studentColumns}
  data={students}
  page={1}
  limit={5}
  onSelectionChange={(selected) => console.log(selected)}
  renderCell={(row, key) => {
    if (key === "photo") {
      return (
        <img
          src={row[key] as string}
          alt={row.name}
          className="w-12 h-12 rounded-full object-cover"
        />
      );
    }

    // Actions column
    if (key === "actions") {
      return (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("View", row)}
          >
            <Eye className="w-4 h-4" /> 
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("Edit", row)}
          >
            <Edit className="w-4 h-4" /> 
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => console.log("Delete", row)}
          >
            <Trash className="w-4 h-4" /> 
          </Button>
        </div>
      );
    }

    return row[key];
  }}
/>
    </div>
  );
};

export default StudentList;
