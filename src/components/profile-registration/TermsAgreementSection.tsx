
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TermsAgreementSectionProps {
  agreeToTerms: boolean;
  handleInputChange: (field: string, value: boolean) => void;
}

const TermsAgreementSection = ({ agreeToTerms, handleInputChange }: TermsAgreementSectionProps) => {
  return (
    <div className="flex items-start space-x-3 p-6 bg-gray-50 rounded-lg">
      <Checkbox
        id="terms"
        checked={agreeToTerms}
        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
        className="mt-1"
      />
      <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
        I agree to the Terms of Service and Privacy Policy. I understand that SouLVE will verify my identity and background to ensure community safety and trust.
      </Label>
    </div>
  );
};

export default TermsAgreementSection;
