import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface CitationPreviewProps {
  docName: string;
  clause: string;
  snippet: string;
  className?: string;
}

const CitationPreview: React.FC<CitationPreviewProps> = ({ docName, clause, snippet, className }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn(
      "border border-slate-200/60 rounded-xl bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500",
      className
    )}>
      <button
        type="button"
        className="flex items-center w-full text-left gap-3 rounded-lg"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        aria-label={`Expand citation for ${docName}`}
      >
        <FileText className="w-5 h-5 text-blue-600" aria-label="Document icon" />
        <span className="font-semibold text-blue-700 text-sm">{docName}</span>
        <span className="ml-2 bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
          Clause {clause}
        </span>
        <span className="ml-auto">
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-500" aria-label="Collapse" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" aria-label="Expand" />
          )}
        </span>
      </button>
      {expanded && (
        <div className="mt-3 text-slate-700 text-sm animate-in fade-in duration-300 border-t border-slate-100 pt-3">
          <p className="italic leading-relaxed">"{snippet}"</p>
        </div>
      )}
    </div>
  );
};

export default CitationPreview;