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
    <header className="bg-white shadow-sm border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
      <div className="flex items-center justify-between px-6 py-4">

        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg transition-colors lg:hidden"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--brand-50)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Menu className="w-5 h-5" style={{ color: 'var(--text-default)' }} />
          </button>

          <div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--text-default)' }}>
              {pageTitle}
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {pageDescription}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--brand-50)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Bell className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium" style={{ color: 'var(--text-default)' }}>
                John Doe
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Administrator
              </p>
            </div>

            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, var(--brand-600), var(--brand-700))`,
              }}
            >
              <User className="w-5 h-5 text-white" />
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
