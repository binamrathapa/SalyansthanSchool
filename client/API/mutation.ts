import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiClient from "./request";

/**
 * Create or Update mutation
 */
const createOrUpdateMutation = (
  endpoint: string,
  method: "POST" | "PUT" | "PATCH" = "POST"
) => {
  return async (data: any) => {
    const response = await apiClient.request({
      url: endpoint,
      method,
      data,
    });
    return response.data.data;
  };
};

export const useMutationHandler = (
  endpoint: string,
  method: "POST" | "PUT" | "PATCH" = "POST",
  options?: any
) => {
  return useMutation({
    mutationFn: (data: any) =>
      createOrUpdateMutation(endpoint, method)(data),
    ...options,
  });
};

/**
 * Delete mutation
 */
const deleteMutation = (endpoint: string) => {
  return async (id: string | number) => {
    const response = await apiClient.delete(`${endpoint}/${id}`);
    return response.data.data;
  };
};

export const useDeleteHandler = (
  endpoint: string,
  queryKey: string,
  options?: any
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) =>
      deleteMutation(endpoint)(id),

    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success("Item deleted successfully!");
      options?.onSuccess?.(data, variables, context);
    },

    onError: (error: any, variables, context) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete the item!"
      );
      options?.onError?.(error, variables, context);
    },

    ...options,
  });
};
