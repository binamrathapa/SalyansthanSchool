import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";
import { DB } from "../../constant/constant";
import { DashboardData } from "@/app/dashboard/types/dashboard";

export const useGetDashboardData = () => {
  return useQuery<DashboardData, Error>({
    queryKey: [DB.DASHBOARD],
    queryFn: async () => {
      const response = await apiClient.get(`/${DB.DASHBOARD}`);
      return response.data;
    },
  });
};
