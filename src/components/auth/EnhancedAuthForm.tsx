import { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ForgotPasswordModal from "./ForgotPasswordModal";

interface EnhancedAuthFormProps {
  isLogin: boolean;
  onToggleMode: () => void;
  onSuccess: () => void;
}

const EnhancedAuthForm = ({ isLogin, onSuccess }: EnhancedAuthFormProps) => {
  const { toast } = useToast();
  const { signIn, isLoaded: signInLoaded }   = useSignIn();
  const { signUp, isLoaded: signUpLoaded }   = useSignUp();
  const isLoaded = signInLoaded && signUpLoaded;

  const [isLoading, setIsLoading]           = useState(false);
  const [showPassword, setShowPassword]     = useState(false);
  const [formData, setFormData]             = useState({ email: "", password: "", firstName: "", lastName: "" });
  const [errors, setErrors]                 = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: "" });
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) => {
    let score = 0;
    const feedback: string[] = [];
    if (password.length >= 8) score++; else feedback.push("at least 8 characters");
    if (/[A-Z]/.test(password)) score++; else feedback.push("an uppercase letter");
    if (/[a-z]/.test(password)) score++; else feedback.push("a lowercase letter");
    if (/[0-9]/.test(password)) score++; else feedback.push("a number");
    if (/[^A-Za-z0-9]/.test(password)) score++; else feedback.push("a special character");
    return { score, feedback: feedback.length > 0 ? `Add ${feedback.join(", ")}` : "Strong password!" };
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    if (field === "password" && !isLogin) setPasswordStrength(validatePassword(value));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email address";
    if (!formData.password) newErrors.password = "Password is required";
    else if (!isLogin && formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (!isLogin) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())  newErrors.lastName  = "Last name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clerkErrMessage = (err: unknown): string => {
    if (err && typeof err === 'object' && 'errors' in err) {
      const clerkErr = err as { errors: Array<{ message: string }> };
      return clerkErr.errors?.[0]?.message ?? 'An unexpected error occurred';
    }
    if (err instanceof Error) return err.message;
    return 'An unexpected error occurred';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !isLoaded) return;

    setIsLoading(true);
    try {
      if (isLogin) {
        const result = await signIn!.create({
          identifier: formData.email.trim(),
          password: formData.password,
        });

        if (result.status === 'complete') {
          toast({ title: "Welcome back!", description: "You have successfully signed in." });
          onSuccess();
        } else {
          toast({ title: "Sign in incomplete", description: "Additional verification required.", variant: "destructive" });
        }
      } else {
        const result = await signUp!.create({
          emailAddress: formData.email.trim(),
          password: formData.password,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
        });

        if (result.status === 'complete') {
          toast({ title: "Account Created! 🎉", description: "Welcome to SouLVE! Setting up your profile…" });
          onSuccess();
        } else if (result.status === 'missing_requirements') {
          // Email verification required — send verification email
          await signUp!.prepareEmailAddressVerification({ strategy: 'email_code' });
          toast({
            title: "Verify your email",
            description: "We've sent a verification code to your email. Please check your inbox.",
          });
          onSuccess();
        }
      }
    } catch (err) {
      const msg = clerkErrMessage(err);
      if (msg.toLowerCase().includes('identifier') || msg.toLowerCase().includes('password') || msg.toLowerCase().includes('credentials')) {
        setErrors({ email: "Invalid email or password", password: "Invalid email or password" });
      }
      toast({ title: isLogin ? "Sign in failed" : "Sign up failed", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const strengthColor = () => {
    if (passwordStrength.score <= 1) return "text-red-500";
    if (passwordStrength.score <= 3) return "text-yellow-500";
    return "text-green-500";
  };

  const strengthBars = () =>
    Array.from({ length: 5 }, (_, i) => (
      <div key={i} className={`h-1 w-full rounded ${
        i < passwordStrength.score
          ? passwordStrength.score <= 1 ? "bg-red-500" : passwordStrength.score <= 3 ? "bg-yellow-500" : "bg-green-500"
          : "bg-gray-200"
      }`} />
    ));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isLogin && (
        <div className="grid grid-cols-2 gap-4">
          {(['firstName', 'lastName'] as const).map(field => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field} className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{field === 'firstName' ? 'First Name' : 'Last Name'}</span>
              </Label>
              <Input
                id={field}
                type="text"
                value={formData[field]}
                onChange={e => handleInputChange(field, e.target.value)}
                placeholder={field === 'firstName' ? "Enter your first name" : "Enter your last name"}
                disabled={isLoading}
                className={`h-11 rounded-xl bg-slate-50/60 ${errors[field] ? "border-red-300" : "border-slate-200"}`}
              />
              {errors[field] && (
                <p className="text-sm text-red-500 flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3" /><span>{errors[field]}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center space-x-2">
          <Mail className="h-4 w-4" /><span>Email</span>
        </Label>
        <Input
          id="email" type="email" value={formData.email}
          onChange={e => handleInputChange("email", e.target.value)}
          placeholder="Enter your email" disabled={isLoading}
          className={`h-11 rounded-xl bg-slate-50/60 ${errors.email ? "border-red-300" : "border-slate-200"}`}
        />
        {errors.email && (
          <p className="text-sm text-red-500 flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" /><span>{errors.email}</span>
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="flex items-center space-x-2">
          <Lock className="h-4 w-4" /><span>Password</span>
        </Label>
        <div className="relative">
          <Input
            id="password" type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={e => handleInputChange("password", e.target.value)}
            placeholder={isLogin ? "Enter your password" : "Create a strong password"}
            disabled={isLoading}
            className={`pr-10 h-11 rounded-xl bg-slate-50/60 ${errors.password ? "border-red-300" : "border-slate-200"}`}
          />
          <Button
            type="button" variant="ghost" size="sm"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500 flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" /><span>{errors.password}</span>
          </p>
        )}
        {!isLogin && formData.password && (
          <div className="space-y-2">
            <div className="flex space-x-1">{strengthBars()}</div>
            <p className={`text-xs ${strengthColor()}`}>{passwordStrength.feedback}</p>
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-11 rounded-full bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] hover:opacity-90 text-white font-semibold shadow-lg shadow-[#18a5fe]/25 border-none"
        disabled={isLoading || !isLoaded}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            <span>{isLogin ? "Signing in…" : "Creating account…"}</span>
          </div>
        ) : (
          isLogin ? "Sign In" : "Create Account"
        )}
      </Button>

      {isLogin && (
        <div className="text-center">
          <Button
            type="button" variant="link"
            className="text-sm text-[#0f7fd4] font-medium hover:text-[#18a5fe] hover:no-underline"
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
