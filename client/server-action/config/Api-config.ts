import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryObserverOptions,
} from "@tanstack/react-query";
import Swal from "sweetalert2";
import { apiClient } from "../utils/ApiGateway";
import { PostErrorConfig } from "../error-config/ErrorConfig";

/* =======================
   Types
======================= */
type QueryParams = Record<string, any>;

type WithId = {
  id: number;
};

/* =======================
   API Factory
======================= */
export function createApiConfig<
  TEntity,
  TCreate = TEntity,
  TUpdate extends WithId = Partial<TEntity> & WithId
>(
  entityName: string,
  entityNameFormatted: string,
  additionalQueriesToInvalidate: string[] = []
) {
  /* =======================
     Helper: Invalidate Queries
  ======================== */
  const invalidateQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
    queryClient.invalidateQueries({ queryKey: [entityName] });

    additionalQueriesToInvalidate.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  };

  /* =======================
     GET ALL
  ======================== */
  const useGetAll = (queryParams?: QueryParams, options?: any) => {
    const stableKey = queryParams ? JSON.stringify(queryParams) : "all";

    return useQuery({
      queryKey: [entityName, stableKey],
      queryFn: async () => {
        const response = await apiClient.get(`/${entityName}`, { params: queryParams });
        return response.data.data; // critical: Axios response structure
      },
      ...options,
    });
  };

  /* =======================
     GET BY ID
  ======================== */
  const useGetById = (id: number) => {
    return useQuery({
      queryKey: [entityName, id],
      queryFn: async () => {
        const response = await apiClient.get(`/${entityName}/${id}`);
        return response.data.data;
      },
      enabled: Boolean(id),
    });
  };

  /* =======================
     GET BY ID WITH QUERY PARAMS
  ======================== */
  const useGetByIdWithQueryParams = (
    id: number,
    queryParams?: QueryParams,
    options?: QueryObserverOptions<TEntity, Error>
  ) => {
    const stableKey = queryParams ? JSON.stringify(queryParams) : "single";

    return useQuery<TEntity, Error>({
      queryKey: [entityName, id, stableKey],
      queryFn: async () => {
        const { data } = await apiClient.get<TEntity>(`/${entityName}/${id}`, {
          params: queryParams,
        });
        return data;
      },
      enabled: Boolean(id),
      ...options,
    });
  };

  /* =======================
     CREATE
  ======================== */
  const useCreate = () => {
    const queryClient = useQueryClient();

    return useMutation<TEntity, Error, TCreate>({
      mutationFn: async (payload) => {
        const { data } = await apiClient.post<TEntity>(`/${entityName}`,
          payload);
        return data;
      },
      onSuccess: () => {
        invalidateQueries(queryClient);
        Swal.fire({
          icon: "success",
          title: `${entityNameFormatted} Created Successfully`,
          timer: 2000,
        });
      },
      onError: (error) => {
        const message = PostErrorConfig({
          error,
          entryNameFormatted: entityNameFormatted,
        });

        Swal.fire({
          icon: "error",
          title: "Error",
          text: message,
        });
      },
      retry: false,
    });
  };

  /* =======================
     PATCH UPDATE
  ======================== */
  const useUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation<TEntity, Error, { id: number; data: FormData }>(
      {
        mutationFn: async ({ id, data }) => {
          const { data: response } = await apiClient.patch<TEntity>(
            `/${entityName}/${id}`,
            data
          );
          return response;
        },
        onSuccess: () => {
          invalidateQueries(queryClient);
          Swal.fire({
            icon: "success",
            title: `${entityNameFormatted} Updated Successfully`,
            timer: 2000,
          });
        },
        onError: () => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: `Failed to update ${entityNameFormatted}`,
          });
        },
        retry: false,
      }
    );
  };


  /* =======================
     FULL UPDATE (PUT)
  ======================== */
  const useFullUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation<TEntity, Error, TUpdate>({
      mutationFn: async ({ id, ...payload }) => {
        const { data } = await apiClient.put<TEntity>(`/${entityName}/${id}`, payload);
        return data;
      },
      onSuccess: () => {
        invalidateQueries(queryClient);
        Swal.fire({
          icon: "success",
          title: `${entityNameFormatted} Updated Successfully`,
          timer: 2000,
        });
      },
      onError: () => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Failed to full update ${entityNameFormatted}`,
        });
      },
      retry: false,
    });
  };

  /* =======================
     DELETE
  ======================== */
  const useDelete = () => {
    const queryClient = useQueryClient();

    return useMutation<TEntity, Error, number>({
      mutationFn: async (id) => {
        const { data } = await apiClient.delete<TEntity>(`/${entityName}/${id}`);
        return data;
      },
      onSuccess: () => {
        invalidateQueries(queryClient);
        Swal.fire({
          icon: "success",
          title: `${entityNameFormatted} Deleted Successfully`,
          timer: 2000,
        });
      },
      onError: () => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Failed to delete ${entityNameFormatted}`,
        });
      },
    });
  };

  /* =======================
     BULK DELETE
  ======================== */
  const useBulkDelete = () => {
    const queryClient = useQueryClient();

    return useMutation<TEntity, Error, { ids: number[] }>({
      mutationFn: async (payload) => {
        const { data } = await apiClient.post<TEntity>(`/${entityName}/bulk-delete`, payload);
        return data;
      },
      onSuccess: () => {
        invalidateQueries(queryClient);
        Swal.fire({
          icon: "success",
          title: `${entityNameFormatted} Deleted Successfully`,
          timer: 2000,
        });
      },
      onError: () => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Failed to bulk delete ${entityNameFormatted}`,
        });
      },
    });
  };

  /* =======================
     EXPORT HOOKS
  ======================== */
  return {
    useGetAll,
    useGetById,
    useGetByIdWithQueryParams,
    useCreate,
    useUpdate,
    useFullUpdate,
    useDelete,
    useBulkDelete,
  };
}
