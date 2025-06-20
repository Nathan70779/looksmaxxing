import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Target, TrendingUp, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="mobile-container bg-gradient-to-br from-slate-50 to-white">
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 text-center pt-16">
          {/* Logo/Brand Icon */}
          <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Sparkles className="text-white text-2xl" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">LooksMaxxAI</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-sm">
            Your AI-powered journey to becoming the best version of yourself
          </p>
          
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Personalized Goals</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="text-sm font-medium">Track Progress</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <Sparkles className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-sm font-medium">AI Coaching</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Community</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="p-6 pb-8">
          <Button 
            className="w-full py-4 text-lg font-semibold mb-4 gradient-primary border-0"
            onClick={() => window.location.href = "/api/login"}
          >
            Start Your Transformation
          </Button>
          <p className="text-center text-sm text-gray-500">
            Free • No commitments • Private & Secure
          </p>
        </div>
      </div>
    </div>
  );
}
