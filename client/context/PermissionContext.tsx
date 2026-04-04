import { createContext, ReactNode, useContext } from "react";
import {useAuth} from "./AuthProvider";

interface PermissionContextType {
  role: string | null;
  canAccess: (required: string[]) => boolean;
}

const PermissionContext = createContext<PermissionContextType>({
  role: null,
  canAccess: () => false,
});

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const role = user?.role ?? null;

  const canAccess = (required: string[]) => {
    if (!role) return false;
    return required.includes(role);
  };

  return (
    <PermissionContext.Provider value={{ role, canAccess }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermission must be used within PermissionProvider");
  }
  return context;
};