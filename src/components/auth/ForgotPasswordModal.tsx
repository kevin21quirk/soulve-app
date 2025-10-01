import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ForgotPasswordForm from "./ForgotPasswordForm";

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBackToLogin: () => void;
}

const ForgotPasswordModal = ({ open, onOpenChange, onBackToLogin }: ForgotPasswordModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription>
            Enter your email to receive a password reset link
          </DialogDescription>
        </DialogHeader>
        <ForgotPasswordForm onBackToLogin={onBackToLogin} />
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
