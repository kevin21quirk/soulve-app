
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnhancedPoints } from '@/hooks/useEnhancedPoints';
import { Camera, Upload, MapPin, Clock } from 'lucide-react';

interface EvidenceSubmissionDialogProps {
  activityId: string;
  activityDescription: string;
  children?: React.ReactNode;
}

const EvidenceSubmissionDialog = ({ 
  activityId, 
  activityDescription, 
  children 
}: EvidenceSubmissionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [evidenceType, setEvidenceType] = useState<string>('');
  const [fileUrl, setFileUrl] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { submitEvidence } = useEnhancedPoints();

  const handleSubmit = async () => {
    if (!evidenceType) return;

    setLoading(true);
    try {
      const metadata: Record<string, any> = {
        description,
        submitted_at: new Date().toISOString()
      };

      if (location) metadata.location = location;
      if (evidenceType === 'geolocation') {
        // Try to get current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            metadata.coordinates = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy
            };
          });
        }
      }

      await submitEvidence(activityId, evidenceType, fileUrl || undefined, metadata);
      setOpen(false);
      
      // Reset form
      setEvidenceType('');
      setFileUrl('');
      setDescription('');
      setLocation('');
    } catch (error) {
      console.error('Error submitting evidence:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" variant="outline">
            <Camera className="h-4 w-4 mr-2" />
            Submit Evidence
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Evidence</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Activity: <strong>{activityDescription}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Please provide evidence to verify this activity and maintain your trust score.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="evidence-type">Evidence Type</Label>
            <Select value={evidenceType} onValueChange={setEvidenceType}>
              <SelectTrigger>
                <SelectValue placeholder="Select evidence type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="photo">
                  <div className="flex items-center space-x-2">
                    <Camera className="h-4 w-4" />
                    <span>Photo</span>
                  </div>
                </SelectItem>
                <SelectItem value="document">
                  <div className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Document</span>
                  </div>
                </SelectItem>
                <SelectItem value="geolocation">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Location</span>
                  </div>
                </SelectItem>
                <SelectItem value="timestamp">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Timestamp</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(evidenceType === 'photo' || evidenceType === 'document') && (
            <div className="space-y-2">
              <Label htmlFor="file-url">File URL</Label>
              <Input
                id="file-url"
                type="url"
                placeholder="https://example.com/evidence.jpg"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Upload your file to a service like Imgur or Google Drive and paste the link here.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              placeholder="Where did this activity take place?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the evidence and how it verifies your activity..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !evidenceType}
            >
              {loading ? "Submitting..." : "Submit Evidence"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EvidenceSubmissionDialog;
