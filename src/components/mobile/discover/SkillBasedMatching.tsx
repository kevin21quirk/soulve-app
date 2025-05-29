
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Zap, Star, TrendingUp } from "lucide-react";

interface SkillMatch {
  id: string;
  name: string;
  avatar: string;
  complementarySkills: string[];
  matchPercentage: number;
  canTeach: string[];
  wantsToLearn: string[];
  location: string;
}

interface SkillBasedMatchingProps {
  onConnect: (personId: string) => void;
}

const SkillBasedMatching = ({ onConnect }: SkillBasedMatchingProps) => {
  const [skillMatches] = useState<SkillMatch[]>([
    {
      id: "1",
      name: "Alex Rivera",
      avatar: "/placeholder.svg",
      complementarySkills: ["React", "Node.js"],
      matchPercentage: 92,
      canTeach: ["Frontend Development"],
      wantsToLearn: ["Backend Architecture"],
      location: "San Francisco"
    },
    {
      id: "2",
      name: "Emma Thompson", 
      avatar: "/placeholder.svg",
      complementarySkills: ["Design", "User Research"],
      matchPercentage: 87,
      canTeach: ["UX Design"],
      wantsToLearn: ["React Development"],
      location: "Remote"
    }
  ]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Zap className="h-5 w-5 text-yellow-500" />
          <span>Skill Matches</span>
          <Badge variant="secondary" className="text-xs">AI</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {skillMatches.map((match) => (
          <div key={match.id} className="p-3 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={match.avatar} alt={match.name} />
                  <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-sm">{match.name}</h4>
                  <p className="text-xs text-gray-600">{match.location}</p>
                </div>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                <Star className="h-3 w-3 mr-1" />
                {match.matchPercentage}% match
              </Badge>
            </div>
            
            <div className="space-y-2 mb-3">
              <div>
                <p className="text-xs font-medium text-green-700">Can teach:</p>
                <div className="flex flex-wrap gap-1">
                  {match.canTeach.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs bg-green-50 text-green-700">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-blue-700">Wants to learn:</p>
                <div className="flex flex-wrap gap-1">
                  {match.wantsToLearn.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <Button
              size="sm"
              variant="gradient"
              className="w-full"
              onClick={() => onConnect(match.id)}
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Connect for Skill Exchange
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SkillBasedMatching;
