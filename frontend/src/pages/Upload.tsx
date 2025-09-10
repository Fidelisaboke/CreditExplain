import React, { useState } from "react";
import { Link } from "react-router-dom";
import FileUpload from "@/components/upload/FileUpload";
import MetadataTable from "@/components/upload/MetadataTable";
import type { DocumentMetadata } from "@/types/document";
import { mockMetadata } from "@/data/documents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, Database, BarChart, ArrowRight, Shield, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

/**
 * Upload page allows users to upload PDF files and view their metadata.
 * Enhanced with professional styling and additional functionality.
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
    status: "processed",
    type: file.name.includes("regulatory") ? "Regulatory" : 
          file.name.includes("audit") ? "Audit Report" : 
          file.name.includes("model") ? "Model Card" : "Other",
    piiStatus: "redacted",
    reflectionScore: Math.floor(Math.random() * 100),
  }));
}

const UploadPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentMetadata[]>(mockedDocuments);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("upload");

  // Handle new file uploads with simulated processing
  const handleFiles = (files: File[]) => {
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate processing progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          
          // Add new documents to the list
          const newDocs = generateMockMetadata(files);
          setDocuments(prev => [...prev, ...newDocs]);
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };

  const stats = {
    totalDocuments: documents.length,
    regulatoryDocs: documents.filter(d => d.type === "Regulatory").length,
    auditReports: documents.filter(d => d.type === "Audit Report").length,
    modelCards: documents.filter(d => d.type === "Model Card").length,
    avgReflectionScore: documents.reduce((sum, doc) => sum + (doc.reflectionScore || 0), 0) / documents.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Document Repository</h1>
          <p className="text-lg text-gray-600 dark:text-gray-200 max-w-2xl mx-auto">
            Upload regulatory documents, audit reports, and model cards for analysis. CreditExplain will process, redact PII, and make them available for querying.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Documents
            </TabsTrigger>
            <TabsTrigger value="repository" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Document Repository
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload Card */}
              <Card className="lg:col-span-2 shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Upload className="h-6 w-6 text-blue-600" />
                    Upload Documents
                  </CardTitle>
                  <CardDescription>
                    Drag and drop PDF files or click to browse. Supported: regulatory docs, audit reports, model cards.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onFiles={handleFiles} error={error} setError={setError} />
                  
                  {isProcessing && (
                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Processing documents...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-gray-500">Redacting PII and extracting metadata</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Info Panel */}
              <div className="space-y-4">
                <Card className="shadow-lg border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Shield className="h-5 w-5 text-green-600" />
                      PII Protection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      All uploaded documents are automatically scanned for personally identifiable information (PII) which is redacted to ensure compliance.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BarChart className="h-5 w-5 text-blue-600" />
                      Document Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Documents:</span>
                      <span className="font-medium">{stats.totalDocuments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Regulatory Docs:</span>
                      <span className="font-medium">{stats.regulatoryDocs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Audit Reports:</span>
                      <span className="font-medium">{stats.auditReports}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Model Cards:</span>
                      <span className="font-medium">{stats.modelCards}</span>
                    </div>
                  </CardContent>
                </Card>

                <Button asChild className="w-full mt-4">
                  <Link to="/query" className="flex items-center gap-2">
                    Start Querying <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="repository">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Database className="h-6 w-6 text-blue-600" />
                  Document Repository
                </CardTitle>
                <CardDescription>
                  All processed documents available for querying. Click on a document to view detailed metadata.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MetadataTable documents={documents} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">How Document Processing Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center border-0 shadow-md">
              <CardHeader>
                <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Upload & Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Documents are uploaded securely with automatic PII detection and redaction to ensure compliance.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-md">
              <CardHeader>
                <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Process & Extract</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our system processes documents, extracts metadata, and prepares them for the RAG pipeline.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-md">
              <CardHeader>
                <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Query & Analyze</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ask questions and get explanations with citations from your processed document library.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;