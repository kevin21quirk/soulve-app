
import { useRealRecommendations } from "./useRealRecommendations";

// Backwards compatibility - redirect to the real recommendations hook
export const useRecommendations = () => {
  return useRealRecommendations();
};
