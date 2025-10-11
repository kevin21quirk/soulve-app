import { Building, User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserOrganizations } from '@/hooks/useUserOrganizations';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileSwitcherProps {
  currentView?: 'personal' | 'organization';
  currentOrgId?: string;
}

export const ProfileSwitcher = ({ currentView = 'personal', currentOrgId }: ProfileSwitcherProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { organizations, loading } = useUserOrganizations();

  const currentOrg = organizations.find(org => org.id === currentOrgId);

  // Don't show anything while loading
  if (loading) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-2 hover:bg-accent/50 transition-colors"
        >
          {currentView === 'personal' ? (
            <>
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Personal Profile</span>
            </>
          ) : (
            <>
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">{currentOrg?.name || 'Organization'}</span>
            </>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Switch Profile</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={() => navigate('/dashboard?context=personal&tab=profile')}
          className={currentView === 'personal' ? 'bg-accent' : ''}
        >
          <div className="flex items-center gap-3 w-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">Personal Profile</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </DropdownMenuItem>

        {organizations.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Your Organizations
            </DropdownMenuLabel>
          </>
        )}

        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => navigate(`/dashboard?context=org&orgId=${org.id}&tab=profile`)}
            className={currentView === 'organization' && currentOrgId === org.id ? 'bg-accent' : ''}
          >
            <div className="flex items-center gap-3 w-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={org.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                  {org.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{org.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {org.organization_type.replace('-', ' ')}
                </p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
