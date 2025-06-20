import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Calendar, 
  Bot, 
  TrendingUp, 
  User 
} from "lucide-react";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/routines", icon: Calendar, label: "Routines" },
    { path: "/ai-coach", icon: Bot, label: "AI Coach" },
    { path: "/progress", icon: TrendingUp, label: "Progress" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200 z-40 bottom-nav-safe">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location === item.path;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center py-2 px-3 h-auto ${
                isActive 
                  ? "text-primary" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setLocation(item.path)}
            >
              <IconComponent className="text-xl mb-1 w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
