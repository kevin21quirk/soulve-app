import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUserPresence = () => {
  useEffect(() => {
    const updatePresence = async (isOnline: boolean) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('user_presence')
        .upsert({
          user_id: user.id,
          is_online: isOnline,
          last_seen: new Date().toISOString(),
        });
    };

    // Set online when component mounts
    updatePresence(true);

    // Heartbeat every 30 seconds
    const interval = setInterval(() => {
      updatePresence(true);
    }, 30000);

    // Set offline when page is hidden/closed
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updatePresence(false);
      } else {
        updatePresence(true);
      }
    };

    const handleBeforeUnload = () => {
      updatePresence(false);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      updatePresence(false);
    };
  }, []);
};
