
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, X, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface EventCreatorProps {
  onEventCreate: (event: EventData) => void;
  onClose: () => void;
  initialEvent?: Partial<EventData>;
}

const EventCreator = ({ onEventCreate, onClose, initialEvent }: EventCreatorProps) => {
  const { toast } = useToast();
  const [eventData, setEventData] = useState<EventData>({
    title: initialEvent?.title || "",
    description: initialEvent?.description || "",
    date: initialEvent?.date || "",
    time: initialEvent?.time || "",
    location: initialEvent?.location || "",
    maxAttendees: initialEvent?.maxAttendees || undefined,
    isVirtual: initialEvent?.isVirtual || false,
    virtualLink: initialEvent?.virtualLink || ""
  });

  const updateField = (field: keyof EventData, value: any) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateEvent = () => {
    if (!eventData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter an event title.",
        variant: "destructive"
      });
      return;
    }

    if (!eventData.date) {
      toast({
        title: "Date required",
        description: "Please select an event date.",
        variant: "destructive"
      });
      return;
    }

    if (!eventData.time) {
      toast({
        title: "Time required",
        description: "Please select an event time.",
        variant: "destructive"
      });
      return;
    }

    if (!eventData.isVirtual && !eventData.location.trim()) {
      toast({
        title: "Location required",
        description: "Please enter a location for in-person events.",
        variant: "destructive"
      });
      return;
    }

    if (eventData.isVirtual && !eventData.virtualLink?.trim()) {
      toast({
        title: "Virtual link required",
        description: "Please provide a link for virtual events.",
        variant: "destructive"
      });
      return;
    }

    onEventCreate(eventData);
    toast({
      title: "Event created!",
      description: "Your event has been added to the post.",
    });
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            <span>Create Event</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Event Title */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Event Title *
          </label>
          <Input
            placeholder="Enter event title..."
            value={eventData.title}
            onChange={(e) => updateField('title', e.target.value)}
          />
        </div>

        {/* Event Description */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Description
          </label>
          <Textarea
            placeholder="Describe your event..."
            value={eventData.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={eventData.date}
                min={today}
                onChange={(e) => updateField('date', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Time *
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="time"
                value={eventData.time}
                onChange={(e) => updateField('time', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Event Type */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Event Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={!eventData.isVirtual}
                onChange={() => updateField('isVirtual', false)}
                className="mr-2"
              />
              In-person
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={eventData.isVirtual}
                onChange={() => updateField('isVirtual', true)}
                className="mr-2"
              />
              Virtual
            </label>
          </div>
        </div>

        {/* Location or Virtual Link */}
        {eventData.isVirtual ? (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Virtual Meeting Link *
            </label>
            <Input
              placeholder="https://zoom.us/j/..."
              value={eventData.virtualLink}
              onChange={(e) => updateField('virtualLink', e.target.value)}
            />
          </div>
        ) : (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Enter event location..."
                value={eventData.location}
                onChange={(e) => updateField('location', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Max Attendees */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Maximum Attendees (optional)
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="number"
              placeholder="No limit"
              value={eventData.maxAttendees || ""}
              onChange={(e) => updateField('maxAttendees', e.target.value ? Number(e.target.value) : undefined)}
              className="pl-10"
              min="1"
            />
          </div>
        </div>

        {/* Create Button */}
        <Button
          onClick={handleCreateEvent}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white"
        >
          Create Event
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCreator;
