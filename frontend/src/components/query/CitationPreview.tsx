/**
 * CitationPreview shows a citation as an expandable/collapsible card.
 * Accessibility: ARIA labels, focus ring, semantic HTML.
 */

import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";

interface CitationPreviewProps {
  docName: string;
  clause: string;
  snippet: string;
}

const CitationPreview: React.FC<CitationPreviewProps> = ({ docName, clause, snippet }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-muted rounded-lg bg-background shadow-sm p-3 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary">
      <button
        type="button"
        className="flex items-center w-full text-left gap-2 rounded"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        aria-label={`Expand citation for ${docName}`}
      >
        <FileText size={18} className="text-primary" aria-label="Document icon" />
        <span className="font-semibold text-primary">{docName}</span>
        <span className="ml-2 text-muted-foreground">Clause: {clause}</span>
        <span className="ml-auto">
          {expanded ? <ChevronUp size={18} className="text-accent" aria-label="Collapse" /> : <ChevronDown size={18} className="text-accent" aria-label="Expand" />}
        </span>
      </button>
      {expanded && (
        <div className="mt-2 text-foreground animate-fade-in" style={{ fontFamily: 'var(--font-serif)' }}>
          {snippet}
        </div>
      )}
    </div>
  );
};

export default CitationPreview;
