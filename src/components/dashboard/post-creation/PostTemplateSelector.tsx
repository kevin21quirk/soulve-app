
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface PostTemplate {
  id: string;
  title: string;
  description: string;
  template: string;
  category: string;
  urgency: string;
  tags: string[];
}

interface PostTemplateSelectorProps {
  onTemplateSelect: (template: PostTemplate) => void;
  onCancel: () => void;
}

const PostTemplateSelector = ({ onTemplateSelect, onCancel }: PostTemplateSelectorProps) => {
  const templates: PostTemplate[] = [
    {
      id: "help-groceries",
      title: "Grocery Shopping Help",
      description: "Request help with grocery shopping",
      template: "Looking for someone to help with grocery shopping. I need assistance with weekly shopping due to mobility issues. Happy to provide a small compensation.",
      category: "help-needed",
      urgency: "medium",
      tags: ["groceries", "shopping", "assistance"]
    },
    {
      id: "offer-tutoring",
      title: "Tutoring Offer",
      description: "Offer tutoring services",
      template: "I'm offering free tutoring sessions in [subject]. I have [years] years of experience and would love to help students in our community succeed.",
      category: "help-offered",
      urgency: "low",
      tags: ["tutoring", "education", "volunteer"]
    },
    {
      id: "lost-pet",
      title: "Lost Pet",
      description: "Report a lost pet",
      template: "Our beloved [pet type] [name] has gone missing. Last seen on [date] near [location]. [Description]. Please contact us if you have any information.",
      category: "lost-found",
      urgency: "high",
      tags: ["lost", "pet", "urgent"]
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Choose a Template</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{template.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="outline">{template.category}</Badge>
                      <Badge variant="secondary">{template.urgency}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => onTemplateSelect(template)}
                    className="ml-4"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Use
                  </Button>
                </div>
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
                  {template.template}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostTemplateSelector;
