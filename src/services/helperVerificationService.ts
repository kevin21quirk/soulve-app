import { supabase } from '@/integrations/supabase/client';
import type {
  HelperApplication,
  TrainingModule,
  TrainingProgress,
  VerificationDocument,
  ReferenceCheck,
  ApplicationProgress,
  Qualification,
  ReferenceContact
} from '@/types/helperVerification';

export class HelperVerificationService {
  /**
   * Create a new helper application
   */
  static async createApplication(userId: string): Promise<HelperApplication | null> {
    const { data, error } = await supabase
      .from('safe_space_helper_applications')
      .insert({
        user_id: userId,
        application_status: 'draft'
      })
      .select()
      .single();

    if (error) throw error;
    return data as unknown as HelperApplication;
  }

  /**
   * Get user's application
   */
  static async getApplication(userId: string): Promise<HelperApplication | null> {
    const { data, error } = await supabase
      .from('safe_space_helper_applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data as unknown as HelperApplication | null;
  }

  /**
   * Update application
   */
  static async updateApplication(
    applicationId: string,
    updates: Partial<HelperApplication>
  ): Promise<HelperApplication | null> {
    const { data, error } = await supabase
      .from('safe_space_helper_applications')
      .update(updates as any)
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as HelperApplication;
  }

  /**
   * Submit application for review
   */
  static async submitApplication(applicationId: string): Promise<HelperApplication | null> {
    const { data, error } = await supabase
      .from('safe_space_helper_applications')
      .update({
        application_status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as HelperApplication;
  }

  /**
   * Get all training modules
   */
  static async getTrainingModules(): Promise<TrainingModule[]> {
    const { data, error } = await supabase
      .from('safe_space_training_modules')
      .select('*')
      .eq('is_active', true)
      .order('order_sequence');

    if (error) throw error;
    return (data || []) as unknown as TrainingModule[];
  }

  /**
   * Get training progress for a user
   */
  static async getTrainingProgress(userId: string): Promise<TrainingProgress[]> {
    const { data, error } = await supabase
      .from('safe_space_helper_training_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return (data || []) as TrainingProgress[];
  }

  /**
   * Get progress for specific module
   */
  static async getModuleProgress(
    userId: string,
    moduleId: string
  ): Promise<TrainingProgress | null> {
    const { data, error } = await supabase
      .from('safe_space_helper_training_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .maybeSingle();

    if (error) throw error;
    return data as TrainingProgress | null;
  }

  /**
   * Start or update module progress
   */
  static async updateModuleProgress(
    userId: string,
    moduleId: string,
    updates: Partial<TrainingProgress>
  ): Promise<TrainingProgress | null> {
    const existing = await this.getModuleProgress(userId, moduleId);

    if (existing) {
      const { data, error } = await supabase
        .from('safe_space_helper_training_progress')
        .update(updates as any)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data as TrainingProgress;
    } else {
      const { data, error } = await supabase
        .from('safe_space_helper_training_progress')
        .insert({
          user_id: userId,
          module_id: moduleId,
          ...updates
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data as TrainingProgress;
    }
  }

  /**
   * Complete a training module
   */
  static async completeModule(
    userId: string,
    moduleId: string,
    score?: number,
    answers?: Record<string, any>
  ): Promise<TrainingProgress | null> {
    const [moduleResponse, progressResponse] = await Promise.all([
      supabase
        .from('safe_space_training_modules')
        .select('passing_score, retry_delay_days, max_attempts')
        .eq('id', moduleId)
        .single(),
      this.getModuleProgress(userId, moduleId)
    ]);

    const module = moduleResponse.data;
    const existingProgress = progressResponse;
    const passed = score ? score >= (module?.passing_score || 80) : true;
    const currentAttempts = existingProgress?.attempts || 0;
    const newAttempts = currentAttempts + 1;

    // Calculate retry date if failed and retry delay is set
    let canRetryAt: string | undefined = undefined;
    if (!passed && module?.retry_delay_days) {
      const retryDate = new Date();
      retryDate.setDate(retryDate.getDate() + module.retry_delay_days);
      canRetryAt = retryDate.toISOString();
    }

    // Check if max attempts reached
    if (module?.max_attempts && newAttempts >= module.max_attempts && !passed) {
      // Mark as failed permanently
      return this.updateModuleProgress(userId, moduleId, {
        status: 'failed',
        score,
        answers: answers || {},
        attempts: newAttempts,
        last_attempt_at: new Date().toISOString(),
        can_retry_at: canRetryAt
      });
    }
    
    return this.updateModuleProgress(userId, moduleId, {
      status: passed ? 'completed' : 'failed',
      score,
      answers: answers || {},
      completed_at: passed ? new Date().toISOString() : undefined,
      attempts: newAttempts,
      last_attempt_at: new Date().toISOString(),
      can_retry_at: canRetryAt
    });
  }

  /**
   * Check if user can attempt a module
   */
  static async canAttemptModule(
    userId: string,
    moduleId: string
  ): Promise<{ canAttempt: boolean; reason?: string; retryAt?: string }> {
    const [module, progress] = await Promise.all([
      supabase
        .from('safe_space_training_modules')
        .select('max_attempts, retry_delay_days')
        .eq('id', moduleId)
        .single(),
      this.getModuleProgress(userId, moduleId)
    ]);

    if (!progress) {
      return { canAttempt: true };
    }

    // Check max attempts
    if (module.data?.max_attempts && progress.attempts >= module.data.max_attempts) {
      return {
        canAttempt: false,
        reason: 'Maximum attempts reached'
      };
    }

    // Check retry delay
    if (progress.can_retry_at) {
      const retryDate = new Date(progress.can_retry_at);
      const now = new Date();
      
      if (now < retryDate) {
        return {
          canAttempt: false,
          reason: 'Retry cooldown active',
          retryAt: progress.can_retry_at
        };
      }
    }

    return { canAttempt: true };
  }

  /**
   * Upload verification document
   */
  static async uploadDocument(
    userId: string,
    applicationId: string,
    file: File,
    documentType: VerificationDocument['document_type']
  ): Promise<VerificationDocument | null> {
    // Upload to storage
    const filePath = `${userId}/${documentType}_${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('helper-verification-docs')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Create document record
    const { data, error } = await supabase
      .from('safe_space_verification_documents')
      .insert({
        user_id: userId,
        application_id: applicationId,
        document_type: documentType,
        file_path: filePath,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        verification_status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data as VerificationDocument;
  }

  /**
   * Get user's documents
   */
  static async getDocuments(applicationId: string): Promise<VerificationDocument[]> {
    const { data, error } = await supabase
      .from('safe_space_verification_documents')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as VerificationDocument[];
  }

  /**
   * Delete a document
   */
  static async deleteDocument(documentId: string, filePath: string): Promise<void> {
    // Delete from storage
    await supabase.storage
      .from('helper-verification-docs')
      .remove([filePath]);

    // Delete record
    const { error } = await supabase
      .from('safe_space_verification_documents')
      .delete()
      .eq('id', documentId);

    if (error) throw error;
  }

  /**
   * Get document download URL
   */
  static async getDocumentUrl(filePath: string): Promise<string> {
    const { data } = await supabase.storage
      .from('helper-verification-docs')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    return data?.signedUrl || '';
  }

  /**
   * Create reference checks
   */
  static async createReferenceChecks(
    applicationId: string,
    references: ReferenceContact[]
  ): Promise<ReferenceCheck[]> {
    const { data, error } = await supabase
      .from('safe_space_reference_checks')
      .insert(
        references.map(ref => ({
          application_id: applicationId,
          reference_name: ref.name,
          reference_email: ref.email,
          reference_phone: ref.phone,
          relationship: ref.relationship
        }))
      )
      .select();

    if (error) throw error;
    return (data || []) as ReferenceCheck[];
  }

  /**
   * Get reference checks for application
   */
  static async getReferenceChecks(applicationId: string): Promise<ReferenceCheck[]> {
    const { data, error } = await supabase
      .from('safe_space_reference_checks')
      .select('*')
      .eq('application_id', applicationId);

    if (error) throw error;
    return (data || []) as ReferenceCheck[];
  }

  /**
   * Calculate overall application progress
   */
  static async calculateProgress(userId: string): Promise<ApplicationProgress> {
    const application = await this.getApplication(userId);
    
    if (!application) {
      return {
        applicationSubmitted: false,
        identityVerified: false,
        backgroundCheckComplete: false,
        trainingComplete: false,
        referencesVerified: false,
        adminReviewed: false,
        overallProgress: 0
      };
    }

    const documents = await this.getDocuments(application.id);
    const trainingProgress = await this.getTrainingProgress(userId);
    const modules = await this.getTrainingModules();
    const references = await this.getReferenceChecks(application.id);

    const requiredModules = modules.filter(m => m.is_required);
    const completedModules = trainingProgress.filter(p => p.status === 'completed');

    const identityDocs = documents.filter(d => 
      ['government_id', 'selfie', 'address_proof'].includes(d.document_type)
    );
    const identityVerified = identityDocs.length >= 3 && 
      identityDocs.every(d => d.verification_status === 'verified');

    const backgroundCheck = documents.find(d => d.document_type === 'dbs_certificate');
    const backgroundCheckComplete = backgroundCheck?.verification_status === 'verified';

    const trainingComplete = completedModules.length >= requiredModules.length;

    const referencesVerified = references.length >= 2 && 
      references.every(r => r.status === 'completed');

    const adminReviewed = ['approved', 'rejected'].includes(application.application_status);

    const steps = [
      application.application_status !== 'draft',
      identityVerified,
      backgroundCheckComplete,
      trainingComplete,
      referencesVerified,
      adminReviewed
    ];

    const overallProgress = Math.round((steps.filter(Boolean).length / steps.length) * 100);

    return {
      applicationSubmitted: application.application_status !== 'draft',
      identityVerified,
      backgroundCheckComplete,
      trainingComplete,
      referencesVerified,
      adminReviewed,
      overallProgress
    };
  }

  /**
   * Check if user can submit application
   */
  static async canSubmitApplication(userId: string): Promise<boolean> {
    const application = await this.getApplication(userId);
    if (!application) return false;

    // Check required fields (minimum character requirement removed)
    const hasPersonalStatement = !!application.personal_statement && 
      application.personal_statement.trim().length > 0;
    const hasExperience = !!application.experience_description && 
      application.experience_description.trim().length > 0;
    const hasReferences = application.reference_contacts.length >= 2 &&
      application.reference_contacts.every(ref => ref.name && ref.email && ref.relationship);
    const hasAvailability = !!application.availability_commitment && 
      application.availability_commitment.trim().length > 0;

    return hasPersonalStatement && hasExperience && hasReferences && hasAvailability;
  }
}
