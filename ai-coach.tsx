import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import ChatMessage from "@/components/chat-message";
import { Send, Bot, User } from "lucide-react";

export default function AICoach() {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["/api/chat/messages"],
  });

  const sendMessage = useMutation({
    mutationFn: async (messageText: string) => {
      const response = await apiRequest("POST", "/api/chat/messages", { 
        message: messageText 
      });
      return response.json();
    },
    onMutate: () => {
      setIsTyping(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
      setMessage("");
      setIsTyping(false);
    },
    onError: () => {
      setIsTyping(false);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !sendMessage.isPending) {
      sendMessage.mutate(message.trim());
    }
  };

  const quickQuestions = [
    "Best hair routine for my face shape?",
    "Review my progress photos",
    "Supplement recommendations",
    "How to improve skin texture?",
    "Workout plan for beginners",
  ];

  return (
    <div className="page-container h-screen flex flex-col">
      <header className="glass-effect p-4 sticky top-0 z-30 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
            <Bot className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Coach</h2>
            <div className="flex items-center text-sm text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Online & Ready
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Welcome Message */}
            {(!messages || messages.length === 0) && (
              <ChatMessage
                isBot={true}
                message={`Hi ${user?.firstName || 'there'}! I've analyzed your progress and I'm impressed with your dedication! What would you like to work on today?`}
                timestamp={new Date()}
              />
            )}

            {/* Chat History */}
            {messages?.map((msg: any) => (
              <div key={msg.id} className="space-y-3">
                <ChatMessage
                  isBot={false}
                  message={msg.message}
                  timestamp={new Date(msg.timestamp)}
                />
                <ChatMessage
                  isBot={true}
                  message={msg.response}
                  timestamp={new Date(msg.timestamp)}
                  suggestions={msg.suggestions}
                />
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="text-white text-sm" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-3 max-w-xs">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Suggestions */}
            {(!messages || messages.length === 0) && !isTyping && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center">Quick questions you can ask:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickQuestions.map((question) => (
                    <Badge
                      key={question}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setMessage(question)}
                    >
                      {question}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t bg-white bottom-nav-safe">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-3">
            <Input
              type="text"
              placeholder="Ask your AI coach anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={sendMessage.isPending}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            className="w-10 h-10 rounded-full gradient-primary border-0"
            disabled={!message.trim() || sendMessage.isPending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
