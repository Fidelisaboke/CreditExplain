import React from "react";
import { Info, Shield, FileText } from "lucide-react";
import CitationPreview from "@/components/query/CitationPreview";
import { cn } from "@/lib/utils";

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
  className?: string;
}

const ExplanationCard: React.FC<ExplanationCardProps> = ({
  explanation,
  confidence,
  citations,
  selector,
  children,
  className
}) => (
  <div className={cn(
    "bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 mb-6 shadow-lg animate-in fade-in duration-500",
    className
  )}>
    {/* Header */}
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
        <Shield className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-lg text-slate-800">Explanation</h3>
        <p className="text-sm text-slate-600">AI-powered analysis with citations</p>
      </div>
      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
        {confidence}% Confidence
      </div>
    </div>

    {/* Explanation */}
    <div className="mb-5 p-4 bg-slate-50 rounded-xl border border-slate-200/60">
      <p className="text-slate-700 leading-relaxed text-sm">{explanation}</p>
    </div>

    {/* Selector Output */}
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-4 h-4 text-blue-600" />
        <span className="font-semibold text-slate-800 text-sm">Selector Output:</span>
      </div>
      <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-sm border border-blue-200">
        {selector}
      </div>
    </div>

    {/* Citations */}
    {citations.length > 0 && (
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="font-semibold text-slate-800 text-sm">Citations:</span>
        </div>
        <div className="space-y-3">
          {citations.map((c, idx) => (
            <CitationPreview key={idx} {...c} />
          ))}
        </div>
      </div>
    )}

    {children}
  </div>
);

export default ExplanationCard;