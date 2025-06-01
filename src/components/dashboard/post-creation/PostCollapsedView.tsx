
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface PostCollapsedViewProps {
  onExpand: () => void;
  onShowTemplates: () => void;
}

const PostCollapsedView = ({ onExpand, onShowTemplates }: PostCollapsedViewProps) => {
  return (
    <Card className="mb-6 cursor-pointer hover:shadow-md transition-shadow" onClick={onExpand}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Share something with your community... (Type @ to tag someone)</span>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={(e) => {
              e.stopPropagation();
              onShowTemplates();
            }}>
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCollapsedView;
