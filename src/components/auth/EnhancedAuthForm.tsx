
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ForgotPasswordModal from "./ForgotPasswordModal";

interface EnhancedAuthFormProps {
  isLogin: boolean;
  onToggleMode: () => void;
  onSuccess: () => void;
}

const EnhancedAuthForm = ({ isLogin, onToggleMode, onSuccess }: EnhancedAuthFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ""
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score++;
    else feedback.push("at least 8 characters");

    if (/[A-Z]/.test(password)) score++;
    else feedback.push("an uppercase letter");

    if (/[a-z]/.test(password)) score++;
    else feedback.push("a lowercase letter");

    if (/[0-9]/.test(password)) score++;
    else feedback.push("a number");

    if (/[^A-Za-z0-9]/.test(password)) score++;
    else feedback.push("a special character");

    return {
      score,
      feedback: feedback.length > 0 ? `Add ${feedback.join(", ")}` : "Strong password!"
    };
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }

    // Update password strength for password field
    if (field === "password" && !isLogin) {
      setPasswordStrength(validatePassword(value));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!isLogin && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (!isLogin) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[LOGIN DEBUG] 1. Form submitted', { isLogin, email: formData.email });
    
    if (!validateForm()) {
      console.log('[LOGIN DEBUG] 2. Form validation FAILED', errors);
      toast({
        title: "Form validation failed",
        description: "Please fix the errors below",
        variant: "destructive"
      });
      return;
    }

    console.log('[LOGIN DEBUG] 3. Form validation PASSED, starting auth...');
    setIsLoading(true);
    try {
      if (isLogin) {
        console.log('[LOGIN DEBUG] 4. Calling signInWithPassword...');
        const { data, error} = await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password,
        });
        console.log('[LOGIN DEBUG] 5. signInWithPassword response:', { 
          hasData: !!data, 
          hasUser: !!data?.user,
          hasSession: !!data?.session,
          error: error?.message 
        });

        if (error) {
          console.log('[LOGIN DEBUG] 6. Login ERROR:', error);
          
          // Check for connection/service errors
          const isConnectionError = 
            error.message?.includes('upstream') || 
            error.message?.includes('503') ||
            error.message?.includes('connect') ||
            error.message?.includes('network') ||
            error.status === 503;

          if (isConnectionError) {
            toast({
              title: "Service Temporarily Unavailable",
              description: "The authentication service is experiencing issues. This may be due to recent updates. Please try again in a few minutes or contact support if this persists.",
              variant: "destructive",
              duration: 6000
            });
          } else if (error.message?.includes("Invalid login credentials") || error.message?.includes("Invalid")) {
            setErrors({ 
              email: "Invalid email or password",
              password: "Invalid email or password"
            });
            toast({
              title: "Login failed",
              description: "Invalid email or password. Please check your credentials and try again.",
              variant: "destructive"
            });
          } else if (error.message?.includes("Email not confirmed")) {
            toast({
              title: "Email verification required",
              description: "Please check your email and click the verification link before signing in.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Login failed",
              description: error.message || "An unexpected error occurred. Please try again.",
              variant: "destructive"
            });
          }
          return;
        }

        if (data.user) {
          console.log('[LOGIN DEBUG] 7. Login SUCCESS, user:', data.user.id);
          console.log('[LOGIN DEBUG] 8. Session:', data.session ? 'EXISTS' : 'MISSING');
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in."
          });
          console.log('[LOGIN DEBUG] 9. Calling onSuccess()...');
          onSuccess();
          console.log('[LOGIN DEBUG] 10. onSuccess() called');
        }
      } else {
        const redirectUrl = `${window.location.origin}/dashboard`;

        const { data, error } = await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              first_name: formData.firstName.trim(),
              last_name: formData.lastName.trim(),
              display_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`
            }
          }
        });

        if (error) {
          
          const isConnectionError = 
            error.message?.includes('upstream') || 
            error.message?.includes('503') ||
            error.message?.includes('connect') ||
            error.status === 503;

          if (isConnectionError) {
            toast({
              title: "Service Temporarily Unavailable",
              description: "The authentication service is experiencing issues. Please try again in a few minutes.",
              variant: "destructive",
              duration: 6000
            });
          } else if (error.message?.includes("User already registered") || error.message?.includes("already")) {
            setErrors({ email: "An account with this email already exists" });
            toast({
              title: "Account exists",
              description: "An account with this email already exists. Try signing in instead.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Signup failed",
              description: error.message || "An unexpected error occurred. Please try again.",
              variant: "destructive"
            });
          }
          return;
        }

        if (data.user) {
          toast({
            title: "Account Created! 🎉",
            description: "Please complete your profile setup. Your application will be reviewed by our team after completion."
          });
          
          // Redirect to profile registration after successful signup
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      }
    } catch (error: any) {
      
      // Check for network/connection errors
      const isNetworkError = 
        error.message?.includes('upstream') || 
        error.message?.includes('503') || 
        error.message?.includes('connect') ||
        error.message?.includes('network') ||
        error.name === 'NetworkError' ||
        error.name === 'FetchError';

      if (isNetworkError) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to the authentication service. Your Supabase backend may be experiencing issues after the upgrade. Please wait a few minutes and try again.",
          variant: "destructive",
          duration: 8000
        });
      } else {
        toast({
          title: "Authentication error",
          description: error.message || "An unexpected error occurred. Please try again or contact support if this persists.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 1) return "text-red-500";
    if (passwordStrength.score <= 3) return "text-yellow-500";
    return "text-green-500";
  };

  const getPasswordStrengthBars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`h-1 w-full rounded ${
          i < passwordStrength.score 
            ? passwordStrength.score <= 1 
              ? "bg-red-500" 
              : passwordStrength.score <= 3 
                ? "bg-yellow-500" 
                : "bg-green-500"
            : "bg-gray-200"
        }`}
      />
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isLogin && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>First Name</span>
            </Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Enter your first name"
              disabled={isLoading}
              className={errors.firstName ? "border-red-300" : ""}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.firstName}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Last Name</span>
            </Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Enter your last name"
              disabled={isLoading}
              className={errors.lastName ? "border-red-300" : ""}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.lastName}</span>
              </p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center space-x-2">
          <Mail className="h-4 w-4" />
          <span>Email</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="Enter your email"
          disabled={isLoading}
          className={errors.email ? "border-red-300" : ""}
        />
        {errors.email && (
          <p className="text-sm text-red-500 flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.email}</span>
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="flex items-center space-x-2">
          <Lock className="h-4 w-4" />
          <span>Password</span>
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder={isLogin ? "Enter your password" : "Create a strong password"}
            disabled={isLoading}
            className={`pr-10 ${errors.password ? "border-red-300" : ""}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        
        {errors.password && (
          <p className="text-sm text-red-500 flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.password}</span>
          </p>
        )}

        {!isLogin && formData.password && (
          <div className="space-y-2">
            <div className="flex space-x-1">
              {getPasswordStrengthBars()}
            </div>
            <p className={`text-xs ${getPasswordStrengthColor()}`}>
              {passwordStrength.feedback}
            </p>
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600" 
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>{isLogin ? "Signing in..." : "Creating account..."}</span>
          </div>
        ) : (
          isLogin ? "Sign In" : "Create Account"
        )}
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

      <ForgotPasswordModal
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
        onBackToLogin={() => setShowForgotPassword(false)}
      />
    </form>
  );
};

export default EnhancedAuthForm;
