import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { HelperVerificationService } from '@/services/helperVerificationService';
import type {
  HelperApplication,
  TrainingModule,
  TrainingProgress,
  VerificationDocument,
  ReferenceCheck,
  ApplicationProgress
} from '@/types/helperVerification';

export const useHelperVerification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [application, setApplication] = useState<HelperApplication | null>(null);
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([]);
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress[]>([]);
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [references, setReferences] = useState<ReferenceCheck[]>([]);
  const [progress, setProgress] = useState<ApplicationProgress>({
    applicationSubmitted: false,
    identityVerified: false,
    backgroundCheckComplete: false,
    trainingComplete: false,
    referencesVerified: false,
    adminReviewed: false,
    overallProgress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAllData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAllData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [app, modules, progresses, prog] = await Promise.all([
        HelperVerificationService.getApplication(user.id),
        HelperVerificationService.getTrainingModules(),
        HelperVerificationService.getTrainingProgress(user.id),
        HelperVerificationService.calculateProgress(user.id)
      ]);

      setApplication(app);
      setTrainingModules(modules);
      setTrainingProgress(progresses);
      setProgress(prog);

      if (app) {
        const [docs, refs] = await Promise.all([
          HelperVerificationService.getDocuments(app.id),
          HelperVerificationService.getReferenceChecks(app.id)
        ]);
        setDocuments(docs);
        setReferences(refs);
      }
    } catch (error) {
      console.error('Error fetching verification data:', error);
      toast({
        title: "Error",
        description: "Failed to load verification data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createApplication = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to start an application.",
        variant: "destructive"
      });
      return null;
    }

    try {
      const newApp = await HelperVerificationService.createApplication(user.id);
      setApplication(newApp);
      toast({
        title: "Application Started",
        description: "Your helper application has been created."
      });
      return newApp;
    } catch (error) {
      console.error('Error creating application:', error);
      toast({
        title: "Error",
        description: "Failed to create application.",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateApplication = async (updates: Partial<HelperApplication>) => {
    if (!application) return null;

    try {
      const updated = await HelperVerificationService.updateApplication(
        application.id,
        updates
      );
      setApplication(updated);
      toast({
        title: "Application Updated",
        description: "Your changes have been saved."
      });
      return updated;
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application.",
        variant: "destructive"
      });
      return null;
    }
  };

  const submitApplication = async () => {
    if (!application || !user) return false;

    const canSubmit = await HelperVerificationService.canSubmitApplication(user.id);
    if (!canSubmit) {
      toast({
        title: "Incomplete Application",
        description: "Please complete all required fields before submitting.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const submitted = await HelperVerificationService.submitApplication(application.id);
      setApplication(submitted);
      await fetchAllData();
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted for review."
      });
      return true;
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application.",
        variant: "destructive"
      });
      return false;
    }
  };

  const uploadDocument = async (
    file: File,
    documentType: VerificationDocument['document_type']
  ) => {
    if (!application || !user) return null;

    try {
      const doc = await HelperVerificationService.uploadDocument(
        user.id,
        application.id,
        file,
        documentType
      );
      setDocuments(prev => [doc!, ...prev]);
      await fetchAllData();
      toast({
        title: "Document Uploaded",
        description: `Your ${documentType.replace('_', ' ')} has been uploaded.`
      });
      return doc;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteDocument = async (documentId: string, filePath: string) => {
    try {
      await HelperVerificationService.deleteDocument(documentId, filePath);
      setDocuments(prev => prev.filter(d => d.id !== documentId));
      await fetchAllData();
      toast({
        title: "Document Deleted",
        description: "Document has been removed."
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document.",
        variant: "destructive"
      });
    }
  };

  const completeModule = async (
    moduleId: string,
    score?: number,
    answers?: Record<string, any>
  ) => {
    if (!user) return null;

    try {
      const result = await HelperVerificationService.completeModule(
        user.id,
        moduleId,
        score,
        answers
      );
      await fetchAllData();
      
      if (result?.status === 'completed') {
        toast({
          title: "Module Completed",
          description: score ? `You scored ${score}%` : "Module marked as complete."
        });
      } else {
        toast({
          title: "Module Failed",
          description: "Please review the material and try again.",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error completing module:', error);
      toast({
        title: "Error",
        description: "Failed to complete module.",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    application,
    trainingModules,
    trainingProgress,
    documents,
    references,
    progress,
    loading,
    createApplication,
    updateApplication,
    submitApplication,
    uploadDocument,
    deleteDocument,
    completeModule,
    refetch: fetchAllData
  };
};
