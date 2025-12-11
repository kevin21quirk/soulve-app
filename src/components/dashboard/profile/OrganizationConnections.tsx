import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { OrganizationConnection } from "../UserProfileTypes";
import { useNavigate } from "react-router-dom";

interface OrganizationConnectionsProps {
  connections: OrganizationConnection[];
  isEditing?: boolean;
}

const OrganizationConnections = ({ connections }: OrganizationConnectionsProps) => {
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

  return (
    <div className="pt-2 border-t">
      <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
        <Building2 className="h-4 w-4" />
        Organisations
      </h4>
      <div className="flex flex-wrap gap-2">
        {connections.map((connection) => (
          <button
            key={connection.id}
            onClick={() => handleOrgClick(connection.organizationId)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border hover:bg-accent transition-colors text-sm"
          >
            <span className="font-medium">{connection.organizationName}</span>
            <Badge variant="secondary" className="text-xs">
              {formatRole(connection.role)}
            </Badge>
            {connection.isCurrent && (
              <span className="w-2 h-2 rounded-full bg-green-500" title="Current" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrganizationConnections;

