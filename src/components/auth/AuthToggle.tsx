
import { Button } from "@/components/ui/button";

interface AuthToggleProps {
  isLogin: boolean;
  onToggle: () => void;
}

const AuthToggle = ({ isLogin, onToggle }: AuthToggleProps) => {
  return (
    <div className="mt-6 text-center">
      <Button
        variant="link"
        onClick={onToggle}
        className="text-teal-600"
      >
        {isLogin
          ? "Don't have an account? Sign up"
          : "Already have an account? Sign in"
        }
      </Button>
    </div>
  );
};

export default AuthToggle;
