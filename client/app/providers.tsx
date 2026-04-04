"use client";

import { ReactNode } from "react";
import { ReactQueryProvider } from "../server-action/providers/QueryClientProviders";
import { AuthProvider } from "../context/AuthProvider";
import { PermissionProvider } from "../context/PermissionContext";
import RouteGuard from "../components/RouteGuard";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <PermissionProvider>
          <RouteGuard>
            {children}
          </RouteGuard>
        </PermissionProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
