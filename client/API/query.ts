import { useQuery } from "@tanstack/react-query";
import apiClient from "./request";

const getData = async (
  endpoint: string,
  params?: Record<string, any>
) => {
  const response = await apiClient.get(endpoint, { params });
  return response.data.data;
};

const useFetchData = (
  key: string,
  endpoint: string,
  params?: Record<string, any>
) => {
  return useQuery({
    queryKey: [key, endpoint, params],
    queryFn: () => getData(endpoint, params),
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export default useFetchData;
