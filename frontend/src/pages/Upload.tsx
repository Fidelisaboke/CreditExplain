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
        <div className="m-4 min-h-screen flex items-center justify-center bg-background px-2">
            <div
                className="w-full max-w-2xl rounded-xl shadow-lg bg-card p-8 transition-all duration-500 animate-fade-in"
                aria-label="Upload PDF Documents"
            >
                {/* Page Title */}
                <h1 className="font-serif text-3xl font-bold mb-6 text-center text-primary">
                    Upload PDF Documents
                </h1>

                {/* File Upload Area */}
                <FileUpload onFiles={handleFiles} error={error} setError={setError} />

                {/* Metadata Table with fade-in animation */}
                <div className="mt-8">
                    <MetadataTable documents={documents} />
                </div>

            </div>
        </div>
    );
};

export default Upload;
