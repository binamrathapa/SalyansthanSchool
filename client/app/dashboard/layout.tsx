"use client";

import React, { useState } from "react";
import "./dashboard.css";
import Sidebar from "./components/dashboard/Sidebar";
import DashboardHeader from "./components/dashboard/DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
}

export default function DashboardLayout({
  children,
  pageTitle,
  pageDescription,
}: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Sidebar (NO WIDTH HERE) */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader
          isSidebarOpen={!isSidebarCollapsed}
          setIsSidebarOpen={() =>
            setIsSidebarCollapsed((prev) => !prev)
          }
          pageTitle={pageTitle}
          pageDescription={pageDescription}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
