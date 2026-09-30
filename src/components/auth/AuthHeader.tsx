import { CardHeader, CardTitle } from "@/components/ui/card";

interface AuthHeaderProps {
  isLogin: boolean;
}

const AuthHeader = ({ isLogin }: AuthHeaderProps) => {
  return (
    <CardHeader className="text-center border-b border-slate-100 pb-6">
      <CardTitle className="text-2xl font-bold tracking-tight text-slate-950">
        {isLogin ? "Sign In" : "Create Your Account"}
      </CardTitle>
      <p className="text-slate-500 mt-2 text-sm">
        {isLogin 
          ? "Enter your credentials to access your dashboard" 
          : "You'll be added to our waitlist for manual approval"
        }
      </p>
    </CardHeader>
  );
};

export default AuthHeader;
