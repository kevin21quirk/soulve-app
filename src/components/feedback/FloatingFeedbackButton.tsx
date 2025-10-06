import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { FeedbackModal } from "./FeedbackModal";

export const FloatingFeedbackButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-6 z-30 h-12 w-12 rounded-full shadow-lg animate-pulse hover:animate-none transition-all hover:scale-110 bg-gradient-to-r from-orange-500 to-red-500"
        size="icon"
        title="Give Feedback"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>

      <FeedbackModal open={showModal} onOpenChange={setShowModal} />
    </>
  );
};
