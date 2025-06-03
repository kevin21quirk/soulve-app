
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  TrendingUp, 
  Plus,
  Users,
  Target,
  Award,
  Menu,
  Bell,
  Search
} from "lucide-react";
import CreatePostModal from "@/components/dashboard/post-creation/CreatePostModal";
import { useCreatePost } from "@/hooks/useCreatePost";

const MobileDashboard = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { createPost, isSubmitting } = useCreatePost();

  const handlePostSubmit = async (data: any) => {
    try {
      await createPost(data);
      setShowCreatePost(false);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  // Sample data
  const stats = [
    { label: "Impact Score", value: "2,847", change: "+12%", icon: TrendingUp },
    { label: "People Helped", value: "23", change: "+5", icon: Users },
    { label: "Goals Achieved", value: "8", change: "+2", icon: Target },
    { label: "Badges Earned", value: "12", change: "+1", icon: Award },
  ];

  const recentActivity = [
    { type: "help", user: "Sarah M.", action: "helped with grocery shopping", time: "2h ago" },
    { type: "goal", user: "You", action: "completed weekly volunteer goal", time: "1d ago" },
    { type: "badge", user: "Mike R.", action: "earned Community Helper badge", time: "2d ago" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
              SouLVE
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              {stats.slice(0, 2).map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600">{stat.label}</p>
                        <p className="text-lg font-bold">{stat.value}</p>
                        <p className="text-xs text-green-600">{stat.change}</p>
                      </div>
                      <stat.icon className="h-6 w-6 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Create Post Button */}
            <Card>
              <CardContent className="p-4">
                <Button 
                  onClick={() => setShowCreatePost(true)}
                  className="w-full bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Share Something
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <Badge variant="secondary" className="mt-1">
                          {stat.change}
                        </Badge>
                      </div>
                      <stat.icon className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Active Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Weekly Volunteer Hours</span>
                    <span>6/10 hours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Impact Points</span>
                    <span>850/1000 pts</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">J</span>
                </div>
                <h3 className="text-lg font-semibold">John Doe</h3>
                <p className="text-gray-600">Community Helper</p>
                <Badge className="mt-2">Trust Score: 95</Badge>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={handlePostSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium">New connection request</p>
              <p className="text-xs text-gray-600">Sarah wants to connect with you</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium">Goal completed!</p>
              <p className="text-xs text-gray-600">You've reached your weekly volunteer goal</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MobileDashboard;
