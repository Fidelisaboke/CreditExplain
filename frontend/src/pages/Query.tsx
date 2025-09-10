// Query.tsx
import React from "react";
import ChatInterface from "@/components/query/ChatInterface";
import { FileText, Shield, Zap } from "lucide-react";

const Query: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-blue-950/30">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in duration-700">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Compliance Assistant
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Ask questions about regulatory documents, audit reports, and model cards. 
            Get transparent explanations with actionable citations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-in slide-in-from-bottom-8 duration-700">
          <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Document Analysis</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Analyze PDFs with advanced RAG technology</p>
          </div>

          <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Smart Citations</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Transparent explanations with verifiable sources</p>
          </div>

          <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Audit Ready</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">PII redaction and comprehensive logging</p>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="animate-in fade-in-90 duration-1000">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Query;