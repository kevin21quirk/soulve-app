
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrendingCause {
  name: string;
  growth: string;
  supporters: number;
}

const trendingCauses: TrendingCause[] = [
  { name: "Climate Action", growth: "+25%", supporters: 12500 },
  { name: "Education Equity", growth: "+18%", supporters: 8900 },
  { name: "Mental Health", growth: "+32%", supporters: 6700 },
  { name: "Food Security", growth: "+15%", supporters: 9800 }
];

const TrendingCauses = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Trending Causes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trendingCauses.map((cause, index) => (
            <div key={index} className="p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <h4 className="font-medium text-sm">{cause.name}</h4>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="secondary" className="text-xs">{cause.growth}</Badge>
                <span className="text-xs text-gray-500">{cause.supporters.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingCauses;
