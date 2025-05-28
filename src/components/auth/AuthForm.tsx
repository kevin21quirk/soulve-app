
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FormFields from "./FormFields";

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
          toast({
            title: "Login Error",
            description: error.message,
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
            data: {
              first_name: firstName,
              last_name: lastName,
              username: username,
            },
          },
        });

        if (error) {
          toast({
            title: "Signup Error",
            description: error.message,
            variant: "destructive",
          });
        } else if (data.user) {
          toast({
            title: "Account Created!",
            description: "Welcome to SouLVE! Please check your email to verify your account.",
          });
          // Switch to login mode after successful signup
          onToggleMode();
          setPassword("");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
    </form>
  );
};

export default AuthForm;
