'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
}

export default function DashboardLayout({ 
  children, 
  pageTitle,
  pageDescription 
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300`}>
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DashboardHeader 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
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