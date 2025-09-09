import { type DocumentMetadata } from "@/types/document";

export const mockMetadata: DocumentMetadata[] = [
  {
    id: "1",
    filename: "sample-policy.pdf",
    sizeInKB: 240,
    pageCount: 12,
    uploadDate: new Date().toISOString(),
    status: "uploaded"
  },
  {
    id: "2",
    filename: "audit-report.pdf",
    sizeInKB: 512,
    pageCount: 34,
    uploadDate: new Date().toISOString(),
    status: "processed"
  }
];
