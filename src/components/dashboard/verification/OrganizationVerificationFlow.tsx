
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Building, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrganizationVerificationFlowProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const OrganizationVerificationFlow = ({ onComplete, onCancel }: OrganizationVerificationFlowProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    organizationType: '',
    organizationName: '',
    registrationNumber: '',
    establishedYear: '',
    website: '',
    description: '',
    mission: '',
    charityNumber: '',
    taxExemptStatus: '',
    registrationDocument: null as File | null,
    proofOfAddress: null as File | null,
    boardMembers: [''],
    contactEmail: '',
    contactPhone: ''
  });
  const [uploading, setUploading] = useState(false);

  const organizationTypes = [
    { value: 'charity', label: 'Registered Charity' },
    { value: 'nonprofit', label: 'Non-Profit Organization' },
    { value: 'cic', label: 'Community Interest Company' },
    { value: 'social_enterprise', label: 'Social Enterprise' },
    { value: 'foundation', label: 'Foundation' },
    { value: 'community_group', label: 'Community Group' }
  ];

  const handleFileUpload = (field: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setFormData(prev => ({ ...prev, [field]: file }));
    toast({
      title: "Document uploaded",
      description: `Your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} has been uploaded successfully`
    });
  };

  const addBoardMember = () => {
    setFormData(prev => ({
      ...prev,
      boardMembers: [...prev.boardMembers, '']
    }));
  };

  const updateBoardMember = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      boardMembers: prev.boardMembers.map((member, i) => i === index ? value : member)
    }));
  };

  const removeBoardMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      boardMembers: prev.boardMembers.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.organizationType || !formData.organizationName || !formData.registrationNumber) {
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
        organizationType: formData.organizationType,
        organizationName: formData.organizationName,
        registrationNumber: formData.registrationNumber,
        establishedYear: parseInt(formData.establishedYear) || null,
        website: formData.website,
        description: formData.description,
        mission: formData.mission,
        charityNumber: formData.charityNumber,
        taxExemptStatus: formData.taxExemptStatus,
        boardMembers: formData.boardMembers.filter(member => member.trim()),
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        hasRegistrationDoc: !!formData.registrationDocument,
        hasProofOfAddress: !!formData.proofOfAddress
      });

      toast({
        title: "Organization verification submitted",
        description: "Your organization verification has been submitted for review"
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
          <Building className="h-5 w-5 text-blue-600" />
          Organization Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-gray-600">
            Verify your organization to access special features and increase community trust
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Organization Type *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, organizationType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select organization type" />
              </SelectTrigger>
              <SelectContent>
                {organizationTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Organization Name *</Label>
            <Input
              value={formData.organizationName}
              onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
              placeholder="Enter organization name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Registration Number *</Label>
              <Input
                value={formData.registrationNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                placeholder="12345678"
              />
            </div>
            <div>
              <Label>Established Year</Label>
              <Input
                type="number"
                value={formData.establishedYear}
                onChange={(e) => setFormData(prev => ({ ...prev, establishedYear: e.target.value }))}
                placeholder="2020"
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          {(formData.organizationType === 'charity' || formData.organizationType === 'nonprofit') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Charity Number</Label>
                <Input
                  value={formData.charityNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, charityNumber: e.target.value }))}
                  placeholder="1234567"
                />
              </div>
              <div>
                <Label>Tax Exempt Status</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, taxExemptStatus: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="501c3">501(c)(3)</SelectItem>
                    <SelectItem value="exempt">Tax Exempt</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="none">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div>
            <Label>Website</Label>
            <Input
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              placeholder="https://yourorganization.org"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of your organization's work..."
              rows={3}
            />
          </div>

          <div>
            <Label>Mission Statement</Label>
            <Textarea
              value={formData.mission}
              onChange={(e) => setFormData(prev => ({ ...prev, mission: e.target.value }))}
              placeholder="Your organization's mission..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Contact Email</Label>
              <Input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="contact@organization.org"
              />
            </div>
            <div>
              <Label>Contact Phone</Label>
              <Input
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                placeholder="+44 20 1234 5678"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Board Members/Key Personnel</Label>
              <Button type="button" variant="outline" size="sm" onClick={addBoardMember}>
                Add Member
              </Button>
            </div>
            <div className="space-y-2">
              {formData.boardMembers.map((member, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={member}
                    onChange={(e) => updateBoardMember(index, e.target.value)}
                    placeholder="Name and role"
                  />
                  {formData.boardMembers.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeBoardMember(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Registration Document *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('registrationDocument', e.target.files[0])}
                  className="hidden"
                  id="registration-upload"
                />
                <Label htmlFor="registration-upload" className="cursor-pointer text-blue-600 hover:underline text-sm">
                  {formData.registrationDocument ? formData.registrationDocument.name : 'Upload Document'}
                </Label>
                {formData.registrationDocument && (
                  <CheckCircle className="h-4 w-4 text-green-600 mx-auto mt-1" />
                )}
              </div>
            </div>

            <div>
              <Label>Proof of Address</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('proofOfAddress', e.target.files[0])}
                  className="hidden"
                  id="address-upload"
                />
                <Label htmlFor="address-upload" className="cursor-pointer text-blue-600 hover:underline text-sm">
                  {formData.proofOfAddress ? formData.proofOfAddress.name : 'Upload Document'}
                </Label>
                {formData.proofOfAddress && (
                  <CheckCircle className="h-4 w-4 text-green-600 mx-auto mt-1" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-orange-900">Verification Requirements:</p>
              <ul className="mt-1 text-orange-800 space-y-1">
                <li>• Organization must be legally registered</li>
                <li>• Documents will be verified with official registries</li>
                <li>• Process may take 5-10 business days</li>
                <li>• Additional documentation may be requested</li>
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
            disabled={!formData.organizationType || !formData.organizationName || !formData.registrationNumber || uploading}
          >
            {uploading ? 'Submitting...' : 'Submit for Verification'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationVerificationFlow;
