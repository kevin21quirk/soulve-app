
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Share2, 
  Copy, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Mail, 
  MessageCircle,
  Send,
  Link,
  Eye,
  Edit3,
  Check
} from "lucide-react";
import { SocialSharingService, CampaignShareData } from "@/services/socialSharingService";
import { useToast } from "@/hooks/use-toast";

interface SocialSharingModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: any;
}

const SocialSharingModal = ({ isOpen, onClose, campaign }: SocialSharingModalProps) => {
  const [activeTab, setActiveTab] = useState("quick");
  const [customMessage, setCustomMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareData = SocialSharingService.generateCampaignShareData(campaign);
  const customShareData = {
    ...shareData,
    description: customMessage || shareData.description
  };

  const socialPlatforms = [
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-blue-500', description: 'Share with your followers' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600', description: 'Post to your timeline' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700', description: 'Share professionally' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-500', description: 'Send to contacts' },
    { id: 'telegram', name: 'Telegram', icon: Send, color: 'bg-blue-400', description: 'Share in channels' },
    { id: 'email', name: 'Email', icon: Mail, color: 'bg-gray-600', description: 'Send via email' }
  ];

  const handleShare = (platform: string) => {
    SocialSharingService.shareToPlatform(platform, customShareData);
    toast({
      title: "Shared successfully!",
      description: `Your campaign has been shared to ${platform}.`,
    });
  };

  const handleCopyLink = async () => {
    const success = await SocialSharingService.copyToClipboard(customShareData);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link copied!",
        description: "Campaign link has been copied to clipboard.",
      });
    }
  };

  const previewCard = SocialSharingService.generateCustomPreviewCard(customShareData);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5 text-blue-600" />
            <span>Share Campaign</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quick">Quick Share</TabsTrigger>
            <TabsTrigger value="custom">Custom Message</TabsTrigger>
            <TabsTrigger value="preview">Preview Card</TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {socialPlatforms.map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <Card key={platform.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <Button
                        onClick={() => handleShare(platform.id)}
                        variant="ghost"
                        className="w-full h-auto flex flex-col space-y-3 p-4"
                      >
                        <div className={`p-3 rounded-full ${platform.color} text-white`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{platform.name}</div>
                          <div className="text-xs text-gray-500">{platform.description}</div>
                        </div>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Link className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Campaign Link</span>
                  </div>
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copied ? "Copied!" : "Copy Link"}</span>
                  </Button>
                </div>
                <Input
                  value={shareData.url}
                  readOnly
                  className="mt-2 bg-gray-50"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Custom Message</label>
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder={shareData.description}
                  className="mt-1"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Customize your message for social media sharing
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {shareData.hashtags?.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {socialPlatforms.map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <Button
                    key={platform.id}
                    onClick={() => handleShare(platform.id)}
                    variant="outline"
                    className="flex items-center space-x-2 h-auto p-4"
                  >
                    <div className={`p-2 rounded ${platform.color} text-white`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span>{platform.name}</span>
                  </Button>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Social Media Preview</h3>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Edit3 className="h-4 w-4" />
                <span>{isEditing ? "Done" : "Edit"}</span>
              </Button>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="max-w-md mx-auto">
                <div dangerouslySetInnerHTML={{ __html: previewCard }} />
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Preview URL</label>
                    <Input value={shareData.url} readOnly className="mt-1 bg-gray-50" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Category:</span>
                      <span className="ml-2 capitalize">{shareData.category.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="font-medium">Progress:</span>
                      <span className="ml-2">
                        {shareData.goalAmount ? 
                          `${Math.round(((shareData.currentAmount || 0) / shareData.goalAmount) * 100)}%` : 
                          'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-4">
              <Button onClick={handleCopyLink} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button onClick={() => handleShare('twitter')} className="bg-blue-500 hover:bg-blue-600">
                <Twitter className="h-4 w-4 mr-2" />
                Share on Twitter
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SocialSharingModal;
