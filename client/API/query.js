import { useQuery } from '@tanstack/react-query';
import apiClient from './request';

interface ApiResponse<T>{
  data: T;
}

const getData = async <T>(
  endpoint: string, 
  params?: Record<string, any>
):Promise<T> => {
  const response = await apiClient.get<ApiResponse<T>>(endpoint, { params });
  return response.data.data;
};

const useFetchData = (key, endpoint, params) => {
  return useQuery({
    queryKey: [key, endpoint, params],
    queryFn: () => getData(endpoint, params),
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export default useFetchData; 