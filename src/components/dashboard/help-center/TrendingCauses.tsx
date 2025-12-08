import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTrendingCauses } from "@/hooks/useHelpCenterData";
import { useNavigate } from "react-router-dom";

const TrendingCauses = () => {
  const { data: trendingCauses, isLoading } = useTrendingCauses();
  const navigate = useNavigate();

  const handleCauseClick = (causeId: string) => {
    navigate(`/campaigns/${causeId}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-soulve-blue" />
            <span>Trending Causes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!trendingCauses || trendingCauses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-soulve-blue" />
            <span>Trending Causes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            No trending causes at the moment. Check back soon!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-soulve-blue" />
          <span>Trending Causes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trendingCauses.slice(0, 4).map((cause) => (
            <div 
              key={cause.id} 
              className="p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:border-soulve-teal/30"
              onClick={() => handleCauseClick(cause.id)}
            >
              <h4 className="font-medium text-sm line-clamp-1">{cause.name}</h4>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="soulve-teal" className="text-xs">{cause.growth}</Badge>
                <span className="text-xs text-muted-foreground">{cause.supporters.toLocaleString()} supporters</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingCauses;
