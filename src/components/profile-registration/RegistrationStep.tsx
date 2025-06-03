
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

interface RegistrationStepProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isNextEnabled: boolean;
  showPrevious?: boolean;
  nextButtonText?: string;
  isSubmitting?: boolean;
  platformInsight?: {
    title: string;
    description: string;
    icon: ReactNode;
  };
}

const RegistrationStep = ({
  title,
  subtitle,
  children,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isNextEnabled,
  showPrevious = true,
  nextButtonText,
  isSubmitting = false,
  platformInsight
}: RegistrationStepProps) => {
  const buttonText = nextButtonText || (currentStep === totalSteps ? "Complete" : "Continue");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-teal-600 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0">
            <CardContent className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-gray-600">{subtitle}</p>
              </div>

              {children}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                {showPrevious && currentStep > 1 ? (
                  <Button
                    variant="outline"
                    onClick={onPrevious}
                    disabled={isSubmitting}
                    className="flex items-center space-x-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                ) : (
                  <div />
                )}

                <Button
                  onClick={onNext}
                  disabled={!isNextEnabled || isSubmitting}
                  className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Setting up...</span>
                    </>
                  ) : (
                    <>
                      <span>{buttonText}</span>
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Insight Sidebar */}
        {platformInsight && (
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  {platformInsight.icon}
                  <h3 className="text-lg font-semibold text-teal-800">
                    {platformInsight.title}
                  </h3>
                </div>
                <p className="text-teal-700 text-sm leading-relaxed">
                  {platformInsight.description}
                </p>
                <div className="mt-4 p-3 bg-white/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                    <span className="text-xs text-teal-600 font-medium">
                      Unlocked by completing this step
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationStep;
