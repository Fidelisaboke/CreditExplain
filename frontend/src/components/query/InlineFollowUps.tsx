import React from "react";

/**
 * InlineFollowUps renders follow-up questions as clickable pills below a response.
 * Accessibility: focus ring, ARIA labels, keyboard navigation.
 */
interface InlineFollowUpsProps {
  questions: string[];
  onSelect: (q: string) => void;
}

const InlineFollowUps: React.FC<InlineFollowUpsProps> = ({ questions, onSelect }) => {
  if (!questions?.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-4 animate-fade-in" aria-label="Follow-up questions">
      {questions.slice(0, 5).map((q, idx) => (
        <button
          key={idx}
          type="button"
          className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent transition font-medium shadow"
          onClick={() => onSelect(q)}
          aria-label={`Quick reply: ${q}`}
        >
          {q}
        </button>
      ))}
    </div>
  );
};

export default InlineFollowUps;
