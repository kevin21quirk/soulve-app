import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, FileText, Settings, Eye } from "lucide-react";
import { useGenerateESGReport } from "@/services/esgService";
import { useReportCompleteness } from "@/hooks/esg/useReportCompleteness";
import { toast } from "@/hooks/use-toast";

interface ReportCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
}

export const ReportCreationWizard = ({
  open,
  onOpenChange,
  organizationId,
}: ReportCreationWizardProps) => {
  const [step, setStep] = useState(1);
  const [reportConfig, setReportConfig] = useState({
    framework: 'gri',
    reportName: '',
    periodStart: '',
    periodEnd: '',
  });

  const generateReport = useGenerateESGReport();
  const { data: completeness } = useReportCompleteness(organizationId);

  const steps = [
    { number: 1, title: 'Select Framework', icon: FileText },
    { number: 2, title: 'Report Details', icon: Settings },
    { number: 3, title: 'Review & Generate', icon: Eye },
  ];

  const frameworks = [
    { id: 'gri', name: 'GRI Standards', description: 'Global Reporting Initiative - Most comprehensive' },
    { id: 'sasb', name: 'SASB Standards', description: 'Sustainability Accounting Standards Board' },
    { id: 'tcfd', name: 'TCFD', description: 'Task Force on Climate-related Financial Disclosures' },
    { id: 'un_sdg', name: 'UN SDG', description: 'United Nations Sustainable Development Goals' },
  ];

  const handleNext = () => {
    if (step === 1 && !reportConfig.framework) {
      toast({ title: "Selection Required", description: "Please select a framework", variant: "destructive" });
      return;
    }
    if (step === 2 && (!reportConfig.reportName || !reportConfig.periodStart || !reportConfig.periodEnd)) {
      toast({ title: "Details Required", description: "Please fill in all report details", variant: "destructive" });
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleGenerate = async () => {
    try {
      await generateReport.mutateAsync({
        organizationId,
        reportType: reportConfig.framework,
        reportName: reportConfig.reportName,
        periodStart: reportConfig.periodStart,
        periodEnd: reportConfig.periodEnd,
      });
      toast({ title: "Report Generated", description: "Your ESG report has been created successfully" });
      onOpenChange(false);
      setStep(1);
    } catch (error) {
      toast({ title: "Generation Failed", description: "Failed to generate report", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create ESG Report</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center">
              <div className={`flex items-center ${index > 0 ? 'ml-4' : ''}`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                  ${step >= s.number ? 'bg-primary border-primary text-white' : 'border-gray-300 text-gray-400'}`}>
                  {step > s.number ? <CheckCircle className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                </div>
                <span className={`ml-2 text-sm font-medium ${step >= s.number ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 w-24 mx-4 ${step > s.number ? 'bg-primary' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="py-6">
          {/* Step 1: Framework Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Select Reporting Framework</h3>
              <RadioGroup value={reportConfig.framework} onValueChange={(value) => setReportConfig({ ...reportConfig, framework: value })}>
                {frameworks.map((fw) => (
                  <div key={fw.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:border-primary cursor-pointer">
                    <RadioGroupItem value={fw.id} id={fw.id} />
                    <Label htmlFor={fw.id} className="flex-1 cursor-pointer">
                      <div className="font-medium">{fw.name}</div>
                      <div className="text-sm text-muted-foreground">{fw.description}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Report Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Report Details</h3>
              <div className="space-y-2">
                <Label htmlFor="reportName">Report Name *</Label>
                <Input
                  id="reportName"
                  value={reportConfig.reportName}
                  onChange={(e) => setReportConfig({ ...reportConfig, reportName: e.target.value })}
                  placeholder="e.g., Annual ESG Report 2024"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="periodStart">Period Start *</Label>
                  <Input
                    id="periodStart"
                    type="date"
                    value={reportConfig.periodStart}
                    onChange={(e) => setReportConfig({ ...reportConfig, periodStart: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="periodEnd">Period End *</Label>
                  <Input
                    id="periodEnd"
                    type="date"
                    value={reportConfig.periodEnd}
                    onChange={(e) => setReportConfig({ ...reportConfig, periodEnd: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-semibold mb-4">Review & Generate</h3>
              
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Framework:</span>
                  <span className="font-medium">{frameworks.find(f => f.id === reportConfig.framework)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Report Name:</span>
                  <span className="font-medium">{reportConfig.reportName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Period:</span>
                  <span className="font-medium">{reportConfig.periodStart} to {reportConfig.periodEnd}</span>
                </div>
              </div>

              {completeness && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Data Completeness</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Environmental</span>
                        <span>{completeness.environmental}%</span>
                      </div>
                      <Progress value={completeness.environmental} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Social</span>
                        <span>{completeness.social}%</span>
                      </div>
                      <Progress value={completeness.social} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Governance</span>
                        <span>{completeness.governance}%</span>
                      </div>
                      <Progress value={completeness.governance} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={() => step > 1 ? setStep(step - 1) : onOpenChange(false)}>
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          <Button variant="gradient" onClick={step === 3 ? handleGenerate : handleNext} disabled={generateReport.isPending}>
            {step === 3 ? (generateReport.isPending ? 'Generating...' : 'Generate Report') : 'Next'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
