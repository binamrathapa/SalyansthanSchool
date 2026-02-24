import { createApiConfig } from "../config/Api-config";
import { DB } from "../../constant/constant";
import {
  AcademicYear,
  AcademicYearPayload,
  UpdateAcademicYearPayload,
} from "@/app/dashboard/types/academic-year";

/**
 * Academic Year API configuration
 * Handles: GET (All/Single), POST (Create), PUT (Update), PATCH (Partial), DELETE
 */
const academicYearApi = createApiConfig<
  AcademicYear,
  AcademicYearPayload,
  UpdateAcademicYearPayload
>(
  DB.ACADEMIC_YEAR, // "AcademicYear" from constants
  "Academic Year"
);

// Standard CRUD Hooks
export const useCreateAcademicYear = academicYearApi.useCreate;
export const useGetAllAcademicYears = academicYearApi.useGetAll;
export const useGetAcademicYearById = academicYearApi.useGetById;
export const useUpdateAcademicYear = academicYearApi.useFullUpdate;    
export const useDeleteAcademicYear = academicYearApi.useDelete;
export const useBulkDeleteAcademicYear = academicYearApi.useBulkDelete;