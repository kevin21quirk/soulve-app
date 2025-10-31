import { supabase } from '@/integrations/supabase/client';

export interface TutorialProgress {
  id: string;
  user_id: string;
  tutorial_type: string;
  user_type: string;
  steps_completed: string[];
  total_steps: number;
  current_step: number;
  is_completed: boolean;
  dismissed: boolean;
  started_at: string;
  completed_at?: string;
  last_step_at: string;
  created_at: string;
}

export interface TutorialPreferences {
  id: string;
  user_id: string;
  show_tutorials: boolean;
  dismissed_tutorials: string[];
  created_at: string;
  updated_at: string;
}

export const tutorialService = {
  // Start new tutorial session
  startTutorial: async (userId: string, userType: string, tutorialType: string = 'initial_onboarding', totalSteps: number) => {
    try {
      const { data, error } = await supabase
        .from('user_tutorial_progress')
        .insert({
          user_id: userId,
          user_type: userType,
          tutorial_type: tutorialType,
          total_steps: totalSteps,
          current_step: 1,
          steps_completed: [],
          is_completed: false,
          dismissed: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error starting tutorial:', error);
      throw error;
    }
  },

  // Update step progress
  updateProgress: async (userId: string, tutorialType: string, stepId: string, currentStep: number) => {
    try {
      // Get current progress
      const { data: current, error: fetchError } = await supabase
        .from('user_tutorial_progress')
        .select('steps_completed')
        .eq('user_id', userId)
        .eq('tutorial_type', tutorialType)
        .single();

      if (fetchError) throw fetchError;

      const stepsCompleted = (current?.steps_completed as string[]) || [];
      if (!stepsCompleted.includes(stepId)) {
        stepsCompleted.push(stepId);
      }

      const { data, error } = await supabase
        .from('user_tutorial_progress')
        .update({
          steps_completed: stepsCompleted,
          current_step: currentStep,
          last_step_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('tutorial_type', tutorialType)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating tutorial progress:', error);
      throw error;
    }
  },

  // Complete tutorial
  completeTutorial: async (userId: string, tutorialType: string) => {
    try {
      const { data, error } = await supabase
        .from('user_tutorial_progress')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('tutorial_type', tutorialType)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error completing tutorial:', error);
      throw error;
    }
  },

  // Dismiss tutorial
  dismissTutorial: async (userId: string, tutorialType: string, permanent: boolean = false) => {
    try {
      // Update tutorial progress
      const { error: progressError } = await supabase
        .from('user_tutorial_progress')
        .update({
          dismissed: true,
        })
        .eq('user_id', userId)
        .eq('tutorial_type', tutorialType);

      if (progressError) throw progressError;

      // If permanent, add to dismissed tutorials list
      if (permanent) {
        const { data: prefs, error: prefsError } = await supabase
          .from('tutorial_preferences')
          .select('dismissed_tutorials')
          .eq('user_id', userId)
          .single();

        const dismissedTutorials = prefs?.dismissed_tutorials || [];
        if (!dismissedTutorials.includes(tutorialType)) {
          dismissedTutorials.push(tutorialType);
        }

        const { error: updateError } = await supabase
          .from('tutorial_preferences')
          .upsert({
            user_id: userId,
            dismissed_tutorials: dismissedTutorials,
            updated_at: new Date().toISOString(),
          });

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error('Error dismissing tutorial:', error);
      throw error;
    }
  },

  // Get tutorial progress
  getTutorialProgress: async (userId: string, tutorialType: string): Promise<TutorialProgress | null> => {
    try {
      const { data, error } = await supabase
        .from('user_tutorial_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('tutorial_type', tutorialType)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      return {
        ...data,
        steps_completed: (data.steps_completed as string[]) || [],
      } as TutorialProgress;
    } catch (error) {
      console.error('Error getting tutorial progress:', error);
      return null;
    }
  },

  // Resume tutorial
  resumeTutorial: async (userId: string, tutorialType: string) => {
    try {
      const { data, error } = await supabase
        .from('user_tutorial_progress')
        .update({
          dismissed: false,
        })
        .eq('user_id', userId)
        .eq('tutorial_type', tutorialType)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error resuming tutorial:', error);
      throw error;
    }
  },

  // Reset tutorial (for re-watching)
  resetTutorial: async (userId: string, tutorialType: string) => {
    try {
      const { error } = await supabase
        .from('user_tutorial_progress')
        .delete()
        .eq('user_id', userId)
        .eq('tutorial_type', tutorialType);

      if (error) throw error;
    } catch (error) {
      console.error('Error resetting tutorial:', error);
      throw error;
    }
  },

  // Get user preferences
  getTutorialPreferences: async (userId: string): Promise<TutorialPreferences | null> => {
    try {
      const { data, error } = await supabase
        .from('tutorial_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting tutorial preferences:', error);
      return null;
    }
  },

  // Update preferences
  updateTutorialPreferences: async (userId: string, preferences: Partial<TutorialPreferences>) => {
    try {
      const { data, error } = await supabase
        .from('tutorial_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating tutorial preferences:', error);
      throw error;
    }
  },
};
