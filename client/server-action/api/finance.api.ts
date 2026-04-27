import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";
import { FinanceDashboardData } from "@/app/dashboard/types/finance";
import { DB } from "../../constant/constant";

export const useGetFinanceDashboard = (year?: number) => {
  return useQuery<FinanceDashboardData>({
    queryKey: [DB.FINANCE, "dashboard", year],
    queryFn: async () => {
      const response = await apiClient.get(`/${DB.FINANCE}/dashboard`, {
        params: { year },
      });
      return response.data.data;
    },
  });
};
