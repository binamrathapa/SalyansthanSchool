import { DB } from "../../constant/constant";
import { createApiConfig } from "../config/Api-config";

const userApi = createApiConfig(DB.USER, "user", ["user", "user-history"]);

// Export the hooks with the specific names you want
// export const useGetUser = userApi.useGetAll;
export const useGetUserById = userApi.useGetById;
export const useUpdateUser = userApi.useUpdate;
export const useDeleteUser = userApi.useDeleteByQuery;
export const useDeleteUserWithQuery = userApi.useDeleteWithQuery;

const changepassword = createApiConfig("change-password", "change-password");
export const useChangePassword = changepassword.useCreate;

// export const useGetDoctorPatients = doctorPatientApi.useGetAll;
