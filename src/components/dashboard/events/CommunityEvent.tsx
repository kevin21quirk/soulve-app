
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, MapPin, Users, Clock, Globe, Video } from "lucide-react";
import { CommunityEvent as CommunityEventType, EventType } from "@/types/challenges";
import { format } from "date-fns";

interface CommunityEventProps {
  event: CommunityEventType;
  onRegister: (eventId: string) => void;
  onViewDetails: (eventId: string) => void;
  userRegistered: boolean;
}

const CommunityEvent = ({ 
  event, 
  onRegister, 
  onViewDetails, 
  userRegistered 
}: CommunityEventProps) => {
  const getEventTypeColor = (type: EventType) => {
    const colors = {
      fundraiser: "bg-green-100 text-green-800",
      volunteer: "bg-blue-100 text-blue-800",
      workshop: "bg-purple-100 text-purple-800",
      meetup: "bg-orange-100 text-orange-800",
      campaign: "bg-red-100 text-red-800",
      awareness: "bg-yellow-100 text-yellow-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getLocationIcon = () => {
    switch (event.location.type) {
      case 'virtual': return <Video className="h-4 w-4" />;
      case 'hybrid': return <Globe className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getLocationText = () => {
    switch (event.location.type) {
      case 'virtual': return 'Virtual Event';
      case 'hybrid': return `${event.location.city} + Virtual`;
      default: return `${event.location.city}, ${event.location.country}`;
    }
  };

  const spotsLeft = event.capacity - event.attendees;
  const isEventFull = spotsLeft <= 0;
  const isEventPast = new Date(event.endDate) < new Date();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getEventTypeColor(event.type)}>
                {event.type}
              </Badge>
              {event.cost && (
                <Badge variant="outline">
                  {event.currency}{event.cost}
                </Badge>
              )}
              {isEventFull && (
                <Badge variant="destructive">Full</Badge>
              )}
            </div>
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
          </div>
          {event.image && (
            <img 
              src={event.image} 
              alt={event.title}
              className="w-16 h-16 object-cover rounded-lg ml-4"
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Date & Time */}
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>
            {format(new Date(event.startDate), 'PPP')} at {format(new Date(event.startDate), 'p')}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 text-sm">
          {getLocationIcon()}
          <span className="text-gray-600">{getLocationText()}</span>
        </div>

        {/* Duration */}
        <div className="flex items-center space-x-2 text-sm">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">
            {format(new Date(event.startDate), 'p')} - {format(new Date(event.endDate), 'p')}
          </span>
        </div>

        {/* Attendees */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <Users className="h-4 w-4 text-gray-500" />
            <span>{event.attendees} / {event.capacity} attending</span>
          </div>
          {spotsLeft > 0 && spotsLeft <= 10 && (
            <Badge variant="outline" className="text-orange-600">
              {spotsLeft} spots left
            </Badge>
          )}
        </div>

        {/* Organizer */}
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {event.organizerName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">
            Organized by {event.organizerName}
          </span>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onViewDetails(event.id)}
            className="flex-1"
          >
            View Details
          </Button>
          {!userRegistered ? (
            <Button 
              onClick={() => onRegister(event.id)}
              className="flex-1"
              disabled={isEventFull || isEventPast || event.status !== 'published'}
            >
              {isEventFull ? 'Full' : isEventPast ? 'Past Event' : 'Register'}
            </Button>
          ) : (
            <Button variant="secondary" className="flex-1" disabled>
              Registered
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityEvent;
