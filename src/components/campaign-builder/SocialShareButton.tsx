
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import SocialSharingModal from "./SocialSharingModal";

interface SocialShareButtonProps {
  campaign: any;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  showText?: boolean;
  className?: string;
}

const SocialShareButton = ({ 
  campaign, 
  variant = "outline", 
  size = "default", 
  showText = true,
  className = ""
}: SocialShareButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant={variant}
        size={size}
        className={`flex items-center space-x-2 ${className}`}
      >
        <Share2 className="h-4 w-4" />
        {showText && <span>Share Campaign</span>}
      </Button>

      <SocialSharingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        campaign={campaign}
      />
    </>
  );
};

export default SocialShareButton;
