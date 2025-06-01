
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import PostTemplates from "./PostTemplates";

interface PostTemplateSelectorProps {
  onTemplateSelect: (template: any) => void;
  onCancel: () => void;
}

const PostTemplateSelector = ({ onTemplateSelect, onCancel }: PostTemplateSelectorProps) => {
  return (
    <Card className="mb-6 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Choose a Template</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <PostTemplates
          onTemplateSelect={onTemplateSelect}
          onCancel={onCancel}
        />
      </CardContent>
    </Card>
  );
};

export default PostTemplateSelector;
