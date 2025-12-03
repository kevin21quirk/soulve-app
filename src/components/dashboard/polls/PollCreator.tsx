
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, BarChart3, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollData {
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
  duration: number; // in hours
}

interface PollCreatorProps {
  onPollCreate: (poll: PollData) => void;
  onClose: () => void;
  initialPoll?: Partial<PollData>;
}

const PollCreator = ({ onPollCreate, onClose, initialPoll }: PollCreatorProps) => {
  const { toast } = useToast();
  const [pollData, setPollData] = useState<PollData>({
    question: initialPoll?.question || "",
    options: initialPoll?.options || [
      { id: "1", text: "", votes: 0 },
      { id: "2", text: "", votes: 0 }
    ],
    allowMultiple: initialPoll?.allowMultiple || false,
    duration: initialPoll?.duration || 24
  });

  const updateQuestion = (question: string) => {
    setPollData(prev => ({ ...prev, question }));
  };

  const updateOption = (id: string, text: string) => {
    setPollData(prev => ({
      ...prev,
      options: prev.options.map(opt => 
        opt.id === id ? { ...opt, text } : opt
      )
    }));
  };

  const addOption = () => {
    if (pollData.options.length >= 6) {
      toast({
        title: "Maximum options reached",
        description: "You can add up to 6 poll options.",
        variant: "destructive"
      });
      return;
    }

    const newOption: PollOption = {
      id: Date.now().toString(),
      text: "",
      votes: 0
    };

    setPollData(prev => ({
      ...prev,
      options: [...prev.options, newOption]
    }));
  };

  const removeOption = (id: string) => {
    if (pollData.options.length <= 2) {
      toast({
        title: "Minimum options required",
        description: "A poll must have at least 2 options.",
        variant: "destructive"
      });
      return;
    }

    setPollData(prev => ({
      ...prev,
      options: prev.options.filter(opt => opt.id !== id)
    }));
  };

  const toggleMultipleChoice = () => {
    setPollData(prev => ({ ...prev, allowMultiple: !prev.allowMultiple }));
  };

  const updateDuration = (duration: number) => {
    setPollData(prev => ({ ...prev, duration }));
  };

  const handleCreatePoll = () => {
    if (!pollData.question.trim()) {
      toast({
        title: "Question required",
        description: "Please enter a poll question.",
        variant: "destructive"
      });
      return;
    }

    const validOptions = pollData.options.filter(opt => opt.text.trim());
    if (validOptions.length < 2) {
      toast({
        title: "Insufficient options",
        description: "Please provide at least 2 poll options.",
        variant: "destructive"
      });
      return;
    }

    const finalPollData = {
      ...pollData,
      options: validOptions
    };

    onPollCreate(finalPollData);
    toast({
      title: "Poll created!",
      description: "Your poll has been added to the post.",
    });
  };

  const durationOptions = [
    { value: 1, label: "1 hour" },
    { value: 6, label: "6 hours" },
    { value: 12, label: "12 hours" },
    { value: 24, label: "1 day" },
    { value: 72, label: "3 days" },
    { value: 168, label: "1 week" }
  ];

  return (
    <Card className="w-full max-w-md max-h-[85vh] flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <span>Create Poll</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 overflow-y-auto flex-1">
        {/* Poll Question */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Poll Question
          </label>
          <Input
            placeholder="Ask a question..."
            value={pollData.question}
            onChange={(e) => updateQuestion(e.target.value)}
          />
        </div>

        {/* Poll Options */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Options
          </label>
          
          {pollData.options.map((option, index) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Input
                placeholder={`Option ${index + 1}`}
                value={option.text}
                onChange={(e) => updateOption(option.id, e.target.value)}
                className="flex-1"
              />
              {pollData.options.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(option.id)}
                  className="p-2 h-9 w-9"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          {pollData.options.length < 6 && (
            <Button
              variant="outline"
              size="sm"
              onClick={addOption}
              className="w-full mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          )}
        </div>

        {/* Poll Settings */}
        <div className="space-y-3 pt-2 border-t">
          {/* Multiple Choice */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Allow multiple selections
            </label>
            <button
              onClick={toggleMultipleChoice}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                pollData.allowMultiple ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  pollData.allowMultiple ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Poll Duration */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Poll Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {durationOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateDuration(option.value)}
                  className={`text-xs py-2 px-3 rounded border transition-colors ${
                    pollData.duration === option.value
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Create Button */}
        <Button
          onClick={handleCreatePoll}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          Create Poll
        </Button>
      </CardContent>
    </Card>
  );
};

export default PollCreator;
