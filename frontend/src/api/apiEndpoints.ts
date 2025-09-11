// Backend API endpoints
const API_ENDPOINTS = {
    METRICS: "/metrics",
    UPLOAD: "/upload",
    DOCUMENTS: "/documents",
    DOCUMENT_METADATA: (filename: string) => `/documents/${filename}`,
    PII_STATS: "/pii-stats",
    QUERY: "/query",
    AUDIT: (runId: string) => `/audit/${runId}`,
}

export default API_ENDPOINTS;
