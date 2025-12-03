import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Clock, 
  Shield, 
  MessageCircle,
  ExternalLink
} from "lucide-react";
import { getTrustScoreColor } from "@/utils/trustScoreUtils";

export interface ApplicantProfile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  location?: string;
  bio?: string;
  skills?: string[];
}

export interface ApplicantMetrics {
  trust_score?: number;
  volunteer_hours?: number;
  impact_score?: number;
}

interface ApplicantMiniProfileProps {
  userId: string;
  profile?: ApplicantProfile;
  metrics?: ApplicantMetrics;
  showMessageButton?: boolean;
  onMessage?: () => void;
  compact?: boolean;
}

const ApplicantMiniProfile = ({
  userId,
  profile,
  metrics,
  showMessageButton = false,
  onMessage,
  compact = false
}: ApplicantMiniProfileProps) => {
  const fullName = profile 
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User'
    : 'Unknown User';
  
  const initials = profile 
    ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() || 'U'
    : 'U';

  const trustScore = metrics?.trust_score || 0;
  const volunteerHours = metrics?.volunteer_hours || 0;

  if (compact) {
    return (
      <div className="flex items-center space-x-3">
        <Link to={`/profile/${userId}`} className="hover:opacity-80 transition-opacity">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src={profile?.avatar_url} alt={fullName} />
            <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          <Link 
            to={`/profile/${userId}`} 
            className="font-medium text-sm hover:text-primary transition-colors block truncate"
          >
            {fullName}
          </Link>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {profile?.location && (
              <span className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {profile.location}
              </span>
            )}
            {trustScore > 0 && (
              <Badge 
                variant="outline" 
                className={`text-xs px-1.5 py-0 ${getTrustScoreColor(trustScore)}`}
              >
                <Shield className="h-3 w-3 mr-1" />
                {trustScore}
              </Badge>
            )}
          </div>
        </div>
        {showMessageButton && onMessage && (
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onMessage}
            className="h-8 w-8 p-0"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-muted/50 rounded-lg p-4 border">
      <div className="flex items-start space-x-4">
        <Link to={`/profile/${userId}`} className="hover:opacity-80 transition-opacity flex-shrink-0">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage src={profile?.avatar_url} alt={fullName} />
            <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Link>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <Link 
              to={`/profile/${userId}`} 
              className="font-semibold text-base hover:text-primary transition-colors flex items-center"
            >
              {fullName}
              <ExternalLink className="h-3 w-3 ml-1 opacity-50" />
            </Link>
            {trustScore > 0 && (
              <Badge 
                variant="outline" 
                className={`${getTrustScoreColor(trustScore)}`}
              >
                <Shield className="h-3.5 w-3.5 mr-1" />
                Trust Score: {trustScore}
              </Badge>
            )}
          </div>
          
          {profile?.location && (
            <p className="text-sm text-muted-foreground flex items-center mb-2">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              {profile.location}
            </p>
          )}
          
          {profile?.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {profile.bio}
            </p>
          )}
          
          <div className="flex items-center flex-wrap gap-2">
            {volunteerHours > 0 && (
              <Badge variant="secondary" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {volunteerHours} volunteer hours
              </Badge>
            )}
            {profile?.skills?.slice(0, 3).map((skill, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {profile?.skills && profile.skills.length > 3 && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{profile.skills.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      {showMessageButton && onMessage && (
        <div className="mt-3 pt-3 border-t flex justify-end">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onMessage}
            className="gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Message Applicant
          </Button>
        </div>
      )}
    </div>
  );
};

export default ApplicantMiniProfile;
