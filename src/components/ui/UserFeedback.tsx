
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export type FeedbackType = 'success' | 'error' | 'warning' | 'info';

interface FeedbackMessage {
  id: string;
  type: FeedbackType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface UserFeedbackProps {
  message: FeedbackMessage;
  onDismiss: (id: string) => void;
}

const UserFeedback = ({ message, onDismiss }: UserFeedbackProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (message.duration && message.duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onDismiss(message.id), 300);
      }, message.duration);

      return () => clearTimeout(timer);
    }
  }, [message.duration, message.id, onDismiss]);

  const getIcon = () => {
    switch (message.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getColorClasses = () => {
    switch (message.type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(message.id), 300);
  };

  return (
    <Card 
      className={`
        ${getColorClasses()} 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
        transition-all duration-300 ease-in-out
      `}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 pt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900">
              {message.title}
            </h4>
            <p className="text-sm text-gray-700 mt-1">
              {message.message}
            </p>
            
            {message.action && (
              <div className="mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={message.action.onClick}
                  className="text-xs"
                >
                  {message.action.label}
                </Button>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="flex-shrink-0 h-8 w-8 p-0 hover:bg-white/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Hook for managing feedback messages
export const useFeedback = () => {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);

  const showFeedback = (
    type: FeedbackType,
    title: string,
    message: string,
    options?: {
      duration?: number;
      action?: { label: string; onClick: () => void };
    }
  ) => {
    const id = Date.now().toString();
    const newMessage: FeedbackMessage = {
      id,
      type,
      title,
      message,
      duration: options?.duration || 5000,
      action: options?.action
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const dismissFeedback = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const clearAll = () => {
    setMessages([]);
  };

  return {
    messages,
    showFeedback,
    dismissFeedback,
    clearAll,
    showSuccess: (title: string, message: string, options?: any) => 
      showFeedback('success', title, message, options),
    showError: (title: string, message: string, options?: any) => 
      showFeedback('error', title, message, options),
    showWarning: (title: string, message: string, options?: any) => 
      showFeedback('warning', title, message, options),
    showInfo: (title: string, message: string, options?: any) => 
      showFeedback('info', title, message, options)
  };
};

// Container component for displaying feedback messages
export const FeedbackContainer = () => {
  const { messages, dismissFeedback } = useFeedback();

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50 max-w-sm">
      {messages.map(message => (
        <UserFeedback
          key={message.id}
          message={message}
          onDismiss={dismissFeedback}
        />
      ))}
    </div>
  );
};

export default UserFeedback;
