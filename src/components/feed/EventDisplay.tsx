import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Video, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, isPast, isFuture } from 'date-fns';

interface EventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxAttendees?: number;
  isVirtual: boolean;
  virtualLink?: string;
}

interface EventDisplayProps {
  postId: string;
  eventData: EventData;
  onRSVP?: () => void;
}

export const EventDisplay = ({ postId, eventData, onRSVP }: EventDisplayProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAttending, setIsAttending] = useState(false);
  const [isRSVPing, setIsRSVPing] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(0);

  const eventDateTime = parseISO(`${eventData.date}T${eventData.time}`);
  const isEventPast = isPast(eventDateTime);
  const isEventSoon = isFuture(eventDateTime) && 
    (eventDateTime.getTime() - Date.now()) < 24 * 60 * 60 * 1000;

  const handleRSVP = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to RSVP for events.",
        variant: "destructive"
      });
      return;
    }

    setIsRSVPing(true);
    try {
      if (isAttending) {
        // Remove RSVP
        const { error } = await supabase
          .from('post_interactions')
          .delete()
          .match({
            post_id: postId,
            user_id: user.id,
            interaction_type: 'event_rsvp'
          });

        if (error) throw error;

        setIsAttending(false);
        setAttendeeCount(prev => Math.max(0, prev - 1));
        toast({
          title: "RSVP cancelled",
          description: "You've been removed from the event."
        });
      } else {
        // Add RSVP
        const { error } = await supabase
          .from('post_interactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            interaction_type: 'event_rsvp',
            content: JSON.stringify({ rsvpTime: new Date().toISOString() })
          });

        if (error) throw error;

        setIsAttending(true);
        setAttendeeCount(prev => prev + 1);
        onRSVP?.();
        toast({
          title: "You're going!",
          description: "You've been added to the event."
        });
      }
    } catch (error) {
      console.error('Error with RSVP:', error);
      toast({
        title: "Error",
        description: "Failed to update RSVP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRSVPing(false);
    }
  };

  const getStatusBadge = () => {
    if (isEventPast) {
      return <Badge variant="secondary" className="bg-muted text-muted-foreground">Past Event</Badge>;
    }
    if (isEventSoon) {
      return <Badge className="bg-orange-500 text-white">Starting Soon</Badge>;
    }
    return <Badge className="bg-green-600 text-white">Upcoming</Badge>;
  };

  const spotsRemaining = eventData.maxAttendees 
    ? eventData.maxAttendees - attendeeCount 
    : null;

  return (
    <div className="bg-gradient-to-br from-primary/5 to-accent/30 rounded-xl overflow-hidden border border-border/50">
      {/* Event Header */}
      <div className="bg-primary/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">Event</span>
        </div>
        {getStatusBadge()}
      </div>

      {/* Event Content */}
      <div className="p-4 space-y-4">
        <h4 className="font-bold text-lg text-foreground">{eventData.title}</h4>
        
        {eventData.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {eventData.description}
          </p>
        )}

        {/* Event Details */}
        <div className="grid gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(eventDateTime, 'EEEE, MMMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{format(eventDateTime, 'h:mm a')}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            {eventData.isVirtual ? (
              <>
                <Video className="h-4 w-4 text-muted-foreground" />
                <span>Virtual Event</span>
                {eventData.virtualLink && isAttending && (
                  <a 
                    href={eventData.virtualLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    Join <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{eventData.location}</span>
              </>
            )}
          </div>

          {eventData.maxAttendees && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {attendeeCount} / {eventData.maxAttendees} attending
                {spotsRemaining !== null && spotsRemaining <= 5 && spotsRemaining > 0 && (
                  <span className="text-orange-600 ml-1">({spotsRemaining} spots left)</span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* RSVP Button */}
        {!isEventPast && (
          <Button
            onClick={handleRSVP}
            disabled={isRSVPing || (spotsRemaining !== null && spotsRemaining <= 0 && !isAttending)}
            className={`w-full ${
              isAttending 
                ? 'bg-green-600 hover:bg-green-700' 
                : ''
            }`}
            variant={isAttending ? 'default' : 'outline'}
          >
            {isRSVPing 
              ? 'Updating...' 
              : isAttending 
                ? "✓ You're Going" 
                : spotsRemaining !== null && spotsRemaining <= 0
                  ? 'Event Full'
                  : 'RSVP - Going'
            }
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventDisplay;
