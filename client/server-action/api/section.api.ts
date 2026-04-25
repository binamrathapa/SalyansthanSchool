import { createApiConfig } from "../config/Api-config";
import {
    Section
} from "@/app/dashboard/types/grade";
import { DB } from "../../constant/constant";

const sectionApi = createApiConfig<Section>(DB.SECTION, "Section");

export const useGetAllSections = sectionApi.useGetAll;
export const useCreateSection = sectionApi.useCreate;
export const useUpdateSection = sectionApi.useUpdate;
export const useDeleteSection = sectionApi.useDelete;
export const useFullUpdateSection = sectionApi.useFullUpdate;