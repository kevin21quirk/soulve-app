
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./api";
import { validateAnalyticsData } from "./validation";
import { QUERY_KEYS } from "./queryKeys";

export const useAnalyticsData = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ANALYTICS,
    queryFn: async () => {
      try {
        const data = await apiClient.get('/analytics');
        return validateAnalyticsData(data);
      } catch (error) {
        console.log('API unavailable, using mock data');
        // Return mock data in the expected format
        return validateAnalyticsData({
          helpActivityData: [
            { week: "Week 1", helped: 3, received: 1 },
            { week: "Week 2", helped: 7, received: 2 },
            { week: "Week 3", helped: 5, received: 4 },
            { week: "Week 4", helped: 9, received: 3 },
            { week: "Week 5", helped: 12, received: 5 },
            { week: "Week 6", helped: 8, received: 2 }
          ],
          engagementData: [
            { day: "Mon", posts: 2, likes: 15, comments: 8 },
            { day: "Tue", posts: 1, likes: 22, comments: 12 },
            { day: "Wed", posts: 3, likes: 18, comments: 6 },
            { day: "Thu", posts: 2, likes: 25, comments: 15 },
            { day: "Fri", posts: 4, likes: 30, comments: 18 },
            { day: "Sat", posts: 1, likes: 12, comments: 5 },
            { day: "Sun", posts: 2, likes: 20, comments: 10 }
          ],
          categoryData: [
            { name: "Moving Help", value: 35, color: "#8884d8" },
            { name: "Tutoring", value: 25, color: "#82ca9d" },
            { name: "Pet Care", value: 20, color: "#ffc658" },
            { name: "Tech Support", value: 12, color: "#ff7c7c" },
            { name: "Other", value: 8, color: "#8dd1e1" }
          ],
          impactMetrics: [
            { title: "People Helped", value: "47", change: "+15%", trend: "up" as const },
            { title: "Community Impact", value: "312hrs", change: "+22%", trend: "up" as const },
            { title: "Trust Score", value: "94%", change: "+2%", trend: "up" as const },
            { title: "Response Time", value: "2.3h", change: "-18%", trend: "down" as const }
          ]
        });
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for analytics
  });
};
