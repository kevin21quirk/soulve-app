
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Camera, Shield, CheckCircle, AlertCircle, Eye, Scan } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  detectFaceInImage, 
  compareFaces, 
  performBasicLivenessCheck, 
  loadImageFromFile,
  type FaceDetectionResult,
  type LivenessCheckResult
} from "@/utils/faceDetection";

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
  const [faceData, setFaceData] = useState<{
    idFaceResult?: FaceDetectionResult;
    selfieFaceResult?: FaceDetectionResult;
    livenessResult?: LivenessCheckResult;
    matchScore?: number;
    processing: boolean;
  }>({
    processing: false
  });

  const documentTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'driving_license', label: 'Driving License' },
    { value: 'national_id', label: 'National ID Card' },
    { value: 'residence_permit', label: 'Residence Permit' }
  ];

  const handleFileUpload = async (field: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setFormData(prev => ({ ...prev, [field]: file }));
    
    // Perform face detection for ID front image and selfie
    if (field === 'frontImage' || field === 'selfieImage') {
      setFaceData(prev => ({ ...prev, processing: true }));
      
      try {
        const img = await loadImageFromFile(file);
        
        if (field === 'frontImage') {
          const faceResult = await detectFaceInImage(img);
          setFaceData(prev => ({ ...prev, idFaceResult: faceResult, processing: false }));
          
          if (!faceResult.detected) {
            toast({
              title: "No face detected",
              description: "Please upload a clear image showing your face on the ID",
              variant: "destructive"
            });
            return;
          }
          
          toast({
            title: "Face detected ✓",
            description: `Quality score: ${faceResult.qualityScore.toFixed(0)}%`
          });
        } else if (field === 'selfieImage') {
          // Perform liveness check on selfie
          const livenessResult = await performBasicLivenessCheck(img);
          const faceResult = await detectFaceInImage(img);
          
          setFaceData(prev => ({ 
            ...prev, 
            selfieFaceResult: faceResult, 
            livenessResult,
            processing: false 
          }));
          
          if (!livenessResult.passed) {
            toast({
              title: "Liveness check failed",
              description: "Please take a clear selfie with good lighting",
              variant: "destructive"
            });
            return;
          }
          
          toast({
            title: "Liveness check passed ✓",
            description: "Face detected successfully"
          });
        }
      } catch (error) {
        console.error('Face detection error:', error);
        setFaceData(prev => ({ ...prev, processing: false }));
        toast({
          title: "Processing error",
          description: "Unable to process image. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Image uploaded",
        description: "Your document image has been uploaded successfully"
      });
    }
  };

  // Compare faces when both ID and selfie are uploaded
  useEffect(() => {
    const compareIDAndSelfie = async () => {
      if (faceData.idFaceResult?.embedding && faceData.selfieFaceResult?.embedding) {
        try {
          const matchScore = compareFaces(
            faceData.idFaceResult.embedding,
            faceData.selfieFaceResult.embedding
          );
          
          setFaceData(prev => ({ ...prev, matchScore }));
          
          if (matchScore >= 0.6) {
            toast({
              title: "Face match successful ✓",
              description: `Match confidence: ${(matchScore * 100).toFixed(0)}%`,
            });
          } else {
            toast({
              title: "Low face match",
              description: "The faces don't match well. Please retake your photos.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Face comparison error:', error);
        }
      }
    };
    
    compareIDAndSelfie();
  }, [faceData.idFaceResult, faceData.selfieFaceResult]);

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

      // First create the verification record with face match data
      const { data: verification, error: verificationError } = await supabase
        .from('user_verifications')
        .insert({
          user_id: user.id,
          verification_type: 'government_id',
          face_match_score: faceData.matchScore,
          liveness_check_passed: faceData.livenessResult?.passed || false,
          face_embedding: faceData.selfieFaceResult?.embedding ? {
            embedding: faceData.selfieFaceResult.embedding,
            quality: faceData.selfieFaceResult.qualityScore
          } : null,
          verification_data: {
            documentType: formData.documentType,
            documentNumber: formData.documentNumber,
            fullName: formData.fullName,
            dateOfBirth: formData.dateOfBirth,
            expiryDate: formData.expiryDate,
            faceMatchScore: faceData.matchScore,
            livenessCheckPassed: faceData.livenessResult?.passed
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

        // Record document in database with face detection results
        const faceDetected = type === 'id_front' ? faceData.idFaceResult?.detected :
                           type === 'selfie' ? faceData.selfieFaceResult?.detected : false;
        const faceQuality = type === 'id_front' ? faceData.idFaceResult?.qualityScore :
                          type === 'selfie' ? faceData.selfieFaceResult?.qualityScore : null;
        
        const { error: docError } = await supabase
          .from('verification_documents')
          .insert({
            verification_id: verification.id,
            user_id: user.id,
            document_type: type,
            file_path: fileName,
            file_name: file.name,
            file_size: file.size,
            mime_type: file.type,
            face_detected: faceDetected,
            face_quality_score: faceQuality
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
                {faceData.processing && <p className="text-xs text-blue-600 mt-2 flex items-center justify-center gap-1"><Scan className="h-4 w-4 animate-pulse" />Detecting face...</p>}
                {formData.frontImage && faceData.idFaceResult && (
                  <div className="flex items-center justify-center mt-2 gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-xs text-green-600">
                      Face detected ({faceData.idFaceResult.qualityScore.toFixed(0)}%)
                    </span>
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
                {faceData.processing && <p className="text-xs text-blue-600 mt-2 flex items-center justify-center gap-1"><Scan className="h-4 w-4 animate-pulse" />Checking liveness...</p>}
                {formData.selfieImage && faceData.livenessResult && (
                  <div className="flex items-center justify-center mt-2 gap-2">
                    {faceData.livenessResult.passed ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-xs text-green-600">Liveness verified ✓</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <span className="text-xs text-red-600">Liveness check failed</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {faceData.matchScore !== undefined && (
                <div className={`p-4 rounded-lg ${faceData.matchScore >= 0.6 ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                  <div className="flex items-center gap-2">
                    {faceData.matchScore >= 0.6 ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    )}
                    <div>
                      <p className="font-medium text-sm">Face Match: {(faceData.matchScore * 100).toFixed(0)}%</p>
                      <p className="text-xs text-gray-600">
                        {faceData.matchScore >= 0.6 
                          ? 'Faces match! Your verification will be processed faster.' 
                          : 'Low match confidence. Manual review may take longer.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Scan className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">AI-Powered Face Verification:</p>
                  <ul className="mt-1 text-blue-800 space-y-1">
                    <li>• Ensure all text on ID is clearly visible</li>
                    <li>• Avoid glare and shadows</li>
                    <li>• Keep the document flat and in focus</li>
                    <li>• Face the camera directly for selfie</li>
                    <li>• Good lighting helps improve match accuracy</li>
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
