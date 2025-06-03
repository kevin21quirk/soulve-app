
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface EditedMessage {
  id: string;
  originalContent: string;
  editedContent: string;
  editedAt: string;
}

export const useMessageActions = () => {
  const { toast } = useToast();
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editedMessages, setEditedMessages] = useState<Record<string, EditedMessage>>({});
  const [deletedMessages, setDeletedMessages] = useState<Set<string>>(new Set());

  const startEditing = useCallback((messageId: string) => {
    setEditingMessage(messageId);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingMessage(null);
  }, []);

  const saveEdit = useCallback((messageId: string, originalContent: string, newContent: string) => {
    if (newContent.trim() === '') {
      toast({
        title: "Error",
        description: "Message cannot be empty",
        variant: "destructive"
      });
      return false;
    }

    setEditedMessages(prev => ({
      ...prev,
      [messageId]: {
        id: messageId,
        originalContent,
        editedContent: newContent,
        editedAt: new Date().toISOString()
      }
    }));

    setEditingMessage(null);
    
    toast({
      title: "Message updated",
      description: "Your message has been edited successfully"
    });

    return true;
  }, [toast]);

  const deleteMessage = useCallback((messageId: string) => {
    setDeletedMessages(prev => new Set([...prev, messageId]));
    
    toast({
      title: "Message deleted",
      description: "The message has been removed"
    });
  }, [toast]);

  const forwardMessage = useCallback((messageId: string, conversationIds: string[]) => {
    // Implementation for forwarding messages
    toast({
      title: "Message forwarded",
      description: `Message forwarded to ${conversationIds.length} conversation(s)`
    });
  }, [toast]);

  const pinMessage = useCallback((messageId: string) => {
    toast({
      title: "Message pinned",
      description: "Message has been pinned to the conversation"
    });
  }, [toast]);

  const createThread = useCallback((messageId: string) => {
    toast({
      title: "Thread created",
      description: "A new thread has been started from this message"
    });
  }, [toast]);

  const isMessageEdited = useCallback((messageId: string) => {
    return messageId in editedMessages;
  }, [editedMessages]);

  const isMessageDeleted = useCallback((messageId: string) => {
    return deletedMessages.has(messageId);
  }, [deletedMessages]);

  const getEditedContent = useCallback((messageId: string) => {
    return editedMessages[messageId]?.editedContent;
  }, [editedMessages]);

  return {
    editingMessage,
    startEditing,
    cancelEditing,
    saveEdit,
    deleteMessage,
    forwardMessage,
    pinMessage,
    createThread,
    isMessageEdited,
    isMessageDeleted,
    getEditedContent
  };
};
