"use client";

import React from "react";
import {
  Users,
  UserSquare2,
  GraduationCap,
  Clock,
  Calendar,
  Bell
} from "lucide-react";
import SummaryCard from "./components/dashboard/SummaryCard";
import StudentDistribution from "./components/dashboard/StudentDistribution";
import TeacherInsights from "./components/dashboard/TeacherInsights";
import MiniAccountSummary from "./components/dashboard/MiniAccountSummary";

// Import unified dashboard data
import dashboardData from "./data/dashboard-summary.json";

const metricConfigs: Record<string, { icon: any; color: "blue" | "purple" | "green" | "orange" }> = {
  students: { icon: Users, color: "blue" },
  teachers: { icon: UserSquare2, color: "purple" },
  classes: { icon: GraduationCap, color: "green" },
  attendance: { icon: Clock, color: "orange" },
};

export default function DashboardHome() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          School Overview
        </h1>
        <p className="text-gray-500">
          Here's what's happening at Salyansthan School today.
        </p>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardData.metrics.map((metric: any) => {
          const config = metricConfigs[metric.id] || metricConfigs.students;
          return (
            <SummaryCard
              key={metric.id}
              title={metric.title}
              value={metric.value}
              icon={config.icon}
              description={metric.description}
              trend={metric.trend}
              color={config.color}
            />
          );
        })}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StudentDistribution
            classData={dashboardData.studentEnrollment}
            genderData={dashboardData.genderRatio}
          />
        </div>
        <div className="lg:col-span-1">
          <MiniAccountSummary
            dailyCollection={dashboardData.financialQuickLook.dailyCollection}
            pendingDues={dashboardData.financialQuickLook.pendingDues}
            weeklyTrend={dashboardData.financialQuickLook.weeklyTrend}
          />
        </div>
      </div>

      {/* Bottom Section: Faculty & Quick Links */}
      {/* <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TeacherInsights
            facultyStats={dashboardData.facultyStats}
            departmentStaffing={dashboardData.departmentStaffing}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Important Dates</h3>
            <div className="space-y-4">
              {dashboardData.importantDates.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 min-w-[32px] items-center justify-center rounded-lg bg-brand-50">
                    <Calendar className="h-4 w-4 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Latest Notices</h3>
            <div className="space-y-4">
              {dashboardData.latestNotices.map((notice, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 min-w-[32px] items-center justify-center rounded-lg bg-rose-50">
                    <Bell className="h-4 w-4 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{notice.title}</p>
                    <p className="text-xs text-gray-500">{notice.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
