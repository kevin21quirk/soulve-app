import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TeamMember {
  user_id: string;
  role: string;
  title: string | null;
  user?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

interface OrganizationTeamSectionProps {
  members: TeamMember[];
  totalMembers: number;
}

const OrganizationTeamSection = ({ members, totalMembers }: OrganizationTeamSectionProps) => {
  const navigate = useNavigate();

  const getRoleBadgeVariant = (role: string) => {
    if (role === 'owner') return 'default';
    if (role === 'admin') return 'secondary';
    return 'outline';
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleMemberClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </div>
          <Badge variant="secondary">{totalMembers} total</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div
              key={member.user_id}
              onClick={() => handleMemberClick(member.user_id)}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.user?.avatar_url || ''} />
                <AvatarFallback>
                  {member.user?.first_name?.[0]}
                  {member.user?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                  {member.user?.first_name} {member.user?.last_name}
                </p>
                {member.title && (
                  <p className="text-xs text-muted-foreground truncate">{member.title}</p>
                )}
                <Badge variant={getRoleBadgeVariant(member.role)} className="text-xs mt-1">
                  {formatRole(member.role)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationTeamSection;
