/**
 * FileUpload component allows users to select or drag-and-drop PDF files.
 * It validates file types and passes valid files to the parent via onFiles callback.
 * Enhanced with Lucide icons and improved styling.
 */

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Shield, AlertCircle } from "lucide-react";

interface FileUploadProps {
    onFiles: (files: File[]) => void;
    error: string | null;
    setError: (msg: string | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFiles, error, setError }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Handle file selection or drop
    const handleFiles = (fileList: FileList | null) => {
        if (!fileList) return;
        const files = Array.from(fileList);
        const pdfFiles = files.filter(f => f.type === "application/pdf");
        
        if (pdfFiles.length !== files.length) {
            setError("Only PDF files are allowed.");
            return;
        }
        
        if (pdfFiles.length === 0) {
            setError("Please select at least one PDF file.");
            return;
        }
        
        setError(null);
        onFiles(pdfFiles);
    };

    // Drag-and-drop handlers
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    return (
        <div className="w-full">
            {/* Upload card with enhanced styling */}
            <div
                className={`relative flex flex-col items-center justify-center rounded-xl p-8 bg-white dark:bg-slate-950 border-2 border-dashed transition-all duration-300 ${
                    isDragging 
                        ? "border-blue-500 bg-blue-50" 
                        : error 
                            ? "border-destructive/50 bg-destructive/10" 
                            : "border-gray-300 hover:border-blue-400"
                } shadow-sm hover:shadow-md`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                aria-label="Drag and drop PDF files or select files"
            >
                {/* Upload icon with conditional styling */}
                <div className={`p-3 rounded-full mb-4 ${
                    isDragging 
                        ? "bg-blue-100 text-blue-600" 
                        : error 
                            ? "bg-destructive/20 text-destructive" 
                            : "bg-gray-100 text-gray-600"
                }`}>
                    {error ? <AlertCircle className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                </div>
                
                {/* Main instruction text */}
                <p className="mb-2 text-lg font-medium text-center text-gray-900 dark:text-gray-100">
                    {error ? "Upload Error" : "Drag and drop files here"}
                </p>
                
                {/* Supporting text */}
                <p className="mb-4 text-sm text-gray-600 text-center max-w-md">
                    {error 
                        ? error
                        : "Supported file types: PDF (regulatory docs, audit reports, model cards)"
                    }
                </p>
                
                {/* Or separator */}
                {!error && (
                    <div className="relative flex items-center w-full max-w-xs mb-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-sm text-gray-500">or</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                )}
                
                {/* Upload button */}
                <Button
                    type="button"
                    variant={error ? "destructive" : "default"}
                    className={`px-5 py-2 rounded-lg ${error ? "" : "shadow-sm"}`}
                    onClick={() => inputRef.current?.click()}
                    aria-label="Select PDF files"
                >
                    {error ? "Try Again" : "Browse Files"}
                </Button>
                
                {/* Hidden file input */}
                <Input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf"
                    multiple
                    className="hidden"
                    onChange={e => handleFiles(e.target.files)}
                    aria-label="File input for PDF upload"
                />
                
                {/* Security note */}
                {!error && (
                    <div className="flex items-center mt-6 text-xs text-gray-500">
                        <Shield className="w-3 h-3 mr-1" />
                        <span>All files are securely processed with PII redaction</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;