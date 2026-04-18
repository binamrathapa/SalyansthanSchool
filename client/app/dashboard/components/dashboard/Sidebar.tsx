"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  School,
  PanelLeft,
} from "lucide-react";
import { sidebarItems, SidebarItem } from "@/app/dashboard/config/sideItems";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  // Auto-expand the accordion that contains the active route
  useEffect(() => {
    const activeItemIdx = sidebarItems.findIndex((item) => {
      if (item.path && pathname === item.path) return true;
      if (item.children) {
        return item.children.some((child) => pathname === child.path);
      }
      return false;
    });

    if (activeItemIdx !== -1 && sidebarItems[activeItemIdx].children) {
      setOpenAccordion(activeItemIdx);
    }
  }, [pathname]);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  // Strict active check for selected state
  const isSelected = (path?: string) => path && pathname === path;

  // Logical check for parent active state (if any child is active)
  const isSubrouteActive = (item: SidebarItem) => {
    return item.children?.some(child => pathname === child.path);
  };


  return (
    <div
      className={`h-screen bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] flex flex-col transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"
        }`}
    >
      {/* Header */}
      <div className="relative p-6 border-b border-[var(--brand-200)] bg-[var(--brand-50)]">
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="absolute -right-3 top-6 bg-white border rounded-full p-1 shadow"
        >
          <PanelLeft className="h-4 w-4" />
        </button>

        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"
            }`}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
            style={{
              background:
                "linear-gradient(to bottom right, var(--brand-600), var(--brand-700))",
            }}
          >
            <School className="h-6 w-6 text-white" />
          </div>

          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-[var(--text-default)] leading-none">
                Salyansthan School
              </h1>
              <p className="text-xs font-medium text-[var(--brand-600)]">
                Education Excellence
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto no-scrollbar">
        <ul className="space-y-1">
          {sidebarItems.map((item: SidebarItem, idx: number) => (
            <li key={item.name}>
              {item.children ? (
                <>
                  <button
                    onClick={() => !isCollapsed && toggleAccordion(idx)}
                    className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${isSubrouteActive(item)
                      ? "text-[var(--brand-700)] font-semibold"
                      : "text-[var(--text-default)] hover:bg-[var(--brand-50)] hover:text-[var(--brand-600)]"
                      } ${openAccordion === idx && !isSubrouteActive(item)
                        ? "bg-gray-50/50"
                        : ""
                      } ${isCollapsed ? "justify-center" : "justify-between"}`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={`h-5 w-5 ${isSubrouteActive(item) || openAccordion === idx
                          ? "text-[var(--brand-600)]"
                          : "text-[var(--text-muted)]"
                          }`}
                      />

                      {!isCollapsed && (
                        <span className="font-medium">{item.name}</span>
                      )}
                    </div>

                    {!isCollapsed && (
                      <ChevronDown
                        className={`h-4 w-4 transition-all duration-200 ${openAccordion === idx
                          ? "rotate-180 text-[var(--brand-600)]"
                          : "text-[var(--text-muted)]"
                          }`}
                      />
                    )}
                  </button>

                  {!isCollapsed && openAccordion === idx && (
                    <ul className="mt-1 ml-4 space-y-1 bg-[var(--brand-50)] rounded-sm">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <Link
                            href={child.path}
                            className={`flex items-center gap-2 w-full p-2 pl-8 rounded-lg transition-all duration-200 ${isSelected(child.path)
                              ? "bg-[var(--brand-200)] text-[var(--brand-700)] font-semibold"
                              : "text-[var(--text-muted)] hover:bg-[var(--brand-100)] hover:text-[var(--brand-600)]"
                              }`}
                          >
                            <span className="text-sm">{child.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  href={item.path || "#"}
                  className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${isSelected(item.path)
                    ? "bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-200)] shadow-sm"
                    : "text-[var(--text-default)] hover:bg-[var(--brand-50)] hover:text-[var(--brand-600)]"
                    } ${isCollapsed ? "justify-center" : "gap-3"}`}
                >
                  <item.icon
                    className={`h-5 w-5 ${isSelected(item.path)
                      ? "text-[var(--brand-600)]"
                      : "text-[var(--text-muted)]"
                      }`}
                  />

                  {!isCollapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-8 border-t border-[var(--sidebar-border) bg-[var(--brand-50)] ]">
        {/* <button
        onClick={handleLogout}
        className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 hover:bg-[var(--logout-hover-bg)] hover:text-[var(--logout-hover-text)] ${isCollapsed ? "justify-center" : "gap-3"
          }`}
      >
        <LogOut className="h-5 w-5" />
        {!isCollapsed && <span className="font-medium">Log Out</span>}
      </button> */}
      </div>
    </div>
  );
}
