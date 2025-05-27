
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, X, Users, MapPin, Briefcase, GraduationCap } from "lucide-react";
import { PeopleYouMayKnow as PeopleType } from "@/types/connections";

interface PeopleYouMayKnowProps {
  people: PeopleType[];
  onSendRequest: (personId: string) => void;
  onDismiss: (personId: string) => void;
}

const PeopleYouMayKnow = ({ people, onSendRequest, onDismiss }: PeopleYouMayKnowProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">People You May Know</h3>
        <span className="text-sm text-gray-500">{people.length} suggestions</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {people.map((person) => (
          <Card key={person.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={person.avatar} />
                    <AvatarFallback>
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDismiss(person.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">{person.name}</h4>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span>{person.location}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <Users className="h-3 w-3" />
                    <span>{person.mutualConnections} mutual connections</span>
                  </div>
                  
                  {person.workPlace && (
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <Briefcase className="h-3 w-3" />
                      <span>{person.workPlace}</span>
                    </div>
                  )}
                  
                  {person.school && (
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <GraduationCap className="h-3 w-3" />
                      <span>{person.school}</span>
                    </div>
                  )}
                </div>

                <Badge variant="secondary" className="text-xs">
                  {person.reason}
                </Badge>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => onSendRequest(person.id)}
                    size="sm"
                    className="flex-1"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Connect
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDismiss(person.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PeopleYouMayKnow;
