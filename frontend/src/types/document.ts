export interface DocumentMetadata {
    id: string;
    filename: string;
    sizeInKB: number;
    pageCount: number;
    uploadDate: string;
    status?: "uploaded" | "processing" | "processed" | "error";
}