
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Award } from "lucide-react";
import { OrganizationConnection } from "../UserProfileTypes";
import { useNavigate } from "react-router-dom";

interface OrganizationConnectionsProps {
  connections: OrganizationConnection[];
  isEditing?: boolean;
}

const OrganizationConnections = ({ connections, isEditing = false }: OrganizationConnectionsProps) => {
  const navigate = useNavigate();

  if (!connections || connections.length === 0) {
    return null;
  }

  const handleOrgClick = (orgId: string) => {
    navigate(`/organization/${orgId}`);
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'soulve-purple';
      case 'staff':
        return 'soulve-blue';
      case 'board_member':
        return 'soulve';
      case 'volunteer':
        return 'soulve-teal';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Building2 className="h-5 w-5 text-teal-600" />
          Organizations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {connections.map((connection) => (
            <div
              key={connection.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 
                    className="font-medium text-gray-900 cursor-pointer hover:text-primary hover:underline transition-colors"
                    onClick={() => handleOrgClick(connection.organizationId)}
                  >
                    {connection.organizationName}
                  </h4>
                  {connection.isCurrent && (
                    <Badge variant="soulve-teal" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Badge variant={getRoleBadgeVariant(connection.role)} className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {formatRole(connection.role)}
                  </Badge>
                  
                  {connection.title && (
                    <span className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      {connection.title}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationConnections;
