import { createApiConfig } from "../config/Api-config";
import {
    Teacher,
    CreateTeacherPayload,
    UpdateTeacherPayload
} from "@/app/dashboard/types/teacher";
import { DB } from "../../constant/constant";

const teacherApi = createApiConfig<
    Teacher,               
    CreateTeacherPayload,  
    UpdateTeacherPayload
>(DB.TEACHER, "Teacher");

// Create teacher
export const useCreateTeacher = teacherApi.useCreate;

// Update teacher (FormData PUT)
export const useUpdateTeacher = teacherApi.useUpdatePut;

// Patch teacher (FormData PATCH)
export const usePatchTeacher = teacherApi.useUpdate;

// Get all teachers
export const useGetAllTeachers = teacherApi.useGetAll;

// Get teacher by ID
export const useGetTeacherById = teacherApi.useGetById;

// Delete teacher
export const useDeleteTeacher = teacherApi.useDelete;

// Bulk delete teachers
export const useBulkDeleteTeachers = teacherApi.useBulkDelete;
