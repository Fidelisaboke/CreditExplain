import React, { useState } from "react";
import FileUpload from "@/components/upload/FileUpload";
import MetadataTable from "@/components/upload/MetadataTable";
import type { DocumentMetadata } from "@/types/document";
import { mockMetadata } from "@/data/documents";

/**
 * Upload page allows users to upload PDF files and view their metadata.
 * Metadata is mocked for demonstration purposes.
 */
const mockedDocuments: DocumentMetadata[] = mockMetadata;

function generateMockMetadata(files: File[]): DocumentMetadata[] {
  // Simulate extracting metadata from PDF files
  return files.map((file, idx) => ({
    id: `${Date.now()}-${idx}`,
    filename: file.name,
    sizeInKB: Math.round(file.size / 1024),
    pageCount: Math.floor(Math.random() * 20) + 1, // random page count
    uploadDate: new Date().toISOString(),
    status: "uploaded",
  }));
}

const Upload: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentMetadata[]>(mockedDocuments);
  const [error, setError] = useState<string | null>(null);

  // Handle new file uploads
  const handleFiles = (files: File[]) => {
    const newDocs = generateMockMetadata(files);
    setDocuments(prev => [...prev, ...newDocs]);
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Upload PDF Documents</h1>
      <FileUpload onFiles={handleFiles} error={error} setError={setError} />
      <MetadataTable documents={documents} />
    </div>
  );
};

export default Upload;
