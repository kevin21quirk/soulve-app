-- Update the notify_volunteer_work_logged trigger to also create notifications in the main table
CREATE OR REPLACE FUNCTION public.notify_volunteer_work_logged()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  recipient_uuid UUID;
  volunteer_name TEXT;
  skill_name TEXT;
BEGIN
  -- Only process if this is volunteer work with pending confirmation
  IF NEW.activity_type = 'volunteer_work' AND NEW.confirmation_status = 'pending' THEN
    -- Get the recipient (either org admin or post author)
    recipient_uuid := public.get_volunteer_work_recipient(NEW.id);
    
    IF recipient_uuid IS NOT NULL THEN
      -- Get volunteer name
      SELECT COALESCE(first_name || ' ' || last_name, 'A volunteer')
      INTO volunteer_name
      FROM profiles
      WHERE id = NEW.user_id;
      
      -- Get skill name from metadata
      skill_name := COALESCE((NEW.metadata->>'skill_name')::TEXT, 'professional skill');
      
      -- Create notification in volunteer_work_notifications table
      INSERT INTO volunteer_work_notifications (
        activity_id,
        recipient_id,
        volunteer_id,
        notification_type,
        metadata
      ) VALUES (
        NEW.id,
        recipient_uuid,
        NEW.user_id,
        'confirmation_request',
        jsonb_build_object(
          'hours', NEW.hours_contributed,
          'market_value', NEW.market_value_gbp,
          'points', NEW.points_earned,
          'skill_name', skill_name
        )
      );
      
      -- Create notification in main notifications table
      INSERT INTO notifications (
        recipient_id,
        type,
        title,
        message,
        priority,
        action_url,
        metadata
      ) VALUES (
        recipient_uuid,
        'volunteer_confirmation',
        'Volunteer Work Needs Confirmation',
        volunteer_name || ' has logged ' || NEW.hours_contributed || ' hours of ' || skill_name || ' volunteer work worth £' || NEW.market_value_gbp || '. Please review and confirm.',
        'high',
        '/dashboard?tab=volunteer-confirmations',
        jsonb_build_object(
          'activity_id', NEW.id,
          'volunteer_id', NEW.user_id,
          'hours', NEW.hours_contributed,
          'points', NEW.points_earned
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update the notify_volunteer_work_status trigger to also create notifications in the main table
CREATE OR REPLACE FUNCTION public.notify_volunteer_work_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  confirmer_name TEXT;
  skill_name TEXT;
BEGIN
  -- Only notify on status changes
  IF NEW.confirmation_status != OLD.confirmation_status AND NEW.confirmation_status IN ('confirmed', 'rejected') THEN
    -- Get confirmer name
    IF NEW.confirmed_by IS NOT NULL THEN
      SELECT COALESCE(first_name || ' ' || last_name, 'Someone')
      INTO confirmer_name
      FROM profiles
      WHERE id = NEW.confirmed_by;
    ELSE
      confirmer_name := 'The recipient';
    END IF;
    
    -- Get skill name from metadata
    skill_name := COALESCE((NEW.metadata->>'skill_name')::TEXT, 'volunteer work');
    
    -- Create notification in volunteer_work_notifications table
    INSERT INTO volunteer_work_notifications (
      activity_id,
      recipient_id,
      volunteer_id,
      notification_type,
      metadata
    ) VALUES (
      NEW.id,
      NEW.user_id,
      NEW.confirmed_by,
      NEW.confirmation_status,
      jsonb_build_object(
        'hours', NEW.hours_contributed,
        'rejection_reason', NEW.rejection_reason,
        'points', NEW.points_earned
      )
    );
    
    -- Create notification in main notifications table
    IF NEW.confirmation_status = 'confirmed' THEN
      INSERT INTO notifications (
        recipient_id,
        type,
        title,
        message,
        priority,
        action_url,
        metadata
      ) VALUES (
        NEW.user_id,
        'volunteer_confirmed',
        'Volunteer Work Confirmed! ✅',
        confirmer_name || ' confirmed your ' || NEW.hours_contributed || ' hours of ' || skill_name || '. You earned ' || NEW.points_earned || ' points!',
        'normal',
        '/dashboard?tab=points',
        jsonb_build_object(
          'activity_id', NEW.id,
          'confirmed_by', NEW.confirmed_by,
          'hours', NEW.hours_contributed,
          'points', NEW.points_earned
        )
      );
    ELSE
      INSERT INTO notifications (
        recipient_id,
        type,
        title,
        message,
        priority,
        action_url,
        metadata
      ) VALUES (
        NEW.user_id,
        'volunteer_rejected',
        'Volunteer Work Not Confirmed',
        confirmer_name || ' could not confirm your ' || NEW.hours_contributed || ' hours of ' || skill_name || '. ' || COALESCE('Reason: ' || NEW.rejection_reason, 'No reason provided.'),
        'normal',
        '/dashboard?tab=volunteer-confirmations',
        jsonb_build_object(
          'activity_id', NEW.id,
          'confirmed_by', NEW.confirmed_by,
          'rejection_reason', NEW.rejection_reason
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;