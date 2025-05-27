
import { Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MotivationSectionProps {
  motivation: string;
  handleInputChange: (field: string, value: string) => void;
}

const MotivationSection = ({ motivation, handleInputChange }: MotivationSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <Shield className="h-6 w-6 text-teal-600" />
        <h3 className="text-xl font-semibold text-gray-900">Your Why</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="motivation" className="text-gray-700">What motivates you to help others?</Label>
        <Textarea
          id="motivation"
          value={motivation}
          onChange={(e) => handleInputChange("motivation", e.target.value)}
          className="border-gray-300 focus:border-teal-500 min-h-[120px]"
          placeholder="Share what drives your passion for helping your community..."
        />
      </div>
    </div>
  );
};

export default MotivationSection;
