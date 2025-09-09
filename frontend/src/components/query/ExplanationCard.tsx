/**
 * ExplanationCard displays the model's explanation, confidence, citations, and selector output.
 * Uses theme colors and fade-in animation for clarity.
 */

import React from "react";
import { Info } from "lucide-react";
import CitationPreview from "../query/CitationPreview";

interface Citation {
  docName: string;
  clause: string;
  snippet: string;
}

interface ExplanationCardProps {
  explanation: string;
  confidence: number;
  citations: Citation[];
  selector: string;
  children?: React.ReactNode;
}

const ExplanationCard: React.FC<ExplanationCardProps> = ({ explanation, confidence, citations, selector, children }) => (
  <>
    <div className="bg-card rounded-xl shadow-lg border border-accent p-6 mb-4 animate-fade-in">
    <div className="flex items-center gap-2 mb-2">
      <Info size={20} className="text-accent" aria-label="Explanation" />
      <span className="font-bold text-lg text-primary">Explanation</span>
      <span className="ml-auto text-xs text-muted-foreground">Confidence: <span className="font-semibold text-accent">{confidence}%</span></span>
    </div>
    <p className="mb-4 text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>{explanation}</p>
    <div className="mb-2">
      <span className="font-semibold text-primary">Selector Output:</span>
      <span className="ml-2 text-muted-foreground">{selector}</span>
    </div>
    <div className="mt-4">
      <span className="font-semibold text-primary">Citations:</span>
      <div className="mt-2 space-y-2">
        {citations.map((c, idx) => (
          <CitationPreview key={idx} {...c} />
        ))}
      </div>
    </div>
  </div>
    {children && <div className="mt-2 mb-4">{children}</div>}
  </>
);

export default ExplanationCard;
