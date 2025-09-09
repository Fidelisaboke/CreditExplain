/**
 * SidebarQuestions lists reranked follow-up questions for user engagement.
 * Clicking a question repopulates input or triggers another query.
 */

import React from "react";
import { MessageSquare } from "lucide-react";

interface SidebarQuestionsProps {
  questions: string[];
  onSelect: (q: string) => void;
}

const SidebarQuestions: React.FC<SidebarQuestionsProps> = ({ questions, onSelect }) => (
  <aside className="w-full md:w-64 bg-card border-l border-muted p-4 rounded-xl shadow-md animate-fade-in" aria-label="Follow-up questions sidebar">
    <div className="flex items-center gap-2 mb-4">
      <MessageSquare size={20} className="text-accent" aria-label="Questions icon" />
      <span className="font-bold text-primary">Follow-up Questions</span>
    </div>
    <ul className="space-y-2">
      {questions.map((q, idx) => (
        <li key={idx}>
          <button
            type="button"
            className="w-full text-left px-3 py-2 rounded-lg bg-muted hover:bg-accent/30 text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
            onClick={() => onSelect(q)}
            aria-label={`Select follow-up question: ${q}`}
          >
            {q}
          </button>
        </li>
      ))}
    </ul>
  </aside>
);

export default SidebarQuestions;
