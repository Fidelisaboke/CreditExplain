import React, { useState, useRef, useEffect } from "react";
import { Send, Loader, Bot, User, Clock, CheckCircle, FileText, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface Citation {
  docName: string;
  clause: string;
  snippet: string;
}

interface RAGResponse {
  explanation: string;
  confidence: number;
  citations: Citation[];
  selector: string;
  followups: string[];
}

// Mock RAG pipeline outputs
const mockResponse: RAGResponse = {
  explanation: "Based on your credit inquiry, the policy clause 4.2 applies. Your credit was denied due to insufficient income documentation. This is a standard requirement across all financial institutions to ensure compliance with lending regulations.",
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
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1',
      role: "assistant", 
      content: "👋 Welcome! I'm your AI financial assistant. Ask me any questions about credit policies, loan decisions, or financial regulations and I'll provide detailed explanations with relevant citations.",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResponse, setCurrentResponse] = useState<RAGResponse | null>(null);
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

  // Handle sending message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    // Add loading assistant message
    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Replace loading message with actual response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id 
            ? { ...msg, content: mockResponse.explanation, isLoading: false }
            : msg
        )
      );
      
      setCurrentResponse(mockResponse);
    } catch (error) {
      setError("I apologize, but I'm having trouble processing your request. Please try again.");
      // Remove loading message on error
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle follow-up questions
  const handleFollowup = (question: string) => {
    setInput(question);
    textareaRef.current?.focus();
  };

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

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-blue-950/30 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg overflow-hidden">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-white/30 dark:bg-slate-950/30 backdrop-blur-sm">
        {messages.map((message, index) => (
          <div 
            key={message.id} 
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
        ))}

        {/* RAG Response Card */}
        {currentResponse && !isLoading && (
          <div className="max-w-[90%] mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 shadow-sm animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center mb-5">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Analysis Complete</span>
              </div>
              <div className="ml-auto flex items-center space-x-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Confidence:</span>
                <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                  {currentResponse.confidence}%
                </div>
              </div>
            </div>

            {/* Citations */}
            {currentResponse.citations.length > 0 && (
              <div className="mb-5">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Source Documents
                </h4>
                <div className="space-y-3">
                  {currentResponse.citations.map((citation, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        <span className="font-medium text-sm text-blue-700 dark:text-blue-300">{citation.docName}</span>
                        <span className="ml-3 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          Clause {citation.clause}
                        </span>
                      </div>
                      <p className="font-serif text-sm text-slate-600 dark:text-slate-400 italic">"{citation.snippet}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Follow-up Questions */}
            {currentResponse.followups.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  Related Questions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentResponse.followups.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleFollowup(question)}
                      className="bg-white dark:bg-slate-950 hover:bg-blue-50 dark:hover:bg-blue-950 border border-slate-200/60 dark:border-slate-800/60 rounded-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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
                placeholder="Ask about credit policies, loan decisions, or any financial question..."
                className="w-full min-h-[56] max-h-[120] overflow-hidden resize-none border border-slate-300 dark:border-slate-700 rounded-xl px-5 py-4 pr-14 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 placeholder-slate-500 transition-all duration-200 shadow-sm"
                rows={1}
                disabled={isLoading}
              />
              <div className="absolute right-3 bottom-3">
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
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