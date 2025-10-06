
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Camera, Shield, CheckCircle, AlertCircle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IDVerificationFlowProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const IDVerificationFlow = ({ onComplete, onCancel }: IDVerificationFlowProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    documentType: '',
    documentNumber: '',
    fullName: '',
    dateOfBirth: '',
    expiryDate: '',
    frontImage: null as File | null,
    backImage: null as File | null,
    selfieImage: null as File | null
  });
  const [uploading, setUploading] = useState(false);

  const documentTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'driving_license', label: 'Driving License' },
    { value: 'national_id', label: 'National ID Card' },
    { value: 'residence_permit', label: 'Residence Permit' }
  ];

  const handleFileUpload = (field: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setFormData(prev => ({ ...prev, [field]: file }));
    toast({
      title: "Image uploaded",
      description: "Your document image has been uploaded successfully"
    });
  };

  const handleSubmit = async () => {
    if (!formData.frontImage || !formData.backImage || !formData.selfieImage) {
      toast({
        title: "Missing documents",
        description: "Please upload all required documents",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { user } = (await supabase.auth.getUser()).data;
      
      if (!user) throw new Error('User not authenticated');

      // First create the verification record
      const { data: verification, error: verificationError } = await supabase
        .from('user_verifications')
        .insert({
          user_id: user.id,
          verification_type: 'government_id',
          verification_data: {
            documentType: formData.documentType,
            documentNumber: formData.documentNumber,
            fullName: formData.fullName,
            dateOfBirth: formData.dateOfBirth,
            expiryDate: formData.expiryDate
          }
        })
        .select()
        .single();

      if (verificationError) throw verificationError;

      // Upload files to storage
      const uploadPromises = [
        { file: formData.frontImage, type: 'id_front' },
        { file: formData.backImage, type: 'id_back' },
        { file: formData.selfieImage, type: 'selfie' }
      ].map(async ({ file, type }) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${verification.id}/${type}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('id-verifications')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Record document in database
        const { error: docError } = await supabase
          .from('verification_documents')
          .insert({
            verification_id: verification.id,
            user_id: user.id,
            document_type: type,
            file_path: fileName,
            file_name: file.name,
            file_size: file.size,
            mime_type: file.type
          });

        if (docError) throw docError;
      });

      await Promise.all(uploadPromises);

      toast({
        title: "Verification submitted",
        description: "Your ID verification has been submitted for review. We'll notify you within 24-48 hours."
      });

      onComplete({
        verificationId: verification.id,
        documentType: formData.documentType,
        fullName: formData.fullName,
        submitted: true
      });
    } catch (error: any) {
      console.error('Verification submission error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error submitting your verification. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">ID Verification</h3>
              <p className="text-gray-600">
                Verify your identity to increase your trust score and access premium features
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Document Type</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, documentType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Document Number</Label>
                <Input
                  value={formData.documentNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, documentNumber: e.target.value }))}
                  placeholder="Enter document number"
                />
              </div>

              <div>
                <Label>Full Name (as shown on document)</Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Expiry Date</Label>
                  <Input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Camera className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Document Photos</h3>
              <p className="text-gray-600">
                Please upload clear photos of your document and a selfie
              </p>
            </div>

            <div className="grid gap-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium mb-1">Document Front</p>
                {formData.frontImage && (
                  <div className="mb-2">
                    <img 
                      src={URL.createObjectURL(formData.frontImage)} 
                      alt="ID Front Preview" 
                      className="max-h-32 mx-auto rounded"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('frontImage', e.target.files[0])}
                  className="hidden"
                  id="front-upload"
                />
                <Label htmlFor="front-upload" className="cursor-pointer text-blue-600 hover:underline">
                  {formData.frontImage ? 'Change file' : 'Choose file'}
                </Label>
                {formData.frontImage && (
                  <div className="flex items-center justify-center mt-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-xs text-green-600 ml-1">Uploaded</span>
                  </div>
                )}
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium mb-1">Document Back</p>
                {formData.backImage && (
                  <div className="mb-2">
                    <img 
                      src={URL.createObjectURL(formData.backImage)} 
                      alt="ID Back Preview" 
                      className="max-h-32 mx-auto rounded"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('backImage', e.target.files[0])}
                  className="hidden"
                  id="back-upload"
                />
                <Label htmlFor="back-upload" className="cursor-pointer text-blue-600 hover:underline">
                  {formData.backImage ? 'Change file' : 'Choose file'}
                </Label>
                {formData.backImage && (
                  <div className="flex items-center justify-center mt-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-xs text-green-600 ml-1">Uploaded</span>
                  </div>
                )}
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium mb-1">Selfie Photo</p>
                {formData.selfieImage && (
                  <div className="mb-2">
                    <img 
                      src={URL.createObjectURL(formData.selfieImage)} 
                      alt="Selfie Preview" 
                      className="max-h-32 mx-auto rounded"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('selfieImage', e.target.files[0])}
                  className="hidden"
                  id="selfie-upload"
                />
                <Label htmlFor="selfie-upload" className="cursor-pointer text-blue-600 hover:underline">
                  {formData.selfieImage ? 'Retake selfie' : 'Take selfie'}
                </Label>
                {formData.selfieImage && (
                  <div className="flex items-center justify-center mt-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-xs text-green-600 ml-1">Uploaded</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Tips for better verification:</p>
                  <ul className="mt-1 text-blue-800 space-y-1">
                    <li>• Ensure all text is clearly visible</li>
                    <li>• Avoid glare and shadows</li>
                    <li>• Keep the document flat</li>
                    <li>• Face the camera directly for selfie</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    if (step === 1) {
      return formData.documentType && formData.documentNumber && formData.fullName && formData.dateOfBirth;
    }
    if (step === 2) {
      return formData.frontImage && formData.backImage && formData.selfieImage;
    }
    return false;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>ID Verification - Step {step} of 2</span>
          <div className="flex space-x-1">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderStep()}
        
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={step === 1 ? onCancel : () => setStep(step - 1)}>
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          
          {step < 2 ? (
            <Button 
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
            >
              Continue
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={!canProceed() || uploading}
            >
              {uploading ? 'Submitting...' : 'Submit Verification'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IDVerificationFlow;
