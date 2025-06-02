
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const ForgotPasswordForm = ({ onBackToLogin }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setEmailSent(true);
        toast({
          title: "Reset email sent",
          description: "Check your email for password reset instructions",
        });
      }
    } catch (error) {
      toast({
        title: "Unexpected error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
          <Mail className="h-8 w-8 text-teal-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">Check your email</h3>
          <p className="text-gray-600">
            We've sent password reset instructions to:
          </p>
          <p className="font-medium text-gray-900">{email}</p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              onClick={() => setEmailSent(false)}
              className="w-full"
            >
              Try different email
            </Button>
            <Button
              variant="ghost"
              onClick={onBackToLogin}
              className="w-full text-teal-600 hover:text-teal-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-semibold text-gray-900">Forgot your password?</h3>
        <p className="text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reset-email">Email address</Label>
          <Input
            id="reset-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full"
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !email.trim()}
          className="w-full bg-teal-600 hover:bg-teal-700"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending reset email...
            </>
          ) : (
            "Send reset email"
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={onBackToLogin}
          className="w-full text-teal-600 hover:text-teal-700"
          disabled={loading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to login
        </Button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
