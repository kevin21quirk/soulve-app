
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { PostFormData } from "@/components/dashboard/CreatePostTypes";

interface PostSchedulerProps {
  formData: PostFormData;
  onFormDataChange: (field: keyof PostFormData, value: any) => void;
}

const PostScheduler = ({ formData, onFormDataChange }: PostSchedulerProps) => {
  const [showSchedule, setShowSchedule] = useState(false);

  return (
    <div>
      <div className="flex items-center space-x-2 mb-2">
        <Switch
          checked={showSchedule}
          onCheckedChange={setShowSchedule}
        />
        <label className="text-sm font-medium text-gray-700">Schedule for later</label>
      </div>
      
      {showSchedule && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal" type="button">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.scheduledFor ? format(formData.scheduledFor, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.scheduledFor}
              onSelect={(date) => onFormDataChange('scheduledFor', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default PostScheduler;
