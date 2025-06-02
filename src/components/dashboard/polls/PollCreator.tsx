
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, BarChart3 } from "lucide-react";
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
  duration: number; // hours
}

interface PollCreatorProps {
  onPollCreate: (poll: PollData) => void;
  onClose: () => void;
  initialPoll?: Partial<PollData>;
}

const PollCreator = ({ onPollCreate, onClose, initialPoll }: PollCreatorProps) => {
  const { toast } = useToast();
  const [question, setQuestion] = useState(initialPoll?.question || "");
  const [options, setOptions] = useState<PollOption[]>(
    initialPoll?.options || [
      { id: "1", text: "", votes: 0 },
      { id: "2", text: "", votes: 0 }
    ]
  );
  const [allowMultiple, setAllowMultiple] = useState(initialPoll?.allowMultiple || false);
  const [duration, setDuration] = useState(initialPoll?.duration || 24);

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, { id: Date.now().toString(), text: "", votes: 0 }]);
    }
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(option => option.id !== id));
    }
  };

  const updateOption = (id: string, text: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, text } : option
    ));
  };

  const handleCreatePoll = () => {
    if (!question.trim()) {
      toast({
        title: "Question required",
        description: "Please enter a poll question.",
        variant: "destructive"
      });
      return;
    }

    const validOptions = options.filter(option => option.text.trim());
    if (validOptions.length < 2) {
      toast({
        title: "Not enough options",
        description: "Please provide at least 2 poll options.",
        variant: "destructive"
      });
      return;
    }

    const pollData: PollData = {
      question: question.trim(),
      options: validOptions,
      allowMultiple,
      duration
    };

    onPollCreate(pollData);
    toast({
      title: "Poll created!",
      description: "Your poll has been added to the post.",
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
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
      
      <CardContent className="space-y-4">
        {/* Poll Question */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Poll Question
          </label>
          <Input
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Poll Options */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Poll Options
          </label>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => updateOption(option.id, e.target.value)}
                  className="flex-1"
                />
                {options.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(option.id)}
                    className="text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          {options.length < 10 && (
            <Button
              variant="outline"
              size="sm"
              onClick={addOption}
              className="mt-2 w-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Option
            </Button>
          )}
        </div>

        {/* Poll Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Allow multiple selections
            </label>
            <input
              type="checkbox"
              checked={allowMultiple}
              onChange={(e) => setAllowMultiple(e.target.checked)}
              className="rounded"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Poll Duration (hours)
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            >
              <option value={1}>1 hour</option>
              <option value={6}>6 hours</option>
              <option value={12}>12 hours</option>
              <option value={24}>24 hours</option>
              <option value={72}>3 days</option>
              <option value={168}>1 week</option>
            </select>
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
