import { createApiConfig } from "../config/Api-config";
import { DB } from "../../constant/constant";

const categoryApi = createApiConfig(DB.CATEGORY, "category");

export const useCreateCategory = categoryApi.useCreate;
export const useGetAllCategories = categoryApi.useGetAll;
export const useGetCategoryById = categoryApi.useGetById;
export const useUpdateCategory = categoryApi.useUpdate;
export const useDeleteByQuery = categoryApi.useDeleteWithQuery;
export const useDelete = categoryApi.useDelete;

export const useCategoriesForDropdown = (queryParams) => {
    return categoryApi.useGetAll(queryParams, {
        select: (data) =>
            data?.data?.categories.map((c) => ({
                id: c._id,
                name: c.name,
                icon: c.icon || null,
            })),
    });
};
