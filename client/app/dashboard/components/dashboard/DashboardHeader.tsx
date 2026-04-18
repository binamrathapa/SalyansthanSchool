'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, ChangePasswordType } from "@/lib/validation/login.schema";
import { Menu, Bell, User, LogOut, Key, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { useChangePassword, useLogout } from "@/server-action/api/auth";
import { useState } from "react";

import Swal from "sweetalert2";



interface DashboardHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  pageTitle?: string;
  pageDescription?: string;
}


function ChangePasswordDialog({ onSuccess }: { onSuccess: () => void }) {
  const { mutateAsync: changePassword, isPending } = useChangePassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordType>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordType) => {
    try {
      await changePassword(data);
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="space-y-1">
        <Input
          type="password"
          placeholder="Current Password"
          {...register("currentPassword")}
          className={errors.currentPassword ? "border-red-500" : "focus:ring-green-500"}
        />
        {errors.currentPassword && (
          <p className="text-xs text-red-500">{errors.currentPassword.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Input
          type="password"
          placeholder="New Password"
          {...register("newPassword")}
          className={errors.newPassword ? "border-red-500" : ""}
        />
        {errors.newPassword && (
          <p className="text-xs text-red-500">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword")}
          className={errors.confirmPassword ? "border-red-500" : ""}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isPending}>
        {isPending ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
}

export default function DashboardHeader({
  isSidebarOpen,
  setIsSidebarOpen,
  pageTitle = "Dashboard",
  pageDescription = "Welcome to Salyansthan School Management"
}: DashboardHeaderProps) {
  const { user } = useAuth();
  const { logout } = useLogout();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const userName = (user as any)?.name;
  const userRole = user?.role;

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!"
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  }
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

          {/* User Profile Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer p-1 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium capitalize" style={{ color: 'var(--text-default)' }}>
                    {userName || "User"}
                  </p>
                  <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>
                    {userRole?.toLowerCase().replace('_', ' ') || "Role"}
                  </p>
                </div>

                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, var(--brand-600), var(--brand-700))`,
                  }}
                >
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
            </PopoverTrigger>

            <PopoverContent className="w-64 p-2 shadow-xl border-gray-100" align="end">
              <div className="p-3 border-b border-gray-50 mb-1">
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole?.toLowerCase().replace('_', ' ')}</p>
              </div>

              <div className="space-y-1">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 rounded-md transition-colors group">
                      <Key className="w-4 h-4 text-gray-400 group-hover:text-brand-500" />
                      <span>Change Password</span>
                    </button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Update Password</DialogTitle>
                    </DialogHeader>
                    <ChangePasswordDialog onSuccess={() => setIsDialogOpen(false)} />
                  </DialogContent>
                </Dialog>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors group"
                >
                  <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-500" />
                  <span>Logout</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

      </div>
    </header>
  );
}
