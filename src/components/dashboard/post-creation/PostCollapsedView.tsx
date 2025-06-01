
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, FileText } from "lucide-react";

interface PostCollapsedViewProps {
  onExpand: () => void;
  onShowTemplates: () => void;
}

const PostCollapsedView = ({ onExpand, onShowTemplates }: PostCollapsedViewProps) => {
  return (
    <Card className="mb-6 cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://avatar.vercel.sh/user.png" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          
          <div 
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-500 cursor-text"
            onClick={onExpand}
          >
            What would you like to share today?
          </div>
          
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={onExpand}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onShowTemplates}>
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCollapsedView;
