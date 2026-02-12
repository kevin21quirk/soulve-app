-- Create function to handle feedback status notifications
CREATE OR REPLACE FUNCTION public.notify_feedback_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  notification_title TEXT;
  notification_message TEXT;
  notification_priority TEXT := 'normal';
BEGIN
  -- Only create notification if status or admin_notes changed
  IF (OLD.status IS DISTINCT FROM NEW.status) OR (OLD.admin_notes IS DISTINCT FROM NEW.admin_notes) THEN
    
    -- Determine notification content based on new status
    CASE NEW.status
      WHEN 'in_review' THEN
        notification_title := 'Feedback Acknowledged';
        notification_message := 'We''re looking into your feedback: "' || NEW.title || '"';
        notification_priority := 'normal';
      
      WHEN 'in_progress' THEN
        notification_title := 'Work Started';
        notification_message := 'We''ve started working on your feedback: "' || NEW.title || '"';
        notification_priority := 'high';
      
      WHEN 'resolved' THEN
        notification_title := 'Issue Resolved! 🎉';
        notification_message := 'Great news! We''ve addressed your feedback: "' || NEW.title || '"' || 
          CASE WHEN NEW.admin_notes IS NOT NULL THEN '. ' || NEW.admin_notes ELSE '' END;
        notification_priority := 'high';
      
      WHEN 'wont_fix' THEN
        notification_title := 'Feedback Response';
        notification_message := 'Thanks for your feedback: "' || NEW.title || '"' || 
          CASE WHEN NEW.admin_notes IS NOT NULL THEN '. ' || NEW.admin_notes ELSE '. We appreciate you taking the time to share this.' END;
        notification_priority := 'normal';
      
      ELSE
        -- Don't create notification for 'new' status or unknown statuses
        RETURN NEW;
    END CASE;
    
    -- Insert notification
    INSERT INTO public.notifications (
      recipient_id,
      type,
      title,
      message,
      priority,
      action_url,
      action_type,
      metadata
    ) VALUES (
      NEW.user_id,
      'feedback_status_update',
      notification_title,
      notification_message,
      notification_priority,
      '/admin/feedback',
      'view',
      jsonb_build_object(
        'feedback_id', NEW.id,
        'old_status', OLD.status,
        'new_status', NEW.status,
        'feedback_type', NEW.feedback_type
      )
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger on platform_feedback table
DROP TRIGGER IF EXISTS feedback_status_notification_trigger ON public.platform_feedback;

CREATE TRIGGER feedback_status_notification_trigger
  AFTER UPDATE ON public.platform_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_feedback_status_change();