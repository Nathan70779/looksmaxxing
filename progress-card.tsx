import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressCardProps {
  icon: React.ReactNode;
  title: string;
  current?: number;
  target?: number;
  unit?: string;
  completed?: boolean;
  color: 'blue' | 'purple' | 'green' | 'orange';
}

export default function ProgressCard({
  icon,
  title,
  current,
  target,
  unit,
  completed,
  color
}: ProgressCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      progress: 'bg-blue-500',
      text: 'text-blue-600'
    },
    purple: {
      bg: 'bg-purple-100', 
      progress: 'bg-purple-500',
      text: 'text-purple-600'
    },
    green: {
      bg: 'bg-green-100',
      progress: 'bg-green-500', 
      text: 'text-green-600'
    },
    orange: {
      bg: 'bg-orange-100',
      progress: 'bg-orange-500',
      text: 'text-orange-600'
    }
  };

  const getProgressValue = () => {
    if (completed !== undefined) {
      return completed ? 100 : 0;
    }
    if (current && target) {
      return Math.min((current / target) * 100, 100);
    }
    return 0;
  };

  const getStatusText = () => {
    if (completed !== undefined) {
      return completed ? 'Complete' : 'Pending';
    }
    if (current && target && unit) {
      return `${current}/${target} ${unit}`;
    }
    return '';
  };

  return (
    <Card className="shadow-sm border border-gray-100">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`w-8 h-8 ${colorClasses[color].bg} rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
          <span className={`text-xs ${
            completed === true ? colorClasses[color].text : 'text-gray-500'
          }`}>
            {getStatusText()}
          </span>
        </div>
        
        <div className="mb-2">
          <Progress 
            value={getProgressValue()} 
            className="h-2"
          />
        </div>
        
        <p className="text-sm font-medium text-gray-900">{title}</p>
      </CardContent>
    </Card>
  );
}
