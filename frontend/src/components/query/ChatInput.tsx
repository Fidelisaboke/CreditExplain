/**
 * ChatInput component provides a text input and send button for user queries.
 * Accessibility: Focus ring, ARIA label, keyboard submit.
 */

import React, { useRef, useEffect } from "react";
import { Send, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
// Remove Input import, use native textarea for auto-resize

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  loading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, loading }) => {
  // Ref for textarea to control auto-resize
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle Enter key for submission and Shift+Enter for new line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      onSend();
    }
    // Shift+Enter inserts newline by default
  };

  // Auto-resize textarea vertically as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [value]);

  return (
    <div className="relative flex items-center">
      {/*
        Use a native textarea for chat input:
        - Auto-resizes vertically as user types (see useEffect above)
        - No horizontal scrolling; long lines wrap
        - Shift+Enter inserts newline, Enter submits
        - Accessibility: focus ring, ARIA label
      */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        className="pr-12 flex-1 px-4 py-3 border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition resize-none overflow-hidden whitespace-pre-wrap break-words min-h-[3rem] max-h-[12rem]"
        placeholder="Type your credit inquiry..."
        aria-label="Chat input"
        disabled={loading}
        spellCheck={true}
      />
      <Button
        type="button"
        onClick={onSend}
        disabled={loading || !value.trim()}
        className="absolute right-2 rounded-lg bg-primary text-primary-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary transition"
        aria-label="Send message"
      >
        {loading ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Send size={24} className="text-white hover:text-primary" aria-label="Send icon" />
        )}
      </Button>
    </div>
  );
};

export default ChatInput;
