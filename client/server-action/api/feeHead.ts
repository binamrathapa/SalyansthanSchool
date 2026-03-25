import { createApiConfig } from "../config/Api-config";
import { DB } from "../../constant/constant";
import {
  FeeHead,
  FeeHeadPayload,
  UpdateFeeHeadPayload,
} from "@/app/dashboard/types/account";

const feeHeadApi = createApiConfig<
  FeeHead,
  FeeHeadPayload,
  UpdateFeeHeadPayload
>(
  DB.FEE_HEAD,
  "Fee Head",
  [DB.FEE_CATEGORY] // optional: invalidate categories if needed
);

export const useCreateFeeHead = feeHeadApi.useCreate;
export const useGetAllFeeHeads = feeHeadApi.useGetAll;
export const useGetFeeHeadById = feeHeadApi.useGetById;
export const useUpdateFeeHead = feeHeadApi.useFullUpdate;
export const useDeleteFeeHead = feeHeadApi.useDelete;
export const useBulkDeleteFeeHead = feeHeadApi.useBulkDelete;