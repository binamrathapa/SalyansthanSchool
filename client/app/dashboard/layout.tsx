"use client";

import React, { useState } from "react";
import { ReactQueryProvider } from "@/server-action/providers/QueryClientProviders"; 
import Sidebar from "./components/dashboard/Sidebar";
import DashboardHeader from "./components/dashboard/DashboardHeader";
import "./dashboard.css";

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
    <ReactQueryProvider>
      <div className="flex h-screen w-full overflow-hidden bg-gray-50">
        {/* Sidebar */}
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
    </ReactQueryProvider>
  );
}
