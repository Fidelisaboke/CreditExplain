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

    // Card-style upload area with animated dashed border, icon, and focus ring
    return (
        <div
            className="relative flex flex-col items-center justify-center border-2 border-dashed border-accent rounded-xl p-8 bg-card shadow-md transition-all duration-300 focus-within:ring-2 focus-within:ring-primary animate-fade-in"
            tabIndex={0}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            aria-label="Drag and drop PDF files or select files"
        >
            {/* Animated upload icon for visual cue */}
            <svg
                className="w-12 h-12 mb-3 text-accent animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
            </svg>
            <p className="mb-2 text-muted-foreground text-lg">Drag and drop <span className="font-semibold text-accent">PDF</span> files here, or</p>
            {/* Accessible button for file selection */}
            <Button
                type="button"
                className="px-5 py-2 bg-primary text-primary-foreground rounded-lg shadow hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition"
                onClick={() => inputRef.current?.click()}
                aria-label="Select PDF files"
            >
                Select Files
            </Button>
            {/* Hidden file input for accessibility */}
            <Input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                multiple
                className="hidden"
                onChange={e => handleFiles(e.target.files)}
                aria-label="File input for PDF upload"
            />
            {/* Error message with fade-in animation */}
            {error && <p className="mt-2 text-destructive animate-fade-in" role="alert">{error}</p>}
        </div>
    );
};

export default FileUpload;
