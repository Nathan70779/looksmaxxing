import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Flame } from "lucide-react";

interface RoutineItemProps {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string;
  streak?: number;
  xp: number;
  category: string;
  timeHint?: string;
  frequency?: string;
  onComplete: (id: number) => void;
}

export default function RoutineItem({
  id,
  title,
  description,
  completed,
  completedAt,
  streak,
  xp,
  category,
  timeHint,
  frequency,
  onComplete
}: RoutineItemProps) {
  const categoryColors = {
    skincare: "bg-green-100 text-green-700",
    fitness: "bg-orange-100 text-orange-700", 
    nutrition: "bg-blue-100 text-blue-700",
    sleep: "bg-purple-100 text-purple-700",
    grooming: "bg-yellow-100 text-yellow-700",
  };

  if (completed) {
    return (
      <Card className="habit-complete border-0">
        <CardContent className="p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Check className="w-6 h-6" />
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm opacity-80">
                  {completedAt ? `Completed at ${completedAt}` : 'Completed'}
                </p>
              </div>
            </div>
            {streak && (
              <div className="flex items-center space-x-1">
                <Flame className="w-4 h-4" />
                <span className="text-sm">{streak}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-100">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-gray-900">{title}</h4>
              <Badge 
                variant="secondary" 
                className={`text-xs ${categoryColors[category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-700'}`}
              >
                {category}
              </Badge>
            </div>
            
            {description && (
              <p className="text-sm text-gray-600 mb-2">{description}</p>
            )}
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {timeHint && <span>{timeHint}</span>}
              {frequency && <span>{frequency}</span>}
              <span className="flex items-center space-x-1">
                <span>+{xp} XP</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
          <Button 
            size="sm" 
            className="gradient-primary border-0"
            onClick={() => onComplete(id)}
          >
            Mark Done
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
