import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  ChevronRight,
  Edit,
  Flame,
  Leaf,
  Camera,
  Star
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const achievements = [
    { id: 1, name: "23 Day Streak", icon: Flame, color: "yellow" },
    { id: 2, name: "Skincare Pro", icon: Leaf, color: "green" },
    { id: 3, name: "Progress Tracker", icon: Camera, color: "blue" },
    { id: 4, name: "AI Learner", icon: Star, color: "purple" },
  ];

  const menuItems = [
    { 
      icon: Edit, 
      title: "Edit Profile", 
      description: "Update your personal information",
      href: "/profile/edit" 
    },
    { 
      icon: Settings, 
      title: "App Settings", 
      description: "Customize your experience",
      href: "/settings" 
    },
    { 
      icon: Bell, 
      title: "Notifications", 
      description: "Manage your notification preferences",
      href: "/settings/notifications" 
    },
    { 
      icon: Shield, 
      title: "Privacy & Security", 
      description: "Control your data and privacy",
      href: "/settings/privacy" 
    },
    { 
      icon: HelpCircle, 
      title: "Help & Support", 
      description: "Get help and contact support",
      href: "/help" 
    },
  ];

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) return user.firstName;
    if (user?.email) return user.email.split('@')[0];
    return "User";
  };

  return (
    <div className="page-container">
      <header className="glass-effect p-4 sticky top-0 z-30">
        <h2 className="text-xl font-bold text-gray-900">Profile</h2>
      </header>

      {/* User Profile Header */}
      <div className="mx-4 mt-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xl font-bold">
                    {getInitials(user?.firstName, user?.lastName)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {getDisplayName()}
                </h3>
                <p className="text-sm text-gray-600">
                  Started journey {stats?.currentStreak || 0} days ago
                </p>
                <p className="text-sm text-primary font-medium">
                  Level {stats?.level || 1} • {stats?.totalXP || 0} XP
                </p>
              </div>
            </div>
            
            {/* Achievement Badges */}
            <div className="grid grid-cols-4 gap-3">
              {achievements.map((achievement) => {
                const IconComponent = achievement.icon;
                const colorClasses = {
                  yellow: "bg-yellow-100 text-yellow-600",
                  green: "bg-green-100 text-green-600", 
                  blue: "bg-blue-100 text-blue-600",
                  purple: "bg-purple-100 text-purple-600",
                };

                return (
                  <div key={achievement.id} className="text-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-1 ${colorClasses[achievement.color as keyof typeof colorClasses]}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-gray-600">{achievement.name}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="mx-4 mt-6">
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {stats?.currentStreak || 0}
              </div>
              <div className="text-xs text-gray-600">Day Streak</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary mb-1">
                {stats?.totalProgressPhotos || 0}
              </div>
              <div className="text-xs text-gray-600">Progress Photos</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent mb-1">
                {stats?.level || 1}
              </div>
              <div className="text-xs text-gray-600">Current Level</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Menu Options */}
      <div className="mx-4 mt-6 space-y-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Card key={item.title} className="cursor-pointer hover:bg-gray-50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sign Out */}
      <div className="mx-4 mt-6 mb-8">
        <Button 
          variant="outline" 
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
          onClick={() => window.location.href = "/api/logout"}
        >
          Sign Out
        </Button>
      </div>

      {/* App Info */}
      <div className="mx-4 mt-8 mb-8 text-center">
        <p className="text-sm text-gray-500">LooksMaxxAI v1.0.0</p>
        <p className="text-xs text-gray-400 mt-1">Your journey to transformation</p>
      </div>
    </div>
  );
}
