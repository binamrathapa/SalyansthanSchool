import { createApiConfig } from "../config/Api-config";
import {
    PatchStudentPayload,
    Student,
} from "@/app/dashboard/types/student";
import { DB } from "../../constant/constant";

const studentApi = createApiConfig<
    Student,               
    FormData,  
    PatchStudentPayload
>(DB.STUDENT, "Student");


// Create student
export const useCreateStudent = studentApi.useCreate;

// Update student (full update)
export const useUpdateStudent = studentApi.useFullUpdate;

// Patch student (partial update)
export const usePatchStudent = studentApi.useUpdate;

// Get all students
export const useGetAllStudents = studentApi.useGetAll;

// Get student by ID
export const useGetStudentById = studentApi.useGetById;

// Get student by ID with query params
export const useGetStudentByIdWithQueryParams = studentApi.useGetByIdWithQueryParams;

// Delete student
export const useDeleteStudent = studentApi.useDelete;