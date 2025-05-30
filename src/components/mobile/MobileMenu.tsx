
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  HelpCircle, 
  Shield, 
  Heart, 
  Users, 
  Target, 
  BarChart3, 
  Bell, 
  CreditCard, 
  Gift, 
  MapPin, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Star, 
  LogOut,
  ChevronRight,
  User,
  Globe
} from "lucide-react";

interface MobileMenuProps {
  onNavigateToProfile?: () => void;
  onNavigateToTab?: (tab: string) => void;
  onLogout?: () => void;
}

const MobileMenu = ({ onNavigateToProfile, onNavigateToTab, onLogout }: MobileMenuProps) => {
  const [userStats] = useState({
    trustScore: 85,
    pointsBalance: 1247,
    helpedCount: 23,
    connectionsCount: 42
  });

  const menuSections = [
    {
      title: "Your Impact",
      items: [
        { icon: User, label: "Profile", action: onNavigateToProfile, description: "View and edit your profile" },
        { icon: BarChart3, label: "Trust & Analytics", action: () => onNavigateToTab?.("analytics-points"), description: "View your trust score and analytics" },
        { icon: Target, label: "Campaigns", action: () => onNavigateToTab?.("campaigns"), description: "Your campaigns and causes" },
        { icon: Heart, label: "Donations", action: () => {}, description: "Your donation history" },
        { icon: Users, label: "Connections", action: () => onNavigateToTab?.("discover-connect"), description: "Manage your network" },
      ]
    },
    {
      title: "Platform Features",
      items: [
        { icon: MapPin, label: "Local Impact", action: () => {}, description: "Find local causes and events" },
        { icon: Calendar, label: "Events", action: () => {}, description: "Community events and meetups" },
        { icon: Gift, label: "Rewards", action: () => {}, description: "Redeem points and rewards" },
        { icon: MessageSquare, label: "Community Forums", action: () => {}, description: "Join discussions" },
        { icon: Globe, label: "Global Causes", action: () => {}, description: "International impact opportunities" },
      ]
    },
    {
      title: "Account & Support",
      items: [
        { icon: Settings, label: "Settings", action: () => {}, description: "App preferences and privacy" },
        { icon: Bell, label: "Notifications", action: () => {}, description: "Manage notification preferences" },
        { icon: CreditCard, label: "Payment Methods", action: () => {}, description: "Manage payment options" },
        { icon: Shield, label: "Privacy & Security", action: () => {}, description: "Account security settings" },
        { icon: HelpCircle, label: "Help & Support", action: () => onNavigateToTab?.("help-center"), description: "Get help and support" },
        { icon: FileText, label: "Terms & Policies", action: () => {}, description: "Legal information" },
        { icon: Star, label: "Rate SouLVE", action: () => {}, description: "Leave us a review" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
            <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-xl">
              U
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">Alex Thompson</h2>
            <p className="text-sm text-gray-600">Community Helper</p>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Trust: {userStats.trustScore}%
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {userStats.pointsBalance} Points
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{userStats.helpedCount}</div>
            <div className="text-sm text-gray-600">People Helped</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{userStats.connectionsCount}</div>
            <div className="text-sm text-gray-600">Connections</div>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="p-4 space-y-6">
        {menuSections.map((section, sectionIndex) => (
          <Card key={sectionIndex}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-900">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto p-3 hover:bg-gray-50"
                      onClick={item.action}
                    >
                      <item.icon className="h-5 w-5 text-gray-600 mr-3 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-gray-900">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 ml-2" />
                    </Button>
                    {itemIndex < section.items.length - 1 && <Separator className="my-1" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Logout Section */}
        <Card>
          <CardContent className="pt-6">
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-3 hover:bg-red-50 text-red-600 hover:text-red-700"
              onClick={onLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="text-sm font-medium">Sign Out</div>
                <div className="text-xs text-red-500">Log out of your account</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileMenu;
