
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const EmailVerificationHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleEmailVerification = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      
      if (!token || type !== 'signup') {
        setVerificationStatus('error');
        setErrorMessage('Invalid verification link');
        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        });

        if (error) {
          setVerificationStatus('error');
          setErrorMessage(error.message);
          toast({
            title: "Verification failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          setVerificationStatus('success');
          toast({
            title: "Email verified successfully!",
            description: "Your account has been activated."
          });
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      } catch (error: any) {
        setVerificationStatus('error');
        setErrorMessage('An unexpected error occurred');
        toast({
          title: "Verification failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
      }
    };

    handleEmailVerification();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {verificationStatus === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-teal-600" />
              <p className="text-gray-600">Verifying your email...</p>
            </>
          )}
          
          {verificationStatus === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
              <p className="text-green-600 font-semibold">Email verified successfully!</p>
              <p className="text-gray-600">Redirecting to dashboard...</p>
            </>
          )}
          
          {verificationStatus === 'error' && (
            <>
              <XCircle className="h-12 w-12 mx-auto text-red-600" />
              <p className="text-red-600 font-semibold">Verification failed</p>
              <p className="text-gray-600">{errorMessage}</p>
              <button
                onClick={() => navigate('/auth')}
                className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
              >
                Back to Login
              </button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerificationHandler;
