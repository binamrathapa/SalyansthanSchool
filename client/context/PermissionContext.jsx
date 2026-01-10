import React, { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";
import { useGetPermissionByUserId } from "../server-action/api/permission.api";

const PermissionContext = createContext(undefined);

const PermissionProvider = ({ children }) => {
    const { data } = useAuth();
    const {
        data: permissions,
        isLoading,
        error,
        refetch,
    } = useGetPermissionByUserId(data?.user?.id);

    const permission = permissions?.[0];

    return (
        <PermissionContext.Provider value={{ permissions: permission, isLoading, error, refetch }}>
            {children}
        </PermissionContext.Provider>
    );
};

PermissionProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PermissionProvider;


export const usePermissionContext = () => {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error("usePermissionContext must be used within a PermissionProvider");
    }
    return context;
};

