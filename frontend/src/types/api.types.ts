import { type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';

export type ApiServiceErr = {
  message: string;
  code?: string;
  response?: unknown;
};

export type MutOpt<Response, TVariables = unknown> = UseMutationOptions<
  Response,
  ApiServiceErr,
  TVariables
>;

export type QueryOpt<Response> = Omit<UseQueryOptions<
  Response,
  ApiServiceErr
>, 'queryKey' | 'queryFn'>;

export type QueryResponse = {
  explanation: string;
  citations: Citation[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  follow_up_questions?: string[];
};

export type Citation = {
  doc_id: string;
  chunk_id?: string;
  text_excerpt: string;
};

export type UploadResponse = {
  uploaded: string[];
};

export type Document = {
  filename: string;
};

export type MetricsResponse = {
  total_queries: number;
  average_processing_time: number;
  success_rate: number;
  citation_precision: number;
  retrieval_stats: {
    total_retrievals: number;
    average_retrieved_count: number;
  };
  // Add other metrics fields as needed based on your backend
};

export type AuditResponse = {
  run_id: string;
  query: string;
  processing_time: number;
  retrieval_performed: boolean;
  answer: QueryResponse;
  provenance_meta: {
    retrieval_decision: {
      retrieve: boolean;
      notes: string;
    };
    model_versions: Record<string, string>;
    status: string;
  };
  timestamp: string;
};