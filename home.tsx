import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import ProgressCard from "@/components/progress-card";
import { 
  Droplets, 
  Moon, 
  Leaf, 
  Dumbbell, 
  Camera, 
  ShoppingCart,
  Brain,
  Flame,
  Bell
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: todayCompletions } = useQuery({
    queryKey: ["/api/routines/completions", new Date().toISOString().split('T')[0]],
  });

  // Mock daily data - in a real app this would come from the backend
  const dailyProgress = {
    hydration: { current: 6, target: 8, unit: "glasses" },
    sleep: { current: 7.5, target: 8, unit: "hours" },
    skincare: { completed: true },
    workout: { completed: false },
  };

  const motivationalQuotes = [
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Progress, not perfection.",
    "Your future self will thank you.",
    "Small steps every day lead to big changes one year.",
    "Consistency is the mother of mastery."
  ];

  const todayQuote = motivationalQuotes[new Date().getDay() % motivationalQuotes.length];

  return (
    <div className="page-container">
      {/* Header */}
      <header className="glass-effect p-4 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.firstName || 'there'}!
          </h2>
          <p className="text-sm text-gray-600">
            Day {stats?.currentStreak || 1} of your transformation
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="streak-badge px-3 py-1 text-white border-0">
            <Flame className="w-4 h-4 mr-1" />
            {stats?.currentStreak || 0}
          </Badge>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </header>

      {/* Daily Motivation Quote */}
      <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Brain className="text-white text-sm" />
          </div>
          <div>
            <p className="text-gray-800 font-medium text-sm leading-relaxed">
              "{todayQuote}"
            </p>
            <p className="text-gray-500 text-xs mt-1">Daily Motivation</p>
          </div>
        </div>
      </div>

      {/* Progress Summary Cards */}
      <div className="mx-4 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Progress</h3>
        <div className="grid grid-cols-2 gap-3">
          <ProgressCard
            icon={<Droplets className="text-blue-600" />}
            title="Hydration"
            current={dailyProgress.hydration.current}
            target={dailyProgress.hydration.target}
            unit={dailyProgress.hydration.unit}
            color="blue"
          />
          
          <ProgressCard
            icon={<Moon className="text-purple-600" />}
            title="Sleep Quality"
            current={dailyProgress.sleep.current}
            target={dailyProgress.sleep.target}
            unit={dailyProgress.sleep.unit}
            color="purple"
          />
          
          <ProgressCard
            icon={<Leaf className="text-green-600" />}
            title="AM Skincare"
            completed={dailyProgress.skincare.completed}
            color="green"
          />
          
          <ProgressCard
            icon={<Dumbbell className="text-orange-600" />}
            title="Workout"
            completed={dailyProgress.workout.completed}
            color="orange"
          />
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="mx-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
          <span className="text-sm text-gray-500">
            {todayCompletions?.length || 0}/7 completed
          </span>
        </div>
        
        <div className="space-y-3">
          {/* Mock tasks - in real app these would come from user's routines */}
          <TaskItem
            completed={true}
            title="Morning skincare routine"
            xp={10}
          />
          
          <TaskItem
            completed={true}
            title="Take vitamins & supplements"
            xp={5}
          />
          
          <TaskItem
            completed={false}
            title="30-min cardio workout"
            xp={15}
          />
          
          <TaskItem
            completed={false}
            title="5-min mewing exercise"
            xp={8}
          />
        </div>
      </div>

      {/* AI Insights */}
      <div className="mx-4 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights for You</h3>
        <Card className="gradient-primary border-0">
          <CardContent className="p-4 text-white">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Skin Improvement Tip</h4>
                <p className="text-sm opacity-90 leading-relaxed">
                  Your consistency is paying off! Consider adding a gentle exfoliant 2x per week to accelerate your progress.
                </p>
                <Button variant="ghost" size="sm" className="mt-3 text-white hover:bg-white hover:bg-opacity-20 p-0">
                  Ask AI Coach →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mx-4 mt-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="p-4 h-auto flex flex-col items-center text-center space-y-2"
            onClick={() => window.location.href = "/progress"}
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Camera className="text-indigo-600 text-lg" />
            </div>
            <span className="text-sm font-medium">Take Progress Photo</span>
          </Button>
          
          <Button
            variant="outline"
            className="p-4 h-auto flex flex-col items-center text-center space-y-2"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="text-green-600 text-lg" />
            </div>
            <span className="text-sm font-medium">Shop Products</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

interface TaskItemProps {
  completed: boolean;
  title: string;
  xp: number;
}

function TaskItem({ completed, title, xp }: TaskItemProps) {
  return (
    <div className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
        completed 
          ? 'bg-green-500' 
          : 'border-2 border-gray-300'
      }`}>
        {completed && (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <span className={`flex-1 text-sm ${completed ? 'text-gray-900' : 'text-gray-900'}`}>
        {title}
      </span>
      <span className={`text-xs font-medium ${
        completed ? 'text-green-600' : 'text-gray-500'
      }`}>
        {completed ? '+' : ''}{xp} XP
      </span>
    </div>
  );
}
