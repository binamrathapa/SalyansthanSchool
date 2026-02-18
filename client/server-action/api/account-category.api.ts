import { createApiConfig } from "../config/Api-config";
import { DB } from "../../constant/constant";
import {
  FeeCategory,
  FeeCategoryPayload,
  UpdateFeeCategoryPayload,
} from "@/app/dashboard/types/account";

const feeCategoryApi = createApiConfig<
  FeeCategory,                 // TEntity (GET response)
  FeeCategoryPayload,          // POST payload
  UpdateFeeCategoryPayload     // PUT payload (must include id)
>(
  DB.FEE_CATEGORY,
  "Fee Category"
);

console.log("fee", feeCategoryApi)

export const useCreateFeeCategory = feeCategoryApi.useCreate;
export const useGetAllFeeCategories = feeCategoryApi.useGetAll;
export const useGetFeeCategoryById = feeCategoryApi.useGetById;
export const useUpdateFeeCategory = feeCategoryApi.useFullUpdate;
export const useDeleteFeeCategory = feeCategoryApi.useDelete;
export const useBulkDeleteFeeCategory = feeCategoryApi.useBulkDelete;