
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEnhancedPoints } from "@/hooks/useEnhancedPoints";
import { Heart, Share, MessageCircle, Bookmark, UserPlus, Send } from "lucide-react";

const TestButtons = () => {
  const { toast } = useToast();
  const { awardPoints, loading } = useEnhancedPoints();

  const testFunctions = [
    {
      name: "Like Post",
      icon: Heart,
      action: async () => {
        await awardPoints(
          'positive_feedback',
          3,
          'Liked a community post',
          { action: 'like_post', test: true }
        );
      }
    },
    {
      name: "Share Post", 
      icon: Share,
      action: async () => {
        await awardPoints(
          'post_creation',
          5,
          'Shared a helpful post',
          { action: 'share_post', test: true }
        );
      }
    },
    {
      name: "Comment",
      icon: MessageCircle,
      action: async () => {
        await awardPoints(
          'comment_helpful',
          2,
          'Added helpful comment',
          { action: 'comment', test: true }
        );
      }
    },
    {
      name: "Help Someone",
      icon: Bookmark,
      action: async () => {
        await awardPoints(
          'help_completed',
          25,
          'Helped community member with groceries',
          { action: 'help_completed', effort_level: 4, test: true },
          4
        );
      }
    },
    {
      name: "Make Connection",
      icon: UserPlus,
      action: async () => {
        await awardPoints(
          'user_referral',
          20,
          'Connected with new community member',
          { action: 'connection', test: true }
        );
      }
    },
    {
      name: "Volunteer Work",
      icon: Send,
      action: async () => {
        await awardPoints(
          'volunteer_hour',
          15,
          'Completed 5 hours of volunteer work',
          { action: 'volunteer', hours: 5, test: true }
        );
      }
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">🧪 Function Test Panel</h3>
      <p className="text-sm text-gray-600 mb-4">Test the points system with real database interactions</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {testFunctions.map((test, index) => {
          const IconComponent = test.icon;
          return (
            <Button
              key={index}
              variant="outline"
              onClick={test.action}
              disabled={loading}
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
