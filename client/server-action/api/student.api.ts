import { createApiConfig } from "../config/Api-config";
import {
    PatchStudentPayload,
    Student,
    StudentQueryParameters,
    StudentPaginatedResponse
} from "@/app/dashboard/types/student";
import { DB } from "../../constant/constant";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";

const studentApi = createApiConfig<
    Student,               
    FormData,  
    PatchStudentPayload
>(DB.STUDENT, "Student");


// Create student
export const useCreateStudent = studentApi.useCreate;

// Update student (FormData PUT)
export const useUpdateStudent = studentApi.useUpdatePut;

// Patch student (partial update)
export const usePatchStudent = studentApi.useUpdate;

// Get all students (Non-paginated)
export const useGetAllStudents = studentApi.useGetAll;

// Get all students (Paginated)
export const useGetAllStudentsPaginated = (params: StudentQueryParameters) => {
    return useQuery<StudentPaginatedResponse, Error>({
        queryKey: [DB.STUDENT, "paginated", params],
        queryFn: async () => {
            const response = await apiClient.get(`/${DB.STUDENT}`, { params });
            return response.data; 
        },
    });
};

// Get student by ID
export const useGetStudentById = studentApi.useGetById;

// Get student by ID with query params
export const useGetStudentByIdWithQueryParams = studentApi.useGetByIdWithQueryParams;

// Delete student
export const useDeleteStudent = studentApi.useDelete;