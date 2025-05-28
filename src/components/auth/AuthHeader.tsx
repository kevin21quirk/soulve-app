
import { CardHeader, CardTitle } from "@/components/ui/card";

interface AuthHeaderProps {
  isLogin: boolean;
}

const AuthHeader = ({ isLogin }: AuthHeaderProps) => {
  return (
    <CardHeader className="text-center">
      <CardTitle className="text-2xl font-bold text-teal-700">
        {isLogin ? "Welcome Back" : "Join SouLVE"}
      </CardTitle>
      <p className="text-gray-600">
        {isLogin 
          ? "Sign in to your account to continue helping your community" 
          : "Create your account and start making a difference"
        }
      </p>
    </CardHeader>
  );
};

export default AuthHeader;
