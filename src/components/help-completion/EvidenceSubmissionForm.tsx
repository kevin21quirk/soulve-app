
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, MapPin, Clock, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EvidenceSubmissionFormProps {
  completionRequestId: string;
  onSubmit: (evidence: any) => void;
  onCancel: () => void;
}

const EvidenceSubmissionForm = ({ completionRequestId, onSubmit, onCancel }: EvidenceSubmissionFormProps) => {
  const [evidenceType, setEvidenceType] = useState<string>('');
  const [files, setFiles] = useState<string[]>([]);
  const [newFileUrl, setNewFileUrl] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addFile = () => {
    if (newFileUrl.trim()) {
      setFiles([...files, newFileUrl.trim()]);
      setNewFileUrl('');
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!evidenceType || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select evidence type and provide a description.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const evidenceData = {
        type: evidenceType,
        files,
        description,
        location,
        timeSpent,
        submittedAt: new Date().toISOString(),
        metadata: {
          evidenceType,
          fileCount: files.length,
          hasLocation: !!location,
          hasTimeTracking: !!timeSpent
        }
      };

      await onSubmit(evidenceData);
      
      toast({
        title: "Evidence Submitted",
        description: "Your evidence has been submitted for review."
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit evidence. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Submit Evidence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="evidence-type">Evidence Type *</Label>
          <Select value={evidenceType} onValueChange={setEvidenceType}>
            <SelectTrigger>
              <SelectValue placeholder="Select evidence type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="photo">
                <div className="flex items-center space-x-2">
                  <Camera className="h-4 w-4" />
                  <span>Photo Documentation</span>
                </div>
              </SelectItem>
              <SelectItem value="document">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Document/Receipt</span>
                </div>
              </SelectItem>
              <SelectItem value="location">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Location Proof</span>
                </div>
              </SelectItem>
              <SelectItem value="time_tracking">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Time Tracking</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe what you did and how this evidence proves completion..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>File URLs</Label>
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/evidence.jpg"
              value={newFileUrl}
              onChange={(e) => setNewFileUrl(e.target.value)}
            />
            <Button type="button" onClick={addFile} disabled={!newFileUrl.trim()}>
              <Upload className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm truncate">{file}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Where did this take place?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time-spent">Time Spent</Label>
            <Select value={timeSpent} onValueChange={setTimeSpent}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15min">15 minutes</SelectItem>
                <SelectItem value="30min">30 minutes</SelectItem>
                <SelectItem value="1hour">1 hour</SelectItem>
                <SelectItem value="2hours">2 hours</SelectItem>
                <SelectItem value="4hours">4+ hours</SelectItem>
                <SelectItem value="full_day">Full day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Evidence"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EvidenceSubmissionForm;
