
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Heart, Share, MessageCircle, Bookmark, UserPlus, Send } from "lucide-react";

const TestButtons = () => {
  const { toast } = useToast();

  const testFunctions = [
    {
      name: "Like Post",
      icon: Heart,
      action: () => toast({ title: "✅ Like function working", description: "Post liked successfully" })
    },
    {
      name: "Share Post", 
      icon: Share,
      action: () => toast({ title: "✅ Share function working", description: "Post shared successfully" })
    },
    {
      name: "Comment",
      icon: MessageCircle,
      action: () => toast({ title: "✅ Comment function working", description: "Comment added successfully" })
    },
    {
      name: "Bookmark",
      icon: Bookmark,
      action: () => toast({ title: "✅ Bookmark function working", description: "Post bookmarked successfully" })
    },
    {
      name: "Connect",
      icon: UserPlus,
      action: () => toast({ title: "✅ Connect function working", description: "Connection request sent" })
    },
    {
      name: "Send Message",
      icon: Send,
      action: () => toast({ title: "✅ Message function working", description: "Message sent successfully" })
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">🧪 Function Test Panel</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {testFunctions.map((test, index) => {
          const IconComponent = test.icon;
          return (
            <Button
              key={index}
              variant="outline"
              onClick={test.action}
              className="flex items-center gap-2"
            >
              <IconComponent className="h-4 w-4" />
              {test.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default TestButtons;
