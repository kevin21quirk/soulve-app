
import { Button } from "@/components/ui/button";

interface SubmitSectionProps {
  agreeToTerms: boolean;
  userType: string;
}

const SubmitSection = ({ agreeToTerms, userType }: SubmitSectionProps) => {
  return (
    <div className="text-center pt-6">
      <Button
        type="submit"
        size="lg"
        disabled={!agreeToTerms || !userType}
        className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        Complete Registration
      </Button>
    </div>
  );
};

export default SubmitSection;
