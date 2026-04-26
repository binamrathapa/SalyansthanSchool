"use client";

import React from "react";
import { UserCheck, GraduationCap, Briefcase, Award } from "lucide-react";

interface TeacherInsightsProps {
  facultyStats: { label: string; value: string | number }[];
  departmentStaffing: { subject: string; value: number }[];
}

const facultyConfig = [
  { icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
  { icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
  { icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
];

export default function TeacherInsights({
  facultyStats,
  departmentStaffing,
}: TeacherInsightsProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Faculty Insights</h3>
          <p className="text-sm text-gray-500">Summary of teaching staff</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {facultyStats.map((stat, index) => {
          const config = facultyConfig[index] || facultyConfig[0];
          const Icon = config.icon;

          return (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center rounded-xl border border-gray-50 p-4 transition-colors hover:bg-gray-50"
            >
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${config.bg}`}
              >
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>
              <span className="text-xl font-bold text-gray-900">{stat.value}</span>
              <span className="text-center text-xs text-gray-500">{stat.label}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h4 className="mb-4 text-sm font-semibold text-gray-700">Staffing by Department</h4>
        <div className="space-y-3">
          {departmentStaffing.map((item) => (
            <div key={item.subject} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-gray-700">{item.subject}</span>
                <span className="text-gray-500">{item.value} Teachers</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-100">
                <div
                  className="h-1.5 rounded-full bg-brand-500"
                  style={{ width: `${(item.value / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
