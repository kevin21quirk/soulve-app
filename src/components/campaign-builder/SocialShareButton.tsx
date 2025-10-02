
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  MessageCircle,
  Copy,
  CheckCircle
} from "lucide-react";
import { SocialSharingService, type CampaignShareData } from "@/services/socialSharingService";
import { useToast } from "@/hooks/use-toast";

interface SocialShareButtonProps {
  campaign: any;
  variant?: "default" | "outline" | "ghost";
  className?: string;
}

const SocialShareButton = ({ campaign, variant = "default", className }: SocialShareButtonProps) => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareData = React.useMemo(() => 
    SocialSharingService.generateCampaignShareData(campaign), 
    [campaign]
  );

  const shareOptions = [
    { 
      platform: 'Twitter', 
      icon: Twitter, 
      color: 'text-blue-500 hover:bg-blue-50',
      action: () => SocialSharingService.shareToPlatform('twitter', shareData)
    },
    { 
      platform: 'Facebook', 
      icon: Facebook, 
      color: 'text-blue-600 hover:bg-blue-50',
      action: () => SocialSharingService.shareToPlatform('facebook', shareData)
    },
    { 
      platform: 'LinkedIn', 
      icon: Linkedin, 
      color: 'text-blue-700 hover:bg-blue-50',
      action: () => SocialSharingService.shareToPlatform('linkedin', shareData)
    },
    { 
      platform: 'WhatsApp', 
      icon: MessageCircle, 
      color: 'text-green-500 hover:bg-green-50',
      action: () => SocialSharingService.shareToPlatform('whatsapp', shareData)
    }
  ];

  const handleCopyLink = async () => {
    const success = await SocialSharingService.copyToClipboard(shareData);
    if (success) {
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Campaign link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast({
        title: "Copy Failed",
        description: "Unable to copy link to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleShare = (platform: string, action: () => void) => {
    action();
    setShowShareOptions(false);
    
    toast({
      title: "Shared Successfully!",
      description: `Campaign shared on ${platform}. Thank you for spreading the word!`,
    });
  };

  if (showShareOptions) {
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share Campaign
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowShareOptions(false)}
            >
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {shareOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Button
                  key={option.platform}
                  variant="outline"
                  className={`p-4 h-auto flex flex-col gap-2 ${option.color}`}
                  onClick={() => handleShare(option.platform, option.action)}
                >
                  <IconComponent className="h-6 w-6" />
                  <span className="text-sm">{option.platform}</span>
                </Button>
              );
            })}
          </div>
          
          <div className="border-t pt-4">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={handleCopyLink}
            >
              {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Campaign:</strong> {shareData.title}</p>
            <p><strong>Goal:</strong> £{shareData.goalAmount?.toLocaleString()}</p>
            <p><strong>Raised:</strong> £{shareData.currentAmount?.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button 
      variant={variant}
      className={className}
      onClick={() => setShowShareOptions(true)}
    >
      <Share2 className="h-4 w-4 mr-2" />
      Share Campaign
    </Button>
  );
};

export default SocialShareButton;
