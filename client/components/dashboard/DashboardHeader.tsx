'use client';

import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

interface DashboardHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  pageTitle?: string;
  pageDescription?: string;
}

export default function DashboardHeader({ 
  isSidebarOpen, 
  setIsSidebarOpen,
  pageTitle = "Dashboard",
  pageDescription = "Welcome to Salyansthan School Management"
}: DashboardHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Menu toggle and breadcrumb */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
            <p className="text-sm text-gray-500">{pageDescription}</p>
          </div>
        </div>

        {/* Right side - User info and actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">John Doe</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}