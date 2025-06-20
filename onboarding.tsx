import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface OnboardingData {
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  skinType?: string;
  hairType?: string;
  goals?: string[];
}

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: async (profileData: OnboardingData & { onboardingCompleted: boolean }) => {
      await apiRequest("PATCH", "/api/profile", profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      window.location.href = "/";
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const steps = [
    "Basic Info",
    "Physical Stats", 
    "Skin & Hair",
    "Your Goals"
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      updateProfile.mutate({ ...data, onboardingCompleted: true });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return data.age && data.gender;
      case 1:
        return data.height && data.weight;
      case 2:
        return data.skinType && data.hairType;
      case 3:
        return data.goals && data.goals.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="mobile-container">
      <div className="p-6 min-h-screen flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Profile Setup</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
          
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </p>
        </div>

        {/* Step Content */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 0 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={data.age || ''}
                      onChange={(e) => updateData('age', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Gender</Label>
                    <RadioGroup
                      value={data.gender}
                      onValueChange={(value) => updateData('gender', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={data.height || ''}
                      onChange={(e) => updateData('height', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="70.0"
                      value={data.weight || ''}
                      onChange={(e) => updateData('weight', parseFloat(e.target.value))}
                    />
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="space-y-3">
                    <Label>Skin Type</Label>
                    <RadioGroup
                      value={data.skinType}
                      onValueChange={(value) => updateData('skinType', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="oily" id="oily" />
                        <Label htmlFor="oily">Oily</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dry" id="dry" />
                        <Label htmlFor="dry">Dry</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="combination" id="combination" />
                        <Label htmlFor="combination">Combination</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sensitive" id="sensitive" />
                        <Label htmlFor="sensitive">Sensitive</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="acne-prone" id="acne-prone" />
                        <Label htmlFor="acne-prone">Acne-prone</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Hair Type</Label>
                    <RadioGroup
                      value={data.hairType}
                      onValueChange={(value) => updateData('hairType', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="straight" id="straight" />
                        <Label htmlFor="straight">Straight</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="wavy" id="wavy" />
                        <Label htmlFor="wavy">Wavy</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="curly" id="curly" />
                        <Label htmlFor="curly">Curly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="coily" id="coily" />
                        <Label htmlFor="coily">Coily</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="thinning" id="thinning" />
                        <Label htmlFor="thinning">Thinning</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <Label>What are your main goals? (Select all that apply)</Label>
                  {[
                    'Clearer skin',
                    'Better skincare routine',
                    'Muscle gain',
                    'Fat loss',
                    'Better posture',
                    'Improved style',
                    'Better grooming',
                    'Healthier hair',
                    'Better sleep',
                    'Increased confidence'
                  ].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={data.goals?.includes(goal) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateData('goals', [...(data.goals || []), goal]);
                          } else {
                            updateData('goals', (data.goals || []).filter(g => g !== goal));
                          }
                        }}
                      />
                      <Label htmlFor={goal}>{goal}</Label>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="mt-8">
          <Button
            className="w-full py-3"
            onClick={handleNext}
            disabled={!canProceed() || updateProfile.isPending}
          >
            {updateProfile.isPending ? (
              "Saving..."
            ) : currentStep === steps.length - 1 ? (
              "Complete Setup"
            ) : (
              <>
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
