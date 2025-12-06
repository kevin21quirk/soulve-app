import { createContext, useContext, useState, ReactNode } from 'react';

interface PostCreationOptions {
  category?: string;
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
  openWithEvent?: boolean;
}

interface PostCreationContextType {
  isOpen: boolean;
  initialCategory: string;
  initialUrgency: 'low' | 'medium' | 'high' | 'urgent';
  openWithEvent: boolean;
  openPostComposer: (options?: PostCreationOptions) => void;
  closePostComposer: () => void;
}

const PostCreationContext = createContext<PostCreationContextType | undefined>(undefined);

export const PostCreationProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialCategory, setInitialCategory] = useState('');
  const [initialUrgency, setInitialUrgency] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [openWithEvent, setOpenWithEvent] = useState(false);

  const openPostComposer = (options?: PostCreationOptions) => {
    setInitialCategory(options?.category || '');
    setInitialUrgency(options?.urgency || 'medium');
    setOpenWithEvent(options?.openWithEvent || false);
    setIsOpen(true);
  };

  const closePostComposer = () => {
    setIsOpen(false);
    // Reset values after close animation
    setTimeout(() => {
      setInitialCategory('');
      setInitialUrgency('medium');
      setOpenWithEvent(false);
    }, 200);
  };

  return (
    <PostCreationContext.Provider
      value={{
        isOpen,
        initialCategory,
        initialUrgency,
        openWithEvent,
        openPostComposer,
        closePostComposer,
      }}
    >
      {children}
    </PostCreationContext.Provider>
  );
};

export const usePostCreation = () => {
  const context = useContext(PostCreationContext);
  if (context === undefined) {
    throw new Error('usePostCreation must be used within a PostCreationProvider');
  }
  return context;
};
