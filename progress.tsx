import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import PhotoUpload from "@/components/photo-upload";
import { Camera, TrendingUp, BarChart3, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function ProgressPage() {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: photos, isLoading } = useQuery({
    queryKey: ["/api/progress-photos"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  return (
    <div className="page-container">
      <header className="glass-effect p-4 sticky top-0 z-30">
        <h2 className="text-xl font-bold text-gray-900">Progress Tracking</h2>
        <p className="text-sm text-gray-600">Your transformation journey</p>
      </header>

      {/* Progress Stats */}
      <div className="mx-4 mt-4">
        <Card className="gradient-glow-up border-0">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Glow-Up Timeline</h3>
              <span className="text-sm opacity-80">
                {stats?.currentStreak || 0} days strong
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {((stats?.level || 1) + 2.2).toFixed(1)}
                </p>
                <p className="text-sm opacity-80">Overall Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">34%</p>
                <p className="text-sm opacity-80">Skin Improvement</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {stats?.totalProgressPhotos || 0}
                </p>
                <p className="text-sm opacity-80">Photos Taken</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Before/After Gallery */}
      <div className="mx-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Photo Timeline</h3>
          <Button
            size="sm"
            className="gradient-primary border-0"
            onClick={() => setShowPhotoUpload(true)}
          >
            <Camera className="w-4 h-4 mr-1" />
            Add Photo
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : photos && photos.length > 0 ? (
          <div className="space-y-4">
            {photos.map((photo: any) => (
              <PhotoEntry key={photo.id} photo={photo} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-8 text-center">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">No Progress Photos Yet</h4>
              <p className="text-sm text-gray-600 mb-4">
                Start documenting your transformation journey by taking your first progress photo.
              </p>
              <Button
                onClick={() => setShowPhotoUpload(true)}
                className="gradient-primary border-0"
              >
                Take First Photo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Analysis Report */}
      <div className="mx-4 mt-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis Report</h3>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Weekly Analysis</h4>
                <p className="text-sm text-gray-600">Based on your recent photos</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <AnalysisItem
                label="Skin Clarity"
                progress={75}
                improvement="+12%"
                color="green"
              />
              
              <AnalysisItem
                label="Facial Symmetry"
                progress={88}
                improvement="+3%"
                color="blue"
              />
              
              <AnalysisItem
                label="Overall Glow"
                progress={65}
                improvement="+8%"
                color="purple"
              />
            </div>
            
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Great progress!</strong> Your consistency is paying off. 
                Keep up the current routine for best results.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <PhotoUpload onClose={() => setShowPhotoUpload(false)} />
      )}
    </div>
  );
}

interface PhotoEntryProps {
  photo: any;
}

function PhotoEntry({ photo }: PhotoEntryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-900">
            Progress Update
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(photo.createdAt)}
          </span>
        </div>
        
        <div className="mb-3">
          <img
            src={photo.imageUrl}
            alt="Progress photo"
            className="w-full h-48 object-cover rounded-lg bg-gray-100"
          />
        </div>
        
        {photo.caption && (
          <p className="text-sm text-gray-600 mb-2">{photo.caption}</p>
        )}
        
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span className="flex items-center space-x-1">
            <Heart className="w-3 h-3 text-red-500" />
            <span>12 likes</span>
          </span>
          <span className="flex items-center space-x-1">
            <MessageCircle className="w-3 h-3" />
            <span>3 comments</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

interface AnalysisItemProps {
  label: string;
  progress: number;
  improvement: string;
  color: 'green' | 'blue' | 'purple';
}

function AnalysisItem({ label, progress, improvement, color }: AnalysisItemProps) {
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  const textColorClasses = {
    green: 'text-green-600',
    blue: 'text-blue-600',  
    purple: 'text-purple-600',
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center space-x-2">
        <div className="w-20 h-2 bg-gray-200 rounded-full">
          <div 
            className={`h-2 rounded-full ${colorClasses[color]}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={`text-sm font-medium ${textColorClasses[color]}`}>
          {improvement}
        </span>
      </div>
    </div>
  );
}
