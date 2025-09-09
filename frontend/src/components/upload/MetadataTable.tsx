/**
 * MetadataTable displays a list of document metadata in a table format.
 * Handles responsive design, long filenames, and follows accessibility best practices.
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

interface MetadataTableProps {
  documents: DocumentMetadata[];
}

const MetadataTable: React.FC<MetadataTableProps> = ({ documents }) => {
  if (documents.length === 0) {
    return (
      <div className="mt-6 p-8 text-center text-muted-foreground">
        <p>No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block mt-6 overflow-hidden border rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-50 border-b">
                <TableHead className="px-4 py-3 text-left text-primary font-semibold min-w-[200px]">
                  Filename
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-primary font-semibold whitespace-nowrap">
                  Size (KB)
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-primary font-semibold whitespace-nowrap">
                  Pages
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-primary font-semibold min-w-[140px]">
                  Upload Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc, index) => (
                <TableRow
                  key={doc.id}
                  className={`transition-colors duration-200 hover:bg-accent/30 focus-within:bg-accent/40 ${
                    index !== documents.length - 1 ? 'border-b' : ''
                  }`}
                  tabIndex={0}
                  aria-label={`Document metadata for ${doc.filename}`}
                >
                  <TableCell className="px-4 py-2 text-foreground">
                    <div className="max-w-[250px] truncate" title={doc.filename}>
                      {doc.filename}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2 text-foreground tabular-nums">
                    {doc.sizeInKB.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-foreground tabular-nums">
                    {doc.pageCount}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-foreground text-sm">
                    {new Date(doc.uploadDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: '2-digit'
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden mt-6 space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="border rounded-lg p-4 shadow-sm bg-card hover:shadow-md transition-shadow duration-200"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-foreground break-words flex-1 min-w-0" title={doc.filename}>
                  {doc.filename}
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Size:</span>
                  <div className="tabular-nums">{doc.sizeInKB.toLocaleString()} KB</div>
                </div>
                <div>
                  <span className="font-medium">Pages:</span>
                  <div className="tabular-nums">{doc.pageCount}</div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground pt-1">
                <span className="font-medium">Uploaded:</span>
                <div>
                  {new Date(doc.uploadDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MetadataTable;