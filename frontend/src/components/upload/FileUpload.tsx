/**
 * FileUpload component allows users to select or drag-and-drop PDF files.
 * It validates file types and passes valid files to the parent via onFiles callback.
 */

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FileUploadProps {
    onFiles: (files: File[]) => void;
    error: string | null;
    setError: (msg: string | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFiles, error, setError }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Handle file selection or drop
    const handleFiles = (fileList: FileList | null) => {
        if (!fileList) return;
        const files = Array.from(fileList);
        const pdfFiles = files.filter(f => f.type === "application/pdf");
        if (pdfFiles.length !== files.length) {
            setError("Only PDF files are allowed.");
            return;
        }
        setError(null);
        onFiles(pdfFiles);
    };

    // Drag-and-drop handlers
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <div className="border-2 border-dashed rounded-lg p-6 text-center bg-white shadow-sm" onDrop={handleDrop} onDragOver={handleDragOver}>
            <p className="mb-2 text-gray-700">Drag and drop PDF files here, or</p>
            <Button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => inputRef.current?.click()}
            >
                Select Files
            </Button>
            <Input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                multiple
                className="hidden"
                onChange={e => handleFiles(e.target.files)}
            />
            {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
    );
};

export default FileUpload;
