"use client";

import { Trash, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomTable from "@/app/dashboard/components/dashboard/common/CustomTable";

import { studentColumns } from "@/app/dashboard/config/studentTableConfig";
import { students } from "@/app/dashboard/data/studentsData";

const StudentList = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Student Details</h1>

      <CustomTable
        caption="Student Report"
        columns={studentColumns}
        data={students}
        page={1}
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

          if (key === "actions") {
            return (
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>

                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>

                <Button variant="destructive" size="sm">
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
