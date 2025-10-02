import { HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ConnectToHelpModal } from './ConnectToHelpModal';

interface ConnectToHelpButtonProps {
  postId: string;
  postTitle: string;
  postAuthor: {
    name: string;
    avatar: string;
    id?: string;
  };
  category?: string;
}

export const ConnectToHelpButton = ({
  postId,
  postTitle,
  postAuthor,
  category,
}: ConnectToHelpButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="gradient"
        size="lg"
        className="w-full"
        onClick={() => setIsModalOpen(true)}
      >
        <HandHeart className="h-5 w-5" />
        Connect to Help
      </Button>

      <ConnectToHelpModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        postId={postId}
        postTitle={postTitle}
        postAuthor={postAuthor}
        category={category}
      />
    </>
  );
};
