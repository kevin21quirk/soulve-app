
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Award, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SkillVerificationFlowProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const SkillVerificationFlow = ({ onComplete, onCancel }: SkillVerificationFlowProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    skillCategory: '',
    skillName: '',
    proficiencyLevel: '',
    certificateUrl: null as File | null,
    portfolioUrls: [''],
    experienceYears: '',
    description: ''
  });
  const [uploading, setUploading] = useState(false);

  const skillCategories = [
    { value: 'technical', label: 'Technical Skills' },
    { value: 'creative', label: 'Creative Skills' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education & Training' },
    { value: 'trades', label: 'Trades & Crafts' },
    { value: 'professional', label: 'Professional Services' }
  ];

  const proficiencyLevels = [
    { value: 'beginner', label: 'Beginner (0-2 years)' },
    { value: 'intermediate', label: 'Intermediate (2-5 years)' },
    { value: 'advanced', label: 'Advanced (5-10 years)' },
    { value: 'expert', label: 'Expert (10+ years)' }
  ];

  const handleFileUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setFormData(prev => ({ ...prev, certificateUrl: file }));
    toast({
      title: "Certificate uploaded",
      description: "Your certificate has been uploaded successfully"
    });
  };

  const addPortfolioUrl = () => {
    setFormData(prev => ({
      ...prev,
      portfolioUrls: [...prev.portfolioUrls, '']
    }));
  };

  const updatePortfolioUrl = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      portfolioUrls: prev.portfolioUrls.map((url, i) => i === index ? value : url)
    }));
  };

  const removePortfolioUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      portfolioUrls: prev.portfolioUrls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.skillCategory || !formData.skillName || !formData.proficiencyLevel) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onComplete({
        skillCategory: formData.skillCategory,
        skillName: formData.skillName,
        proficiencyLevel: formData.proficiencyLevel,
        experienceYears: parseInt(formData.experienceYears) || 0,
        description: formData.description,
        portfolioUrls: formData.portfolioUrls.filter(url => url.trim()),
        hasCertificate: !!formData.certificateUrl
      });

      toast({
        title: "Skill verification submitted",
        description: "Your skill verification has been submitted for review"
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your verification",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-blue-600" />
          Skill Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-gray-600">
            Verify your skills to increase your trust score and help others find the right expertise
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Skill Category *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, skillCategory: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select skill category" />
              </SelectTrigger>
              <SelectContent>
                {skillCategories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Skill Name *</Label>
            <Input
              value={formData.skillName}
              onChange={(e) => setFormData(prev => ({ ...prev, skillName: e.target.value }))}
              placeholder="e.g., Web Development, Graphic Design, First Aid"
            />
          </div>

          <div>
            <Label>Proficiency Level *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, proficiencyLevel: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select your level" />
              </SelectTrigger>
              <SelectContent>
                {proficiencyLevels.map(level => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Years of Experience</Label>
            <Input
              type="number"
              value={formData.experienceYears}
              onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: e.target.value }))}
              placeholder="Enter years of experience"
              min="0"
              max="50"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your experience and expertise in this skill..."
              rows={4}
            />
          </div>

          <div>
            <Label>Certificate/Qualification (Optional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
                id="certificate-upload"
              />
              <Label htmlFor="certificate-upload" className="cursor-pointer text-blue-600 hover:underline">
                {formData.certificateUrl ? formData.certificateUrl.name : 'Upload Certificate'}
              </Label>
              {formData.certificateUrl && (
                <CheckCircle className="h-5 w-5 text-green-600 mx-auto mt-2" />
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Portfolio URLs (Optional)</Label>
              <Button type="button" variant="outline" size="sm" onClick={addPortfolioUrl}>
                Add URL
              </Button>
            </div>
            <div className="space-y-2">
              {formData.portfolioUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => updatePortfolioUrl(index, e.target.value)}
                    placeholder="https://example.com/portfolio"
                  />
                  {formData.portfolioUrls.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePortfolioUrl(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">Verification Process:</p>
              <ul className="mt-1 text-blue-800 space-y-1">
                <li>• Skills are reviewed by community experts</li>
                <li>• Process typically takes 2-3 business days</li>
                <li>• You may be contacted for additional verification</li>
                <li>• Verified skills increase your trust score</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          
          <Button 
            onClick={handleSubmit}
            disabled={!formData.skillCategory || !formData.skillName || !formData.proficiencyLevel || uploading}
          >
            {uploading ? 'Submitting...' : 'Submit for Verification'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillVerificationFlow;
