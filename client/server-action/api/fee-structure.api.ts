import { createApiConfig } from "../config/Api-config";
import { DB } from "../../constant/constant";
import {
  FeeStructure,
  FeeStructurePayload,
  UpdateFeeStructurePayload,
} from "@/app/dashboard/types/fee-structure";

const feeStructureApi = createApiConfig<
  FeeStructure,
  FeeStructurePayload,
  UpdateFeeStructurePayload
>(
  DB.FEE_STRUCTURE,
  "Fee Structure",
  [DB.GRADE, DB.FEE_HEAD] // These get refreshed when a structure changes 
);

export const useCreateFeeStructure = feeStructureApi.useCreate;
export const useGetAllFeeStructures = feeStructureApi.useGetAll;
export const useGetFeeStructureById = feeStructureApi.useGetById;
export const useUpdateFeeStructure = feeStructureApi.useFullUpdate;
export const useDeleteFeeStructure = feeStructureApi.useDelete;
export const useBulkDeleteFeeStructure = feeStructureApi.useBulkDelete;