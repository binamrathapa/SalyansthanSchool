import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";
import { DB } from "../../constant/constant";
import { GenerateMonthlyInvoicePayload, Invoice } from "@/app/dashboard/types/invoice";
import Swal from "sweetalert2";

export const useGenerateMonthlyInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation<Invoice, Error, GenerateMonthlyInvoicePayload>({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post(`/${DB.INVOICE}/generate-monthly`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DB.INVOICE] });
      Swal.fire({
        icon: "success",
        title: "Fees Assigned Successfully",
        timer: 2000,
      });
    },
    onError: (error: any) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "Failed to generate monthly invoice",
      });
    },
  });
};
