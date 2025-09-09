/**
 * MetadataTable displays a list of document metadata in a table format.
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

const MetadataTable: React.FC<MetadataTableProps> = ({ documents }) => (
  <div className="overflow-x-auto mt-6">
    <Table className="min-w-full bg-white border rounded shadow">
      <TableHeader>
        <TableRow>
          <TableHead className="px-4 py-2 border">Filename</TableHead>
          <TableHead className="px-4 py-2 border">Size (KB)</TableHead>
          <TableHead className="px-4 py-2 border">Page Count</TableHead>
          <TableHead className="px-4 py-2 border">Upload Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map(doc => (
          <TableRow key={doc.id}>
            <TableCell className="px-4 py-2 border">{doc.filename}</TableCell>
            <TableCell className="px-4 py-2 border">{doc.sizeInKB}</TableCell>
            <TableCell className="px-4 py-2 border">{doc.pageCount}</TableCell>
            <TableCell className="px-4 py-2 border">{new Date(doc.uploadDate).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default MetadataTable;
