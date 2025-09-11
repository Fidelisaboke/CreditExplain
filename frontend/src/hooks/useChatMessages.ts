import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSendQuery } from '@/api/creditExplainApi';
import { type QueryResponse } from '@/types/api.types';

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  responseData?: QueryResponse;
}

interface UseChatMessagesReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendUserMessage: (content: string) => void;
  addMessage: (content: string, role?: "user" | "assistant", isLoading?: boolean) => ChatMessage;
}

export const useChatMessages = (): UseChatMessagesReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: uuidv4(),
      role: "assistant", 
      content: "👋 Welcome! I'm your AI financial assistant. Ask me any questions about credit policies, loan decisions, or financial regulations and I'll provide detailed explanations with relevant citations.",
      timestamp: new Date()
    }
  ]);

  const { mutate: sendQuery, isPending, error } = useSendQuery({
    onSuccess: (data) => {
      setMessages(prev => 
        prev.map(msg => 
          msg.isLoading 
            ? { 
                ...msg, 
                content: data.explanation, 
                isLoading: false,
                responseData: data
              }
            : msg
        )
      );
    },
    onError: (error) => {
      setMessages(prev => 
        prev.map(msg => 
          msg.isLoading 
            ? { 
                ...msg, 
                content: `Sorry, I encountered an error: ${error.message}`, 
                isLoading: false 
              }
            : msg
        )
      );
    }
  });

  const addMessage = (content: string, role: "user" | "assistant" = "user", isLoading = false) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      role,
      content,
      timestamp: new Date(),
      isLoading
    };

    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const sendUserMessage = (content: string) => {
    addMessage(content, "user");
    addMessage("Analyzing your question...", "assistant", true);
    
    sendQuery({ query: content });
  };

  return {
    messages,
    isLoading: isPending,
    error: error?.message || null,
    sendUserMessage,
    addMessage
  };
};