import { CardHeader, CardTitle } from "@/components/ui/card";

interface AuthHeaderProps {
  isLogin: boolean;
}

const AuthHeader = ({ isLogin }: AuthHeaderProps) => {
  return (
    <CardHeader className="text-center border-b border-teal-100 bg-gradient-to-b from-teal-50 to-transparent">
      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
        {isLogin ? "Sign In" : "Create Your Account"}
      </CardTitle>
      <p className="text-gray-600 mt-2">
        {isLogin 
          ? "Enter your credentials to access your dashboard" 
          : "You'll be added to our waitlist for manual approval"
        }
      </p>
    </CardHeader>
  );
};

export default AuthHeader;
