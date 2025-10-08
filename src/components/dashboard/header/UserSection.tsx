
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Building } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ProfileSwitcher } from "@/components/profile/ProfileSwitcher";

interface UserSectionProps {
  context?: string;
  orgId?: string;
  orgName?: string;
}

const UserSection = ({ context = 'personal', orgId, orgName }: UserSectionProps) => {
  const [searchParams] = useSearchParams();
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging you out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Context indicator */}
      {context === 'org' && orgName && (
        <Badge variant="secondary" className="gap-1.5 hidden md:flex">
          <Building className="h-3 w-3" />
          <span className="max-w-[150px] truncate">{orgName}</span>
        </Badge>
      )}
      
      {/* Profile Switcher */}
      <ProfileSwitcher 
        currentView={context === 'org' ? 'organization' : 'personal'}
        currentOrgId={orgId}
      />
      
      <span className="text-sm text-muted-foreground hidden lg:inline">
        {user?.email}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <LogOut className="h-5 w-5" />
        <span className="ml-1 hidden sm:inline">
          {isLoggingOut ? "Logging out..." : "Logout"}
        </span>
      </Button>
    </div>
  );
};

export default UserSection;
