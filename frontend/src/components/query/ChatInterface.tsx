/**
 * ChatInterface manages chat state, simulates RAG flow, and renders chat UI.
 * Responsive: single-column on mobile, split view on desktop.
 * Accessibility: focus management, ARIA labels, error handling.
 */

import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
import ChatInput from "./ChatInput";
import ExplanationCard from "./ExplanationCard";
import InlineFollowUps from "./InlineFollowUps";
import { Loader } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Mock RAG pipeline outputs
const mockResponse = {
  explanation: "Based on your credit inquiry, the policy clause 4.2 applies. Your credit was denied due to insufficient income documentation.",
  confidence: 92,
  citations: [
    {
      docName: "sample-policy.pdf",
      clause: "4.2",
      snippet: "Credit will be denied if income documentation is not provided as per clause 4.2."
    },
    {
      docName: "audit-report.pdf",
      clause: "2.1",
      snippet: "Audit findings indicate missing income records for applicant."
    }
  ],
  selector: "Relevant clauses selected: 4.2, 2.1",
  followups: [
    "What documents are accepted for income verification?",
    "How can I appeal a credit denial?",
    "Show me the full policy clause 4.2."
  ]
};

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([
    { role: "assistant", content: "Welcome! Ask any financial credit question and I’ll explain the relevant policy or decision." }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<typeof mockResponse | null>(null);
  const [followups, setFollowups] = useState<string[]>(mockResponse.followups);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, response]);

  // Simulate orchestrator, retriever, reranker, generator, selector, PII filter
  // TODO: Integrate backend API for actual logic
  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setChat(prev => [...prev, { role: "user", content: input }]);
    try {
      // Simulate API call with delay
      await new Promise(res => setTimeout(res, 1200));
      // const res = await axios.post("/api/query", { query: input });
      setResponse(mockResponse);
      setChat(prev => [...prev, { role: "assistant", content: mockResponse.explanation }]);
      setFollowups(mockResponse.followups);
    } catch (e) {
      setError("Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  // Handle follow-up question click
  const handleFollowup = (q: string) => {
    setInput(q);
    // Optionally auto-send: handleSend();
  };

  return (
    <div className="font-sans flex flex-col md:flex-row gap-6 w-full h-full animate-fade-in">
      {/* Chat panel */}
      <main className="bg-white flex-1 flex flex-col rounded-xl shadow-md p-6 min-h-[60vh]">
        <div className="flex flex-col gap-4 mb-4">
          {chat.map((msg, idx) => (
            <div
              key={idx}
              /*
                Message bubble styling:
                - whitespace-pre-wrap: preserves line breaks and wraps long text
                - break-words: breaks long words to avoid overflow
                - overflow-y-auto + max-h-[16rem]: allows scrolling for very long messages, prevents layout breakage
                - animate-fade-in: subtle fade-in animation for new messages
              */
              className={`w-fit max-w-[80%] px-4 py-2 rounded-lg shadow ${msg.role === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted text-foreground"} whitespace-pre-wrap break-words overflow-y-auto max-h-[16rem] animate-fade-in`}
              aria-label={msg.role === "user" ? "User message" : "Assistant message"}
              tabIndex={0}
            >
              {msg.content}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        {loading && (
          <div className="flex items-center justify-center py-4 animate-fade-in">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="ml-2 text-muted-foreground">Loading...</span>
          </div>
        )}
        {error && (
          <div className="text-destructive mt-2 animate-fade-in" role="alert">{error}</div>
        )}
        {/* Explanation card after response */}
        {response && !loading && (
          <ExplanationCard
            explanation={response.explanation}
            confidence={response.confidence}
            citations={response.citations}
            selector={response.selector}
          >
            <InlineFollowUps questions={followups} onSelect={handleFollowup} />
          </ExplanationCard>
        )}
        {/* Chat input */}
        <div className="mt-auto">
          {/*
            ChatInput uses an auto-resizing textarea:
            - Expands vertically as user types, no internal scrollbars.
            - Uses React ref + scrollHeight method for robust resizing.
            - See ChatInput.tsx for implementation details.
          */}
          <ChatInput value={input} onChange={setInput} onSend={handleSend} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default ChatInterface;
