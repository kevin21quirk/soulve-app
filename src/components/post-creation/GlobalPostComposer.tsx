import { usePostCreation } from '@/contexts/PostCreationContext';
import { useUnifiedPostCreation } from '@/hooks/useUnifiedPostCreation';
import { useQueryClient } from '@tanstack/react-query';
import { ModernPostComposer } from './ModernPostComposer';

export const GlobalPostComposer = () => {
  const queryClient = useQueryClient();
  const { isOpen, initialCategory, initialUrgency, openWithEvent, closePostComposer } = usePostCreation();
  const { createPost, isCreating } = useUnifiedPostCreation(() => {
    queryClient.invalidateQueries({ queryKey: ['feed'] });
    queryClient.invalidateQueries({ queryKey: ['social-feed'] });
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  });

  const handleSubmit = async (data: any) => {
    await createPost(data);
    closePostComposer();
  };

  return (
    <ModernPostComposer
      isOpen={isOpen}
      onClose={closePostComposer}
      onSubmit={handleSubmit}
      isSubmitting={isCreating}
      initialCategory={initialCategory}
      initialUrgency={initialUrgency}
      openEventCreator={openWithEvent}
    />
  );
};
