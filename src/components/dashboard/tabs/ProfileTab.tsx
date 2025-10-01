
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserProfile from "../UserProfile";
import UserAccessPanel from "../../admin/UserAccessPanel";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronDown, ChevronUp } from "lucide-react";

const ProfileTab = () => {
  const { user } = useAuth();
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Check if current user is admin (Matthew Walker)
  const isAdmin = user?.id === 'f13567a6-7606-48ef-9333-dd661199eaf1';

  return (
    <div className="space-y-6">
      {/* Admin Panel - Only visible to admin with collapse functionality */}
      {isAdmin && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Admin Controls</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className="flex items-center gap-2"
              >
                {showAdminPanel ? (
                  <>
                    Hide
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          {showAdminPanel && (
            <CardContent className="pt-0">
              <UserAccessPanel />
            </CardContent>
          )}
        </Card>
      )}
      
      {/* Enhanced Profile Content */}
      <UserProfile />
    </div>
  );
};

export default ProfileTab;
