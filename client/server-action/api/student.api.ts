import { createApiConfig } from "../config/Api-config";
import { Student } from "@/app/dashboard/types/student";
import { DB } from "../../constant/constant";

const studentApi = createApiConfig<Student>(DB.STUDENT, "Student");

export const useCreateStudent = studentApi.useCreate;
export const useGetAllStudents = studentApi.useGetAll; 
export const useGetStudentById = studentApi.useGetById;
export const useGetStudentByIdWithQueryParams = studentApi.useGetByIdWithQueryParams;
export const useUpdateStudent = studentApi.useUpdate;
export const useDeleteStudent = studentApi.useDelete;
