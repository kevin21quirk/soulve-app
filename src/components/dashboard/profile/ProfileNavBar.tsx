import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  Building2, 
  CheckCircle, 
  AlertCircle, 
  Leaf, 
  MessageSquare, 
  TrendingUp, 
  Settings,
  Shield,
  ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserOrganizations } from "@/hooks/useUserOrganizations";
import { useVerifications } from "@/hooks/useVerifications";
import { useAuth } from "@/contexts/AuthContext";
import EnhancedVerificationRequestDialog from "../verification/EnhancedVerificationRequestDialog";

interface ProfileNavBarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isAdmin: boolean;
  esgScore?: number;
}

const ProfileNavBar = ({ 
  activeSection, 
  onSectionChange, 
  isAdmin,
  esgScore 
}: ProfileNavBarProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { organizations } = useUserOrganizations();
  const { verifications } = useVerifications();
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);

  const hasGovernmentId = verifications?.some(
    v => v.verification_type === 'government_id' && v.status === 'approved'
  );

  const navItems = [
    { id: 'posts', label: 'Posts', icon: MessageSquare },
    { id: 'impact', label: 'Impact', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg overflow-x-auto">
      {/* Profile Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1.5 px-3 h-8 text-sm font-medium shrink-0"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Personal</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-popover border shadow-lg z-50">
          <DropdownMenuItem 
            onClick={() => navigate('/dashboard?tab=profile&context=personal')}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Personal Profile
          </DropdownMenuItem>
          {organizations?.map((org) => (
            <DropdownMenuItem 
              key={org.id}
              onClick={() => navigate(`/organization/${org.id}`)}
              className="flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              {org.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-px h-5 bg-border shrink-0" />

      {/* Verification Status */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowVerificationDialog(true)}
        className={`flex items-center gap-1.5 px-3 h-8 text-sm shrink-0 ${
          hasGovernmentId 
            ? 'text-emerald-600 dark:text-emerald-400' 
            : 'text-amber-600 dark:text-amber-400'
        }`}
      >
        {hasGovernmentId ? (
          <>
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Verified</span>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Verify</span>
          </>
        )}
      </Button>

      {/* ESG Score */}
      {esgScore !== undefined && esgScore > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSectionChange('impact')}
          className="flex items-center gap-1.5 px-3 h-8 text-sm text-emerald-600 dark:text-emerald-400 shrink-0"
        >
          <Leaf className="h-4 w-4" />
          <span>ESG: {esgScore}</span>
        </Button>
      )}

      <div className="w-px h-5 bg-border shrink-0" />

      {/* Navigation Items */}
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant={activeSection === item.id ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onSectionChange(item.id)}
          className={`flex items-center gap-1.5 px-3 h-8 text-sm shrink-0 ${
            activeSection === item.id 
              ? 'bg-gradient-to-r from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] text-white' 
              : ''
          }`}
        >
          <item.icon className="h-4 w-4" />
          <span className="hidden sm:inline">{item.label}</span>
        </Button>
      ))}

      {/* Admin Button */}
      {isAdmin && (
        <>
          <div className="w-px h-5 bg-border shrink-0" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin')}
            className="flex items-center gap-1.5 px-3 h-8 text-sm text-purple-600 dark:text-purple-400 shrink-0"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Admin</span>
          </Button>
        </>
      )}

      <EnhancedVerificationRequestDialog
        open={showVerificationDialog}
        onOpenChange={setShowVerificationDialog}
        existingVerifications={verifications || []}
      />
    </div>
  );
};

export default ProfileNavBar;
