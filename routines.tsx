import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import RoutineItem from "@/components/routine-item";
import { Plus } from "lucide-react";

export default function Routines() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: routines, isLoading } = useQuery({
    queryKey: ["/api/routines"],
  });

  const { data: todayCompletions } = useQuery({
    queryKey: ["/api/routines/completions", new Date().toISOString().split('T')[0]],
  });

  const completeRoutine = useMutation({
    mutationFn: async (routineItemId: number) => {
      await apiRequest("POST", "/api/routines/complete", { routineItemId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routines/completions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Great job!",
        description: "Routine item completed. Keep up the momentum!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete routine item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const categoryFilters = ["All", "Skincare", "Fitness", "Nutrition", "Sleep", "Grooming"];

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const completedToday = todayCompletions?.map((c: any) => c.routineItemId) || [];

  return (
    <div className="page-container">
      <header className="glass-effect p-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">My Routines</h2>
            <p className="text-sm text-gray-600">Build consistency, see results</p>
          </div>
          <Button size="sm" className="gradient-primary border-0">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </header>

      {/* Category Filters */}
      <div className="px-4 mt-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categoryFilters.map((category) => (
            <Badge
              key={category}
              variant={category === "All" ? "default" : "outline"}
              className={`whitespace-nowrap cursor-pointer ${
                category === "All" ? "bg-primary text-white" : ""
              }`}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Morning Routine */}
      <div className="mx-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Morning Routine</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">5/6 complete</span>
            <div className="w-8 h-8">
              <svg className="progress-ring w-8 h-8" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="14" stroke="#E5E7EB" strokeWidth="4" fill="none"/>
                <circle 
                  cx="16" 
                  cy="16" 
                  r="14" 
                  stroke="#10B981" 
                  strokeWidth="4" 
                  fill="none" 
                  strokeDasharray="87.96" 
                  strokeDashoffset="14.66"
                  className="progress-ring"
                />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <RoutineItem
            id={1}
            title="Cleanse face with gentle cleanser"
            description="Use lukewarm water and gentle circular motions"
            completed={true}
            completedAt="7:15 AM"
            streak={23}
            xp={10}
            category="skincare"
            onComplete={() => {}}
          />
          
          <RoutineItem
            id={2}
            title="Apply sunscreen SPF 30+"
            description="Don't forget neck and ears"
            completed={false}
            xp={8}
            category="skincare"
            onComplete={(id) => completeRoutine.mutate(id)}
          />
          
          <RoutineItem
            id={3}
            title="Take daily vitamins"
            description="Vitamin D3, Omega-3, Multivitamin"
            completed={true}
            completedAt="7:30 AM"
            streak={15}
            xp={5}
            category="nutrition"
            onComplete={() => {}}
          />
        </div>
      </div>

      {/* Evening Routine */}
      <div className="mx-4 mt-8 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Evening Routine</h3>
        <div className="space-y-3">
          <RoutineItem
            id={4}
            title="Double cleanse (oil + foam)"
            description="Remove all makeup and sunscreen"
            completed={false}
            xp={10}
            category="skincare"
            timeHint="Usually at 9:00 PM"
            onComplete={(id) => completeRoutine.mutate(id)}
          />
          
          <RoutineItem
            id={5}
            title="Apply retinol serum"
            description="Start with 2x per week"
            completed={false}
            xp={12}
            category="skincare"
            frequency="3x per week"
            onComplete={(id) => completeRoutine.mutate(id)}
          />
          
          <RoutineItem
            id={6}
            title="Moisturize face and neck"
            description="Use upward motions"
            completed={false}
            xp={8}
            category="skincare"
            onComplete={(id) => completeRoutine.mutate(id)}
          />
        </div>
      </div>
    </div>
  );
}
