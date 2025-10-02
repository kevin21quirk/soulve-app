import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface NotificationTemplate {
  id: string;
  name: string;
  description?: string;
  type: string;
  title_template: string;
  message_template: string;
  default_priority: 'urgent' | 'high' | 'normal' | 'low';
  default_action_type?: string;
  metadata_schema: Record<string, any>;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useNotificationTemplates = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notification_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setTemplates((data || []) as NotificationTemplate[]);
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notification templates',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderTemplate = async (
    templateId: string,
    variables: Record<string, string>
  ) => {
    try {
      const { data, error } = await supabase.rpc('render_notification_template', {
        template_id_input: templateId,
        variables,
      });

      if (error) throw error;
      return data[0];
    } catch (error: any) {
      console.error('Error rendering template:', error);
      toast({
        title: 'Error',
        description: 'Failed to render notification template',
        variant: 'destructive',
      });
      return null;
    }
  };

  const createTemplate = async (template: Omit<NotificationTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('notification_templates')
        .insert(template)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Notification template created',
      });
      
      await fetchTemplates();
      return data;
    } catch (error: any) {
      console.error('Error creating template:', error);
      toast({
        title: 'Error',
        description: 'Failed to create notification template',
        variant: 'destructive',
      });
      return null;
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    loading,
    fetchTemplates,
    renderTemplate,
    createTemplate,
  };
};
