import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  isBot: boolean;
  message: string;
  timestamp: Date;
  suggestions?: string[];
}

export default function ChatMessage({ isBot, message, timestamp, suggestions }: ChatMessageProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isBot) {
    return (
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="text-white text-sm" />
        </div>
        <div className="max-w-xs">
          <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-3">
            <p className="text-sm text-gray-900">{message}</p>
          </div>
          {suggestions && suggestions.length > 0 && (
            <div className="mt-3 space-y-2">
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="bg-white border border-gray-200">
                  <CardContent className="p-2">
                    <p className="text-xs font-medium text-gray-900 mb-1">
                      💡 {suggestion}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <span className="text-xs text-gray-500 mt-1 block">
            {formatTime(timestamp)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3 justify-end">
      <div className="max-w-xs">
        <div className="gradient-primary rounded-2xl rounded-tr-sm p-3">
          <p className="text-sm text-white">{message}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1 block text-right">
          {formatTime(timestamp)}
        </span>
      </div>
      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
        <User className="text-gray-600 text-sm" />
      </div>
    </div>
  );
}
