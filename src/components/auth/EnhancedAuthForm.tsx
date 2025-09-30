
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
    
    if (!validateForm()) {
      toast({
        title: "Form validation failed",
        description: "Please fix the errors below",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password,
        });

        if (error) {
          // Handle specific auth errors
          if (error.message.includes("Invalid login credentials")) {
            setErrors({ 
              email: "Invalid email or password",
              password: "Invalid email or password"
            });
            toast({
              title: "Login failed",
              description: "Invalid email or password. Please check your credentials.",
              variant: "destructive"
            });
          } else if (error.message.includes("Email not confirmed")) {
            toast({
              title: "Email verification required",
              description: "Please check your email and click the verification link.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Login failed",
              description: error.message,
              variant: "destructive"
            });
          }
          return;
        }

        if (data.user) {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in."
          });
          onSuccess();
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              first_name: formData.firstName.trim(),
              last_name: formData.lastName.trim(),
              display_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`
            }
          }
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            setErrors({ email: "An account with this email already exists" });
            toast({
              title: "Account exists",
              description: "An account with this email already exists. Try signing in instead.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Signup failed",
              description: error.message,
              variant: "destructive"
            });
          }
          return;
        }

        if (data.user) {
          // Create profile record
          try {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                first_name: formData.firstName.trim(),
                last_name: formData.lastName.trim(),
                email: formData.email.trim(),
                waitlist_status: 'pending'
              });

            if (profileError) {
              // Don't fail the entire signup for profile creation error
            }
          } catch (profileError) {
            // Silent error handling for profile creation
          }

          toast({
            title: "Account created!",
            description: "Please check your email to verify your account, then you'll be added to our waitlist for approval."
          });
          
          // Clear form
          setFormData({
            email: "",
            password: "",
            firstName: "",
            lastName: ""
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
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
            <Label htmlFor="lastName">Last Name</Label>
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
            onClick={() => {
              // TODO: Implement forgot password functionality
              toast({
                title: "Password reset",
                description: "Password reset functionality will be available soon."
              });
            }}
          >
            Forgot your password?
          </Button>
        </div>
      )}
    </form>
  );
};

export default EnhancedAuthForm;
