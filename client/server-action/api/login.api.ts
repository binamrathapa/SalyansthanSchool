import { DB } from "../../constant/constant";
import { createApiConfig } from "../config/Api-config";

const loginApi = createApiConfig(DB.LOGIN, "login");
export const useLogin = loginApi.useCreate;

// export const useGetPermissionByUserId = permissionApi.useGetAll;
// export const useUpdatePermission = permissionApi.useUpdate;
// export const useCreatePermission = permissionApi.useCreate;
// export const userGetPermissionById = permissionApi.useGetById;
