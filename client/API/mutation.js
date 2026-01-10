import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import apiClient from './request';

const createOrUpdateMutation = (endpoint, method = 'POST') => {
  return async (data) => {
    const response = await apiClient.request({
      url: endpoint,
      method,
      data,
    });
    return response.data.data;
  };
};

export const useMutationHandler = (endpoint, method = 'POST', options) => {
  return useMutation({
    mutationFn: (data) => createOrUpdateMutation(endpoint, method)(data),
    ...options,
  });
};

const deleteMutation = (endpoint) => {
  return async (id) => {
    const response = await apiClient.delete(`${endpoint}/${id}`);
    return response.data.data;
  };
};

export const useDeleteHandler = (endpoint, queryKey, options) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteMutation(endpoint)(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success('Item deleted successfully!');
      if (options?.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error?.response?.data?.message || 'Failed to delete the item!');
      if (options?.onError) options.onError(error, variables, context);
    },
    ...options,
  });
};