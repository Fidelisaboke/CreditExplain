/**
 * Query page for interactive financial credit chatbot.
 * Renders ChatInterface with responsive layout and theme.
 */

import React from "react";
import ChatInterface from "@/components/query/ChatInterface";

const Query: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-2" style={{ fontFamily: 'var(--font-sans)' }}>
      <div className="w-full max-w-5xl mx-auto py-10">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Query;
