
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SouLVELogo from "@/components/SouLVELogo";

interface MobileOnboardingHeaderProps {
  currentStep: number;
  totalSteps: number;
}

const MobileOnboardingHeader = ({ currentStep, totalSteps }: MobileOnboardingHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
      <div className="flex items-center justify-between mb-4">
        <SouLVELogo size="small" />
        <div className="text-sm text-gray-600">
          {currentStep} of {totalSteps}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-teal-600 to-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default MobileOnboardingHeader;
