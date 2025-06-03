
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import ForgotPasswordForm from "./ForgotPasswordForm";

interface EnhancedAuthFormProps {
  isLogin: boolean;
  onToggleMode: () => void;
  onSuccess: () => void;
}

const EnhancedAuthForm = ({ isLogin, onToggleMode, onSuccess }: EnhancedAuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    if (isLogin) return password.length > 0;
    
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return minLength && hasUpperCase && hasLowerCase && hasNumbers;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) setEmailError("");
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) setPasswordError("");
  };

  const checkIfUserNeedsOnboarding = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('questionnaire_responses')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      return !data; // Return true if no questionnaire response exists
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return true; // Default to requiring onboarding if error
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Validate inputs
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      if (isLogin) {
        setPasswordError("Password is required");
      } else {
        setPasswordError("Password must be at least 8 characters with uppercase, lowercase, and numbers");
      }
      return;
    }

    if (!isLogin && !firstName.trim()) {
      toast({
        title: "First name required",
        description: "Please enter your first name",
        variant: "destructive"
      });
      return;
    }

    if (!isLogin && !lastName.trim()) {
      toast({
        title: "Last name required",
        description: "Please enter your last name",
        variant: "destructive"
      });
      return;
    }

    if (!isLogin && !username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(),
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            setEmailError("Invalid email or password");
            setPasswordError("Invalid email or password");
          } else if (error.message.includes("Email not confirmed")) {
            toast({
              title: "Email not verified",
              description: "Please check your email and click the verification link before signing in.",
              variant: "destructive"
            });
          } else if (error.message.includes("Too many requests")) {
            toast({
              title: "Too many attempts",
              description: "Please wait a moment before trying again.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Login Error",
              description: error.message,
              variant: "destructive"
            });
          }
        } else if (data.user) {
          // Check if user needs onboarding
          const needsOnboarding = await checkIfUserNeedsOnboarding(data.user.id);
          
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
          
          // Redirect based on onboarding status
          if (needsOnboarding) {
            window.location.href = '/profile-registration';
          } else {
            onSuccess();
          }
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.toLowerCase().trim(),
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              username: username.trim(),
            },
            emailRedirectTo: `${window.location.origin}/profile-registration`
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            setEmailError("An account with this email already exists");
            toast({
              title: "Account exists",
              description: "An account with this email already exists. Try signing in instead.",
              variant: "destructive"
            });
          } else if (error.message.includes("Password")) {
            setPasswordError(error.message);
          } else {
            toast({
              title: "Signup Error",
              description: error.message,
              variant: "destructive"
            });
          }
        } else if (data.user) {
          toast({
            title: "Welcome to SouLVE!",
            description: "Account created! You'll be guided through a quick setup to personalize your experience.",
          });
          
          // For new signups, always go to onboarding
          window.location.href = '/profile-registration';
        }
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return <ForgotPasswordForm onBackToLogin={() => setShowForgotPassword(false)} />;
  }

  return (
    <form onSubmit={handleAuth} className="space-y-4">
      {!isLogin && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={loading}
              required={!isLogin}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={loading}
              required={!isLogin}
            />
          </div>
        </div>
      )}

      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required={!isLogin}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          disabled={loading}
          required
          className={emailError ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {emailError && (
          <div className="flex items-center space-x-1 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{emailError}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={isLogin ? "Enter your password" : "Create a strong password"}
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            disabled={loading}
            required
            className={passwordError ? "border-red-500 focus-visible:ring-red-500 pr-10" : "pr-10"}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {passwordError && (
          <div className="flex items-center space-x-1 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{passwordError}</span>
          </div>
        )}
      </div>

      {isLogin && (
        <div className="text-right">
          <Button
            type="button"
            variant="link"
            className="text-teal-600 hover:text-teal-700 p-0 h-auto"
            onClick={() => setShowForgotPassword(true)}
            disabled={loading}
          >
            Forgot your password?
          </Button>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-teal-600 hover:bg-teal-700" 
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {isLogin ? "Signing in..." : "Creating account..."}
          </>
        ) : (
          isLogin ? "Sign In" : "Create Account"
        )}
      </Button>
    </form>
  );
};

export default EnhancedAuthForm;
