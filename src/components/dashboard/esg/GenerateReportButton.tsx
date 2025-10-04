import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useGenerateESGReport } from "@/services/esgService";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GenerateReportButtonProps {
  organizationId: string;
}

const GenerateReportButton = ({ organizationId }: GenerateReportButtonProps) => {
  const [open, setOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  
  const generateReport = useGenerateESGReport();

  const handleGenerate = () => {
    generateReport.mutate(
      {
        organizationId,
        reportName: reportName || "ESG Report",
        reportingPeriodStart: periodStart,
        reportingPeriodEnd: periodEnd,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setReportName("");
          setPeriodStart("");
          setPeriodEnd("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient">
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Generate ESG Report</DialogTitle>
          <DialogDescription>
            Create a comprehensive ESG report for your organisation
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="report-name">Report Name</Label>
            <Input
              id="report-name"
              placeholder="Q4 2024 ESG Report"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="period-start">Reporting Period Start</Label>
            <Input
              id="period-start"
              type="date"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="period-end">Reporting Period End</Label>
            <Input
              id="period-end"
              type="date"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={generateReport.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            onClick={handleGenerate}
            disabled={generateReport.isPending || !periodStart || !periodEnd}
          >
            {generateReport.isPending ? "Generating..." : "Generate Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateReportButton;
