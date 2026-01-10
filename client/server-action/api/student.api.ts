import { createApiConfig } from "../config/Api-config";
import { DB } from "../../constant/constant";

const studentApi = createApiConfig(DB.STUDENT, "Student");

export const useCreateStudent = studentApi.useCreate;
export const useGetAllStudents = studentApi.useGetAll;
export const useGetStudentById = studentApi.useGetById;
export const useGetStudentByIdWithQueryParams = studentApi.useGetByIdWithQueryParams;
// export const useDeleteStudentByQuery = studentApi.useDeleteWithQuery;
export const useUpdateStudent = studentApi.useUpdate;
export const useDeleteStudent = studentApi.useDelete;