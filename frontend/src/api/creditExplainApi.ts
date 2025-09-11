import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from './apiClient';
import { 
    type QueryResponse, 
    type UploadResponse, 
    type Document, 
    type QueryOpt, 
    type MutOpt, 
    type ApiServiceErr,
    type MetricsResponse,
    type AuditResponse
} from '@/types/api.types';
import API_ENDPOINTS from './apiEndpoints';

// Query endpoint
export const useQueryExplanation = (query: string, caseId?: string, options?: QueryOpt<QueryResponse>) =>
  useQuery<QueryResponse, ApiServiceErr>({
    queryKey: ['query', query, caseId],
    queryFn: async () => {
      const response = await apiClient.post(API_ENDPOINTS.QUERY, { query, case_id: caseId });
      return response.data;
    },
    enabled: !!query,
    ...options,
  });

  // Mutation for sending queries
export const useSendQuery = (options?: MutOpt<QueryResponse, { query: string; caseId?: string }>) =>
  useMutation<QueryResponse, ApiServiceErr, { query: string; caseId?: string }>({
    mutationFn: async ({ query, caseId }) => {
      const response = await apiClient.post(API_ENDPOINTS.QUERY, { query, case_id: caseId });
      return response.data;
    },
    ...options,
  });

// Upload documents
export const useUploadDocuments = (options?: MutOpt<UploadResponse, File[]>) =>
  useMutation<UploadResponse, ApiServiceErr, File[]>({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      
      const response = await apiClient.post(API_ENDPOINTS.UPLOAD, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    ...options,
  });

// Get documents list
export const useGetDocuments = (options?: QueryOpt<Document[]>) =>
  useQuery<Document[], ApiServiceErr>({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.DOCUMENTS);
      return response.data.documents || [];
    },
    ...options,
  });

// Get metrics
export const useGetMetrics = (options?: QueryOpt<MetricsResponse>) =>
  useQuery<MetricsResponse, ApiServiceErr>({
    queryKey: ['metrics'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.METRICS);
      return response.data;
    },
    ...options,
  });

// Get audit log
export const useGetAudit = (runId: string, options?: QueryOpt<AuditResponse>) =>
  useQuery<AuditResponse, ApiServiceErr>({
    queryKey: ['audit', runId],
    queryFn: async () => {
      const response = await apiClient.get(`/audit/${runId}`);
      return response.data;
    },
    enabled: !!runId,
    ...options,
  });