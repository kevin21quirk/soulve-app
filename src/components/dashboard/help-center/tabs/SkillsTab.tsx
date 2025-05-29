
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SkillsTab = () => {
  const skillsData = [
    { skill: "Web Development", demand: "High", opportunities: 23, rate: "$75/hr" },
    { skill: "Graphic Design", demand: "Medium", opportunities: 15, rate: "$45/hr" },
    { skill: "Marketing", demand: "High", opportunities: 31, rate: "$60/hr" },
    { skill: "Legal Advice", demand: "Medium", opportunities: 8, rate: "$120/hr" },
    { skill: "Financial Planning", demand: "Low", opportunities: 5, rate: "$90/hr" },
    { skill: "Teaching/Tutoring", demand: "High", opportunities: 42, rate: "$35/hr" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills-Based Volunteering</CardTitle>
        <p className="text-sm text-gray-600">Use your professional skills to make an impact</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skillsData.map((skill, index) => (
            <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{skill.skill}</h4>
                <Badge 
                  variant={skill.demand === "High" ? "default" : skill.demand === "Medium" ? "secondary" : "outline"}
                >
                  {skill.demand}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{skill.opportunities} opportunities</p>
              <p className="text-sm text-green-600 font-medium">Avg: {skill.rate}</p>
              <Button variant="gradient" size="sm" className="w-full mt-3">
                View Opportunities
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsTab;
