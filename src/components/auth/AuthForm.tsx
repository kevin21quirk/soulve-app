
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FormFields from "./FormFields";
import ForgotPasswordForm from "./ForgotPasswordForm";

interface AuthFormProps {
  isLogin: boolean;
  onToggleMode: () => void;
  onSuccess: () => void;
}

const AuthForm = ({ isLogin, onToggleMode, onSuccess }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Enhanced error handling
          let errorMessage = error.message;
          if (error.message.includes("Invalid login credentials")) {
            errorMessage = "Invalid email or password. Please check your credentials.";
          } else if (error.message.includes("Email not confirmed")) {
            errorMessage = "Please check your email and click the verification link before signing in.";
          } else if (error.message.includes("Too many requests")) {
            errorMessage = "Too many login attempts. Please wait a moment before trying again.";
          }

          toast({
            title: "Login Error",
            description: errorMessage,
            variant: "destructive",
          });
        } else if (data.user) {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
          onSuccess();
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/verify-email`,
            data: {
              first_name: firstName,
              last_name: lastName,
              username: username,
            },
          },
        });

        if (error) {
          // Enhanced error handling for signup
          let errorMessage = error.message;
          if (error.message.includes("User already registered")) {
            errorMessage = "An account with this email already exists. Try signing in instead.";
          } else if (error.message.includes("Password should be at least")) {
            errorMessage = "Password must be at least 6 characters long.";
          } else if (error.message.includes("Unable to validate email address")) {
            errorMessage = "Please enter a valid email address.";
          }

          toast({
            title: "Signup Error",
            description: errorMessage,
            variant: "destructive",
          });
        } else if (data.user) {
          toast({
            title: "Account Created!",
            description: "Please check your email to verify your account before signing in.",
          });
          // Switch to login mode after successful signup
          onToggleMode();
          setPassword("");
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <ForgotPasswordForm onBackToLogin={() => setShowForgotPassword(false)} />
    );
  }

  return (
    <form onSubmit={handleAuth} className="space-y-4">
      <FormFields
        isLogin={isLogin}
        email={email}
        password={password}
        firstName={firstName}
        lastName={lastName}
        username={username}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onFirstNameChange={setFirstName}
        onLastNameChange={setLastName}
        onUsernameChange={setUsername}
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
      </Button>

      {isLogin && (
        <div className="text-center">
          <Button
            type="button"
            variant="link"
            className="text-sm text-teal-600 hover:text-teal-700"
            onClick={() => setShowForgotPassword(true)}
          >
            Forgot your password?
          </Button>
        </div>
      )}
    </form>
  );
};

export default AuthForm;
