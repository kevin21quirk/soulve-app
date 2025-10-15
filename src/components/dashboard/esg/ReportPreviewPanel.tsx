import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Eye, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

interface ReportPreviewPanelProps {
  initiativeId: string;
  reportData?: {
    completeness: {
      environmental: number;
      social: number;
      governance: number;
      overall: number;
    };
    missingData: {
      category: string;
      indicator: string;
      stakeholder: string;
    }[];
    lastUpdated: string;
  };
  onGenerateReport?: () => void;
  isGenerating?: boolean;
}

export const ReportPreviewPanel = ({
  initiativeId,
  reportData,
  onGenerateReport,
  isGenerating
}: ReportPreviewPanelProps) => {
  const [previewMode, setPreviewMode] = useState<'summary' | 'detailed'>('summary');

  const getCompletenessColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getCompletenessStatus = (percentage: number) => {
    if (percentage >= 100) return { text: "Ready", icon: CheckCircle2, color: "bg-green-50 text-green-800 border-green-200" };
    if (percentage >= 80) return { text: "Nearly Complete", icon: Clock, color: "bg-yellow-50 text-yellow-800 border-yellow-200" };
    return { text: "In Progress", icon: AlertTriangle, color: "bg-orange-50 text-orange-800 border-orange-200" };
  };

  if (!reportData) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No report data available yet</p>
        </div>
      </Card>
    );
  }

  const overallStatus = getCompletenessStatus(reportData.completeness.overall);
  const StatusIcon = overallStatus.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Report Preview
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Last updated: {new Date(reportData.lastUpdated).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={overallStatus.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {overallStatus.text}
            </Badge>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Completeness</span>
            <span className={`text-lg font-bold ${getCompletenessColor(reportData.completeness.overall)}`}>
              {reportData.completeness.overall}%
            </span>
          </div>
          <Progress value={reportData.completeness.overall} className="h-3" />
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button 
            variant="gradient" 
            onClick={onGenerateReport}
            disabled={isGenerating || reportData.completeness.overall < 80}
          >
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating..." : "Generate Final Report"}
          </Button>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview Draft
          </Button>
        </div>
        
        {reportData.completeness.overall < 80 && (
          <p className="text-sm text-muted-foreground mt-2">
            ⚠️ Report generation requires at least 80% data completeness
          </p>
        )}
      </Card>

      {/* Category Breakdown */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Data Completeness by Category</h4>
        <div className="space-y-4">
          {[
            { label: 'Environmental', key: 'environmental', icon: '🌱' },
            { label: 'Social', key: 'social', icon: '👥' },
            { label: 'Governance', key: 'governance', icon: '⚖️' }
          ].map(({ label, key, icon }) => {
            const value = reportData.completeness[key as keyof typeof reportData.completeness];
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <span>{icon}</span>
                    {label}
                  </span>
                  <span className={`font-semibold ${getCompletenessColor(value)}`}>
                    {value}%
                  </span>
                </div>
                <Progress value={value} className="h-2" />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Missing Data Section */}
      {reportData.missingData.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Missing Data ({reportData.missingData.length} items)
          </h4>
          <div className="space-y-3">
            {reportData.missingData.map((item, index) => (
              <div key={index} className="border-l-4 border-yellow-400 pl-4 py-2 bg-yellow-50/50">
                <div className="font-medium text-sm">{item.indicator}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Category: {item.category} • Pending from: {item.stakeholder}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Preview Tabs */}
      <Card className="p-6">
        <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summary">Executive Summary</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-4 space-y-4">
            <div className="prose prose-sm max-w-none">
              <h3>Executive Summary</h3>
              <p className="text-muted-foreground">
                This ESG report demonstrates our commitment to sustainable and responsible business practices.
                Current data collection shows <strong>{reportData.completeness.overall}%</strong> completion across all ESG categories.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-4 not-prose">
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-700">{reportData.completeness.environmental}%</div>
                  <div className="text-sm text-green-600">Environmental</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">{reportData.completeness.social}%</div>
                  <div className="text-sm text-blue-600">Social</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-700">{reportData.completeness.governance}%</div>
                  <div className="text-sm text-purple-600">Governance</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="detailed" className="mt-4">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Available Data Sections</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Carbon Emissions (Scope 1 & 2)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Energy Consumption
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    Water Usage (Partial data)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Employee Demographics
                  </li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                Full detailed preview will be available when data collection reaches 100%
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
