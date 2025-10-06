import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bug, Sparkles, Palette, Zap, MessageSquare, Camera, CheckCircle2 } from "lucide-react";
import { useSubmitFeedback, FeedbackSubmission } from "@/hooks/useSubmitFeedback";

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const feedbackTypes = [
  { id: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-500' },
  { id: 'feature_request', label: 'Feature Request', icon: Sparkles, color: 'text-purple-500' },
  { id: 'ui_issue', label: 'UI/Design Issue', icon: Palette, color: 'text-pink-500' },
  { id: 'performance', label: 'Performance Problem', icon: Zap, color: 'text-yellow-500' },
  { id: 'general', label: 'General Feedback', icon: MessageSquare, color: 'text-blue-500' },
];

const pageSections = [
  'Feed', 'Profile', 'Messaging', 'Connections', 'Campaign Builder', 
  'Settings', 'Safe Space', 'Admin Dashboard', 'Other'
];

export const FeedbackModal = ({ open, onOpenChange }: FeedbackModalProps) => {
  const [step, setStep] = useState<'type' | 'form' | 'success'>('type');
  const [selectedType, setSelectedType] = useState<FeedbackSubmission['feedback_type']>('bug');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pageSection, setPageSection] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const { mutate: submitFeedback, isPending } = useSubmitFeedback();

  const handleTypeSelect = (type: FeedbackSubmission['feedback_type']) => {
    setSelectedType(type);
    setStep('form');
  };

  const handleSubmit = () => {
    submitFeedback(
      {
        feedback_type: selectedType,
        title,
        description,
        page_section: pageSection,
        screenshot: screenshot || undefined,
        urgency,
      },
      {
        onSuccess: () => {
          setStep('success');
          setTimeout(() => {
            handleClose();
          }, 3000);
        },
      }
    );
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep('type');
      setTitle('');
      setDescription('');
      setPageSection('');
      setUrgency('medium');
      setScreenshot(null);
    }, 300);
  };

  const handleScreenshotCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {step === 'type' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Help Us Improve SouLVE 🚀</DialogTitle>
              <DialogDescription>
                Your feedback shapes the platform. What would you like to share?
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-3 mt-4">
              {feedbackTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.id}
                    variant="outline"
                    className="h-auto py-4 justify-start hover:bg-accent/50 transition-colors"
                    onClick={() => handleTypeSelect(type.id as FeedbackSubmission['feedback_type'])}
                  >
                    <Icon className={`h-5 w-5 mr-3 ${type.color}`} />
                    <span className="text-left font-medium">{type.label}</span>
                  </Button>
                );
              })}
            </div>
          </>
        )}

        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle>Share Your Feedback</DialogTitle>
              <DialogDescription>
                Help us understand the issue or suggestion
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide as much detail as possible..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={1000}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="section">Which part of the platform?</Label>
                <Select value={pageSection} onValueChange={setPageSection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {pageSections.map((section) => (
                      <SelectItem key={section} value={section}>
                        {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedType === 'bug' && (
                <div>
                  <Label htmlFor="urgency">Urgency</Label>
                  <Select value={urgency} onValueChange={(v: any) => setUrgency(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="screenshot">Screenshot (optional)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="screenshot"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleScreenshotCapture}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('screenshot')?.click()}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {screenshot ? 'Change Screenshot' : 'Upload Screenshot'}
                  </Button>
                  {screenshot && (
                    <span className="text-sm text-muted-foreground truncate">
                      {screenshot.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep('type')} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!title || !description || isPending}
                  className="flex-1"
                >
                  {isPending ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'success' && (
          <div className="py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <DialogTitle className="text-2xl mb-2">Thank You! 🎉</DialogTitle>
            <DialogDescription className="text-base">
              Your feedback has been received. You earned 10 XP!
              <br />
              We'll review it and keep you updated.
            </DialogDescription>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
