import { createApiConfig } from "../config/Api-config";
import { Grade } from "@/app/dashboard/types/grade";
import { DB } from "../../constant/constant";

const gradeApi = createApiConfig<Grade>(DB.GRADE, "Grade"); 

export const useGetAllGrades = gradeApi.useGetAll;
export const useCreateGrade = gradeApi.useCreate;
export const useUpdateGrade = gradeApi.useUpdate;
export const useDeleteGrade = gradeApi.useDelete;
