interface Citation {
  docName: string;
  clause: string;
  snippet: string;
}

interface RAGResponse {
  explanation: string;
  confidence: number;
  citations: Citation[];
  selector: string;
  followups: string[];
}

// Mock RAG pipeline outputs
const mockResponse: RAGResponse = {
  explanation: "Based on your credit inquiry, the policy clause 4.2 applies. Your credit was denied due to insufficient income documentation. This is a standard requirement across all financial institutions to ensure compliance with lending regulations.",
  confidence: 92,
  citations: [
    {
      docName: "sample-policy.pdf",
      clause: "4.2",
      snippet: "Credit will be denied if income documentation is not provided as per clause 4.2."
    },
    {
      docName: "audit-report.pdf",
      clause: "2.1",
      snippet: "Audit findings indicate missing income records for applicant."
    }
  ],
  selector: "Relevant clauses selected: 4.2, 2.1",
  followups: [
    "What documents are accepted for income verification?",
    "How can I appeal a credit denial?",
    "Show me the full policy clause 4.2."
  ]
};

export { type Citation, type RAGResponse, mockResponse };