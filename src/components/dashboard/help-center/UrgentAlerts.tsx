
import { AlertCircle, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface UrgentOpportunity {
  id: number;
  type: string;
  title: string;
  description: string;
  location: string;
  timeLeft: string;
  helpers: number;
  goal: number;
  category: string;
}

const urgentOpportunities: UrgentOpportunity[] = [
  {
    id: 1,
    type: "emergency",
    title: "Flood Relief Support Needed",
    description: "Immediate assistance required for families affected by recent flooding",
    location: "Downtown District",
    timeLeft: "2 hours",
    helpers: 45,
    goal: 100,
    category: "Disaster Relief"
  },
  {
    id: 2,
    type: "medical",
    title: "Blood Donation Drive",
    description: "Critical shortage of O-negative blood at local hospitals",
    location: "City Hospital",
    timeLeft: "6 hours",
    helpers: 23,
    goal: 50,
    category: "Health"
  }
];

const UrgentAlerts = () => {
  if (urgentOpportunities.length === 0) return null;

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-red-800">
          <AlertCircle className="h-5 w-5" />
          <span>Urgent Help Needed</span>
          <Badge variant="destructive" className="ml-2">LIVE</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {urgentOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="bg-white p-4 rounded-lg border border-red-200">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-red-900">{opportunity.title}</h4>
                <Badge variant="outline" className="text-red-700 border-red-300">
                  {opportunity.timeLeft} left
                </Badge>
              </div>
              <p className="text-sm text-red-700 mb-3">{opportunity.description}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-red-600 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {opportunity.location}
                </span>
                <span className="text-xs text-red-600">
                  {opportunity.helpers}/{opportunity.goal} helpers
                </span>
              </div>
              <Progress value={(opportunity.helpers / opportunity.goal) * 100} className="mb-3" />
              <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
                Help Now
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UrgentAlerts;
