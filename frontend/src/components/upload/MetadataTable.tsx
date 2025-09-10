/**
 * MetadataTable displays a list of document metadata in a table format.
 * Enhanced with status indicators, document types, and improved styling.
 */

import React from "react";
import { type DocumentMetadata } from "@/types/document";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Shield, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface MetadataTableProps {
  documents: DocumentMetadata[];
}

const MetadataTable: React.FC<MetadataTableProps> = ({ documents }) => {
  // Function to get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "processed":
        return { icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-100" };
      case "processing":
        return { icon: Clock, color: "text-amber-600", bgColor: "bg-amber-100" };
      case "error":
        return { icon: AlertCircle, color: "text-destructive", bgColor: "bg-destructive/20" };
      default:
        return { icon: Clock, color: "text-gray-600", bgColor: "bg-gray-100" };
    }
  };

  // Function to get document type icon
  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case "Regulatory":
        return { icon: FileText, color: "text-blue-600" };
      case "Audit Report":
        return { icon: Shield, color: "text-green-600" };
      case "Model Card":
        return { icon: CheckCircle, color: "text-purple-600" };
      default:
        return { icon: FileText, color: "text-gray-600" };
    }
  };

  if (documents.length === 0) {
    return (
      <div className="mt-6 p-12 text-center border border-dashed rounded-xl bg-gray-50 dark:bg-gray-950">
        <FileText className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Upload PDF documents to get started. CreditExplain will process them and make them available for querying.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block mt-6 overflow-hidden border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
                <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider min-w-[240px]">
                  Document
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Type
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Size
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Pages
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider min-w-[140px]">
                  Upload Date
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Status
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  PII
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc, index) => {
                const StatusIcon = getStatusInfo(doc.status || "processed").icon;
                const statusColor = getStatusInfo(doc.status || "processed").color;
                const DocTypeIcon = getDocumentTypeIcon(doc.type || "Other").icon;
                const docTypeColor = getDocumentTypeIcon(doc.type || "Other").color;
                
                return (
                  <TableRow
                    key={doc.id}
                    className={`transition-colors duration-150 hover:bg-gray-50/50 dark:hover:bg-gray-950/50 focus-within:bg-gray-50 dark:focus-within:bg-gray-950 ${
                      index !== documents.length - 1 ? 'border-b border-gray-100 dark:border-gray-900' : ''
                    }`}
                    tabIndex={0}
                    aria-label={`Document metadata for ${doc.filename}`}
                  >
                    <TableCell className="px-6 py-4 text-foreground">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-md ${docTypeColor} bg-opacity-10 dark:bg-opacity-90 mr-3`}>
                          <DocTypeIcon className="w-4 h-4" />
                        </div>
                        <div className="max-w-[220px] truncate" title={doc.filename}>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{doc.filename}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-foreground">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                        {doc.type || "Other"}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-foreground tabular-nums text-sm">
                      {doc.sizeInKB.toLocaleString()} KB
                    </TableCell>
                    <TableCell className="px-6 py-4 text-foreground tabular-nums text-sm">
                      {doc.pageCount}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-foreground text-sm">
                      {new Date(doc.uploadDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center">
                        <StatusIcon className={`w-4 h-4 mr-1.5 ${statusColor}`} />
                        <span className="text-sm capitalize">{doc.status || "processed"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {doc.piiStatus === "redacted" ? (
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Redacted
                        </div>
                      ) : (
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                          Pending
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden mt-6 space-y-4">
        {documents.map((doc) => {
          const StatusIcon = getStatusInfo(doc.status || "processed").icon;
          const statusColor = getStatusInfo(doc.status || "processed").color;
          const statusBgColor = getStatusInfo(doc.status || "processed").bgColor;
          const DocTypeIcon = getDocumentTypeIcon(doc.type || "Other").icon;
          const docTypeColor = getDocumentTypeIcon(doc.type || "Other").color;
          
          return (
            <div
              key={doc.id}
              className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm bg-white dark:bg-slate-950 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start">
                  <div className={`p-2 rounded-md ${docTypeColor} bg-opacity-10 mr-3`}>
                    <DocTypeIcon className="w-4 h-4" />
                  </div>
                  <h3 className="font-medium text-gray-900 break-words flex-1 min-w-0" title={doc.filename}>
                    {doc.filename}
                  </h3>
                </div>
                <div className={`flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusBgColor} ${statusColor}`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  <span className="capitalize">{doc.status || "processed"}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span>
                  <div>{doc.type || "Other"}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Size:</span>
                  <div className="tabular-nums">{doc.sizeInKB.toLocaleString()} KB</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Pages:</span>
                  <div className="tabular-nums">{doc.pageCount}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">PII:</span>
                  <div>
                    {doc.piiStatus === "redacted" ? (
                      <span className="text-green-600">Redacted</span>
                    ) : (
                      <span className="text-amber-600">Pending</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-900">
                <span className="font-medium text-gray-700 dark:text-gray-300">Uploaded:</span>
                <div>
                  {new Date(doc.uploadDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MetadataTable;