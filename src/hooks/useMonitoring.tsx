import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { setUserContext, clearUserContext, addBreadcrumb } from "@/utils/monitoring";

/**
 * Hook to automatically track user context for error monitoring
 */
export const useMonitoring = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setUserContext(user.id, user.email);
      addBreadcrumb("User logged in", "auth", { userId: user.id });
    } else {
      clearUserContext();
    }
  }, [user]);
};

/**
 * Hook to track page views
 */
export const usePageViewTracking = (pageName: string) => {
  useEffect(() => {
    addBreadcrumb(`Page view: ${pageName}`, "navigation", { page: pageName });
    console.log(`Page view tracked: ${pageName}`);
  }, [pageName]);
};

/**
 * Hook to track feature usage
 */
export const useFeatureTracking = (featureName: string, metadata?: Record<string, any>) => {
  useEffect(() => {
    addBreadcrumb(`Feature used: ${featureName}`, "feature", { feature: featureName, ...metadata });
  }, [featureName, metadata]);
};
