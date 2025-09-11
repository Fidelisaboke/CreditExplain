import React, { useState, useRef, useEffect } from "react";
import { Send, Loader, Bot, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatMessages } from '@/hooks/useChatMessages';
import ChatResponseCard from "./ChatResponseCard";

const ChatInterface: React.FC = () => {
  const { messages, isLoading, error, sendUserMessage } = useChatMessages();
  const [input, setInput] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

    // Handle sending message with timeout safety
  const handleSend = async () => {
    if (!input.trim() || isLoading || localLoading) return;

    setLocalLoading(true); // Set local loading state
    sendUserMessage(input.trim());
    setInput("");
  };

  // Reset local loading when API response completes
  useEffect(() => {
    if (!isLoading) {
      setLocalLoading(false);
    }
  }, [isLoading]);

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

    const isInputDisabled = isLoading || localLoading;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-blue-950/30 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg overflow-hidden">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-white/30 dark:bg-slate-950/30 backdrop-blur-sm">
        {messages.map((message, index) => (
          <React.Fragment key={message.id}>
            <div
              className={cn(
                "flex animate-in fade-in duration-500",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={cn(
                "flex max-w-[80%] items-start space-x-3",
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}>
                {/* Avatar */}
                <div className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-md",
                  message.role === 'user'
                    ? 'bg-blue-600 ml-3'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 mr-3'
                )}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className="flex flex-col">
                  <div className={cn(
                    "px-5 py-4 rounded-2xl shadow-sm transition-all duration-300",
                    message.role === 'user'
                      ? 'bg-blue-600 text-white  rounded-br-md hover:shadow-md'
                      : 'bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 text-slate-800 dark:text-slate-200 rounded-bl-md hover:shadow-md'
                  )}>
                    {message.isLoading ? (
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-slate-500">Analyzing documents...</span>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</p>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className={cn(
                    "flex items-center mt-2 text-xs text-slate-500",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}>
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
            {message.responseData && !message.isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] ml-16">
                  <ChatResponseCard response={message.responseData} setInput={setInput} />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}

        {error && (
          <div className="max-w-[80%] mx-auto bg-red-50 border border-red-200 rounded-xl p-4 animate-in fade-in duration-500">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white/80 dark:bg-slate-950 backdrop-blur-sm border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isInputDisabled ? "Processing your request..." : "Ask about credit policies, loan decisions, or any financial question..."}
                className={cn(
                  "w-full min-h-[56] max-h-[120] overflow-hidden resize-none border rounded-xl px-5 py-4 pr-14 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm",
                  isInputDisabled
                    ? "border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    : "border-slate-300 bg-white text-slate-800 placeholder-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                )}
                rows={1}
                disabled={isInputDisabled}
              />
              <div className="absolute right-3 bottom-3">
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isInputDisabled}
                  className={cn(
                    "p-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg",
                    isInputDisabled
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  )}
                >
                  {isInputDisabled ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Input hints */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>{input.length}/2000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;