import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Building2, CheckCircle, Loader2 } from "lucide-react";

const StakeholderRegistration = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [accepting, setAccepting] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  useEffect(() => {
    if (!token) {
      toast({ title: "Invalid invitation link", variant: "destructive" });
      navigate('/');
      return;
    }

    validateInvitation();
  }, [token]);

  const validateInvitation = async () => {
    try {
      const { data, error } = await supabase
        .rpc('validate_organization_invitation', { token_input: token });
      
      if (error) throw error;
      
      if (data && data.length > 0 && data[0].is_valid) {
        setInvitation(data[0]);
      } else {
        toast({ title: "Invalid or expired invitation", variant: "destructive" });
        navigate('/');
      }
    } catch (error: any) {
      toast({ title: "Error validating invitation", description: error.message, variant: "destructive" });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!credentials.email || !credentials.password) {
      toast({ title: "Please enter email and password", variant: "destructive" });
      return;
    }

    setAccepting(true);
    try {
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (signUpError) throw signUpError;

      // Accept the invitation
      const { error: acceptError } = await supabase
        .rpc('accept_organization_invitation', { token_input: token });

      if (acceptError) throw acceptError;

      toast({ title: "Registration successful!", description: "You've been added to the organization." });
      
      // Redirect to dashboard
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error: any) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!invitation) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <Card className="max-w-md w-full p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ESG Stakeholder Invitation
          </h1>
          <p className="text-muted-foreground mt-2">
            You've been invited to join an organization
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Invitation Details</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p><span className="font-medium">Email:</span> {invitation.email}</p>
              <p><span className="font-medium">Role:</span> {invitation.role}</p>
              {invitation.title && <p><span className="font-medium">Title:</span> {invitation.title}</p>}
              {invitation.esg_context?.dataRequests && (
                <p className="text-xs mt-2 text-blue-600">
                  You'll be asked to provide data for {invitation.esg_context.dataRequests.length} ESG indicators
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                placeholder={invitation.email}
              />
            </div>

            <div>
              <Label htmlFor="password">Create Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="Enter a secure password"
              />
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleAccept}
          disabled={accepting}
        >
          {accepting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Accepting...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Accept Invitation
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          By accepting, you agree to provide ESG data as requested by the organization
        </p>
      </Card>
    </div>
  );
};

export default StakeholderRegistration;
