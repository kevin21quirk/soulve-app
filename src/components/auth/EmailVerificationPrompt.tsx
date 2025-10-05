import { useState } from 'react';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailVerificationPromptProps {
  email: string;
  onClose?: () => void;
}

export const EmailVerificationPrompt = ({ email, onClose }: EmailVerificationPromptProps) => {
  const [resending, setResending] = useState(false);
  const [resentSuccess, setResentSuccess] = useState(false);
  const { toast } = useToast();

  const handleResend = async () => {
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;

      setResentSuccess(true);
      toast({
        title: 'Verification email sent',
        description: 'Check your inbox for the verification link',
      });

      setTimeout(() => setResentSuccess(false), 5000);
    } catch (error: any) {
      toast({
        title: 'Failed to resend',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <Alert className="border-blue-200 bg-blue-50">
      <Mail className="h-5 w-5 text-blue-600" />
      <AlertDescription className="ml-2">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Verify your email</h4>
            <p className="text-sm text-blue-800">
              We've sent a verification link to <strong>{email}</strong>. 
              Click the link in the email to activate your account.
            </p>
          </div>

          <div className="text-xs text-blue-700 space-y-1">
            <p>• Check your spam folder if you don't see it</p>
            <p>• The link expires in 24 hours</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResend}
              disabled={resending || resentSuccess}
              className="text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              {resentSuccess ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Sent!
                </>
              ) : (
                <>
                  <RefreshCw className={`h-3 w-3 mr-1 ${resending ? 'animate-spin' : ''}`} />
                  Resend email
                </>
              )}
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-blue-700"
              >
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};
