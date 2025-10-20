import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Link as LinkIcon, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

const SocialShare = ({ url, title, description }: SocialShareProps) => {
  const { toast } = useToast();
  const fullUrl = url.startsWith('http') ? url : `https://join-soulve.com${url}`;

  const handleShare = (platform: string) => {
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${fullUrl}`)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(fullUrl);
        toast({
          title: "Link copied!",
          description: "Share link copied to clipboard",
        });
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-2">Share:</span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('facebook')}
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('twitter')}
        aria-label="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('linkedin')}
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('whatsapp')}
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('copy')}
        aria-label="Copy link"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SocialShare;
