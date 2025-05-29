
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface AnalyticsData {
  helpActivityData: Array<{
    week: string;
    helped: number;
    received: number;
  }>;
  engagementData: Array<{
    day: string;
    posts: number;
    likes: number;
    comments: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  impactMetrics: Array<{
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
  }>;
}

export const useAnalyticsData = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData: AnalyticsData = {
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
            { title: "People Helped", value: "47", change: "+15%", trend: "up" },
            { title: "Community Impact", value: "312hrs", change: "+22%", trend: "up" },
            { title: "Trust Score", value: "94%", change: "+2%", trend: "up" },
            { title: "Response Time", value: "2.3h", change: "-18%", trend: "down" }
          ]
        };
        
        setData(mockData);
        setError(null);
      } catch (err) {
        setError("Failed to load analytics data");
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [toast]);

  const refetch = () => {
    setData(null);
    setIsLoading(true);
    setError(null);
  };

  return {
    ...data,
    isLoading,
    error,
    refetch,
  };
};
