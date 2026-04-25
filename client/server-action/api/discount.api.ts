import { createApiConfig } from "../config/Api-config";
import { DB } from "../../constant/constant";
import {
  StudentDiscount,
  StudentDiscountPayload,
  UpdateStudentDiscountPayload,
} from "@/app/dashboard/types/discount";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";

const discountApi = createApiConfig<
  StudentDiscount,
  StudentDiscountPayload,
  UpdateStudentDiscountPayload
>(
  DB.STUDENT_DISCOUNT,
  "Student Discount",
  [DB.STUDENT, DB.FEE_HEAD, DB.ACADEMIC_YEAR]
);

export const useGetAllDiscounts = discountApi.useGetAll;
export const useGetDiscountById = discountApi.useGetById;
export const useCreateDiscount = discountApi.useCreate;
export const useUpdateDiscount = discountApi.useFullUpdate;
export const useDeleteDiscount = discountApi.useDelete;

// Custom hook for toggle status since it's a PATCH to a specific endpoint
export const useToggleDiscountStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.patch(`/StudentDiscount/${id}/toggle-status`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DB.STUDENT_DISCOUNT] });
    },
  });
};
