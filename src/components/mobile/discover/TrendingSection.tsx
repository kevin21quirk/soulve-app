
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

interface TrendingSectionProps {
  activeFilter: string;
}

const TrendingSection = ({ activeFilter }: TrendingSectionProps) => {
  if (!(activeFilter === "all" || activeFilter === "trending")) {
    return null;
  }

  const trendingTags = ["#CommunityHelp", "#LocalFood", "#SeniorCare", "#TechSupport"];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <span>Trending Now</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {trendingTags.map((tag) => (
            <Button key={tag} variant="outline" size="sm" className="justify-start text-xs">
              {tag}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingSection;
