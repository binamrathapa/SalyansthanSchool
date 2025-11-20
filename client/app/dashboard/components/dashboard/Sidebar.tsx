'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  School,
} from 'lucide-react';
import { sidebarItems, SidebarItem } from '@/app/dashboard/config/sideItems';

export default function Sidebar() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [activeItem, setActiveItem] = useState<string>('Dashboard');
  const [activeSubItem, setActiveSubItem] = useState<string>('');

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
    setActiveSubItem('');
  };

  const handleSubItemClick = (subItemName: string) => {
    setActiveSubItem(subItemName);
  };

  return (
    <div className="h-screen w-64 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] flex flex-col">
      
      {/* Header */}
      <div className="p-6 border-b border-[var(--brand-200)] bg-[var(--brand-50)]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(to bottom right, var(--brand-600), var(--brand-700))" }}
          >
            <School className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--text-default)] leading-none">
              Salyansthan School
            </h1>
            <p className="text-xs font-medium text-[var(--brand-600)]">
              Education Excellence
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto no-scrollbar">
        <ul className="space-y-1">
          {sidebarItems.map((item: SidebarItem, idx: number) => (
            <li key={item.name}>
              {item.children ? (
                <>
                  {/* Accordion Button */}
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 justify-between ${
                      openAccordion === idx
                        ? 'bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-200)]'
                        : 'text-[var(--text-default)] hover:bg-[var(--brand-50)] hover:text-[var(--brand-600)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={`h-5 w-5 ${
                          openAccordion === idx
                            ? 'text-[var(--brand-600)]'
                            : 'text-[var(--text-muted)]'
                        }`}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>

                    <ChevronDown
                      className={`h-4 w-4 transition-all duration-200 ${
                        openAccordion === idx
                          ? 'rotate-180 text-[var(--brand-600)]'
                          : 'text-[var(--text-muted)]'
                      }`}
                    />
                  </button>

                  {/* Submenu */}
                  {openAccordion === idx && (
                    <ul className="mt-1 ml-4 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <button
                            onClick={() => handleSubItemClick(child.name)}
                            className={`flex items-center gap-2 w-full p-2 pl-8 rounded-lg transition-all duration-200 ${
                              activeSubItem === child.name
                                ? 'bg-[var(--brand-100)] text-[var(--brand-700)] font-medium'
                                : 'text-[var(--text-muted)] hover:bg-[var(--brand-50)] hover:text-[var(--brand-600)]'
                            }`}
                          >
                            <ChevronRight className="h-3 w-3" />
                            <span className="text-sm">{child.name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <button
                  onClick={() => handleItemClick(item.name)}
                  className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 ${
                    activeItem === item.name
                      ? 'bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-200)] font-medium'
                      : 'text-[var(--text-default)] hover:bg-[var(--brand-50)] hover:text-[var(--brand-600)]'
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      activeItem === item.name
                        ? 'text-[var(--brand-600)]'
                        : 'text-[var(--text-muted)]'
                    }`}
                  />
                  <span className="font-medium">{item.name}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[var(--sidebar-border)]">
        <button className="flex items-center gap-3 w-full p-3 rounded-lg text-[var(--text-default)] hover:bg-[var(--logout-hover-bg)] hover:text-[var(--logout-hover-text)] transition-all duration-200">
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
}
