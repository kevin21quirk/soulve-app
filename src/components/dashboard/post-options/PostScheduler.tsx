
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { PostFormData } from "../CreatePostTypes";

interface PostSchedulerProps {
  formData: PostFormData;
  onFormDataChange: (field: keyof PostFormData, value: any) => void;
}

const PostScheduler = ({ formData, onFormDataChange }: PostSchedulerProps) => {
  const [scheduleEnabled, setScheduleEnabled] = useState(false);

  const handleScheduleToggle = (enabled: boolean) => {
    setScheduleEnabled(enabled);
    if (!enabled) {
      onFormDataChange('scheduledFor', undefined);
    }
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    onFormDataChange('scheduledFor', date);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="schedule-post" className="text-sm font-medium flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Schedule post</span>
        </Label>
        <Switch
          id="schedule-post"
          checked={scheduleEnabled}
          onCheckedChange={handleScheduleToggle}
        />
      </div>

      {scheduleEnabled && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Schedule for
          </label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={new Date().toISOString().slice(0, 16)}
            onChange={handleDateTimeChange}
          />
        </div>
      )}
    </div>
  );
};

export default PostScheduler;
