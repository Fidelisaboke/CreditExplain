import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './apiClient';
import { type QueryOpt, type MutOpt, type ApiServiceErr } from '@/types/api.types';

// Reusable factory function for CRUD operations
export const createApiHooks = <T extends { id?: string }, TCreate = T, TUpdate = Partial<T>>(
  endpoint: string
) => {
  const queryKey = [endpoint];

  // GET all items
  const useGetAll = (options?: QueryOpt<T[]>) =>
    useQuery<T[], ApiServiceErr>({
      queryKey,
      queryFn: async () => {
        const response = await apiClient.get(`/${endpoint}`);
        return response.data;
      },
      ...options,
    });

  // GET single item by ID
  const useGetById = (id: string, options?: QueryOpt<T>) =>
    useQuery<T, ApiServiceErr>({
      queryKey: [...queryKey, id],
      queryFn: async () => {
        const response = await apiClient.get(`/${endpoint}/${id}`);
        return response.data;
      },
      ...options,
    });

  // POST create new item
  const useCreate = (options?: MutOpt<T, TCreate>) => {
    const queryClient = useQueryClient();
    
    return useMutation<T, ApiServiceErr, TCreate>({
      mutationFn: async (data: TCreate) => {
        const response = await apiClient.post(`/${endpoint}`, data);
        return response.data;
      },
      ...options,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey });
        options?.onSuccess?.(data, variables, context);
      },
    });
  };

  // PUT update item
  const useUpdate = (options?: MutOpt<T, { id: string; data: TUpdate }>) => {
    const queryClient = useQueryClient();
    
    return useMutation<T, ApiServiceErr, { id: string; data: TUpdate }>({
      mutationFn: async ({ id, data }) => {
        const response = await apiClient.put(`/${endpoint}/${id}`, data);
        return response.data;
      },
      ...options,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey });
        options?.onSuccess?.(data, variables, context);
      },
    });
  };

  // DELETE item
  const useDelete = (options?: MutOpt<void, string>) => {
    const queryClient = useQueryClient();
    
    return useMutation<void, ApiServiceErr, string>({
      mutationFn: async (id: string) => {
        await apiClient.delete(`/${endpoint}/${id}`);
      },
      ...options,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey });
        options?.onSuccess?.(data, variables, context);
      },
    });
  };

  return {
    useGetAll,
    useGetById,
    useCreate,
    useUpdate,
    useDelete,
    queryKey,
  };
};