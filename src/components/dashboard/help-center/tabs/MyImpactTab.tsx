
import { Users, Clock, DollarSign, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MyImpactTab = () => {
  const impactData = [
    { date: "Today", action: "Donated to Food Bank Drive", impact: "Helped feed 12 families" },
    { date: "Yesterday", action: "Volunteered at Community Center", impact: "Taught coding to 8 kids" },
    { date: "3 days ago", action: "Joined Climate Action Campaign", impact: "Part of 250+ member movement" },
    { date: "1 week ago", action: "Mentored young entrepreneur", impact: "Helped launch startup" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">127</div>
            <p className="text-sm text-gray-600">People Helped</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">342</div>
            <p className="text-sm text-gray-600">Hours Volunteered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">$2,450</div>
            <p className="text-sm text-gray-600">Donations Made</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold">15</div>
            <p className="text-sm text-gray-600">Achievements</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Impact Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {impactData.map((item, index) => (
              <div key={index} className="flex items-start space-x-4 p-3 border rounded-lg">
                <div className="w-12 text-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mx-auto"></div>
                  <div className="w-px h-8 bg-gray-300 mx-auto mt-2"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{item.action}</h4>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyImpactTab;
