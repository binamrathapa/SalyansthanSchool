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
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
            <School className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Salyansthan School</h1>
            <p className="text-xs text-green-600 font-medium">Education Excellence</p>
          </div>
        </div>
      </div>

      {/* Navigation - Using global CSS class */}
      <nav className="flex-1 p-4 overflow-y-auto no-scrollbar">
        <ul className="space-y-1">
          {sidebarItems.map((item: SidebarItem, idx: number) => (
            <li key={item.name}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 justify-between ${
                      openAccordion === idx 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon 
                        className={`h-5 w-5 transition-colors ${
                          openAccordion === idx ? 'text-green-600' : 'text-gray-500'
                        }`} 
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-all duration-200 ${
                        openAccordion === idx 
                          ? 'rotate-180 text-green-600' 
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                  {openAccordion === idx && (
                    <ul className="mt-1 ml-4 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <button 
                            onClick={() => handleSubItemClick(child.name)}
                            className={`flex items-center gap-2 w-full p-2 pl-8 rounded-lg transition-all duration-200 ${
                              activeSubItem === child.name
                                ? 'bg-green-100 text-green-700 font-medium'
                                : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
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
                      ? 'bg-green-50 text-green-700 border border-green-200 font-medium'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  <item.icon 
                    className={`h-5 w-5 transition-colors ${
                      activeItem === item.name ? 'text-green-600' : 'text-gray-500'
                    }`} 
                  />
                  <span className="font-medium">{item.name}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Log Out */}
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center gap-3 w-full p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
}