"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthProvider";
import { usePermission } from "../context/PermissionContext";
import GlobalLoader from "@/app/dashboard/components/dashboard/common/GlobalLoader";

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles?: string[]; // optional: admin-only, teacher-only, etc.
}

// Public routes that don’t require login
const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password", "/"];

export default function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, loading } = useAuth(); 
  const { canAccess } = usePermission(); 
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;
    const isAuthenticated = !!token;
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname || "/");

    console.log("token", token);

    // Not logged in and trying to access private page → redirect to login
    if (!isAuthenticated && !isPublicRoute) {
      setAuthorized(false);
      router.push("/login");
      return;
    }

    //Logged in and trying to access login page → redirect to dashboard
    if (isAuthenticated && pathname === "/login") {
      setAuthorized(false);
      router.push("/dashboard");
      return;
    }

    // Role-based access (for admin-only for now)
    if (isAuthenticated && allowedRoles && !canAccess(allowedRoles)) {
      setAuthorized(false);
      router.push("/unauthorized"); 
      return;
    }

    // Everything fine → allow access
    setAuthorized(true);
  }, [token, pathname, allowedRoles, canAccess, router,loading]);

  // Loading state while checking auth
  if (!authorized) {
   return <GlobalLoader />;
  }

  // Render the children if authorized
  return <>{children}</>;
}