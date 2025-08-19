import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Download, 
  Calendar, 
  Settings, 
  Eye,
  Save,
  Send,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

interface ReportTemplate {
  id: string;
  name: string;
  framework: string;
  description: string;
  sections: string[];
  estimatedTime: string;
  status: 'draft' | 'in_progress' | 'completed';
}

const ESGReportBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('gri');
  const [reportData, setReportData] = useState({
    title: '',
    reportingPeriod: '',
    executiveSummary: '',
    selectedSections: [] as string[]
  });

  // Mock data - in real app, this would come from the service
  const reportTemplates: ReportTemplate[] = [
    {
      id: 'gri',
      name: 'GRI Standards Report',
      framework: 'GRI',
      description: 'Comprehensive sustainability report following GRI Standards',
      sections: ['Organizational Profile', 'Strategy', 'Ethics & Integrity', 'Governance', 'Stakeholder Engagement'],
      estimatedTime: '4-6 weeks',
      status: 'draft'
    },
    {
      id: 'sasb',
      name: 'SASB Report',
      framework: 'SASB',
      description: 'Industry-specific sustainability accounting standards',
      sections: ['Material Topics', 'Accounting Metrics', 'Activity Metrics', 'Forward-Looking Guidance'],
      estimatedTime: '3-4 weeks',
      status: 'in_progress'
    },
    {
      id: 'tcfd',
      name: 'TCFD Report',
      framework: 'TCFD',
      description: 'Climate-related financial disclosures',
      sections: ['Governance', 'Strategy', 'Risk Management', 'Metrics & Targets'],
      estimatedTime: '2-3 weeks',
      status: 'completed'
    },
    {
      id: 'integrated',
      name: 'Integrated Report',
      framework: 'IIRC',
      description: 'Integrated thinking and reporting framework',
      sections: ['Value Creation Process', 'Business Model', 'Performance', 'Outlook', 'Basis of Preparation'],
      estimatedTime: '6-8 weeks',
      status: 'draft'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Clock;
      default: return AlertCircle;
    }
  };

  const handleSectionToggle = (section: string) => {
    const updatedSections = reportData.selectedSections.includes(section)
      ? reportData.selectedSections.filter(s => s !== section)
      : [...reportData.selectedSections, section];
    
    setReportData({ ...reportData, selectedSections: updatedSections });
  };

  const selectedTemplateData = reportTemplates.find(t => t.id === selectedTemplate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ESG Report Builder
          </h2>
          <p className="text-muted-foreground mt-1">
            Create comprehensive ESG reports using industry-standard frameworks
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button variant="gradient" size="sm">
            <Send className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-secondary/20">
          <TabsTrigger 
            value="templates"
            className="text-soulve-teal hover:text-soulve-blue data-[state=active]:bg-gradient-to-r data-[state=active]:from-soulve-teal data-[state=active]:to-soulve-blue data-[state=active]:text-white"
          >
            Templates
          </TabsTrigger>
          <TabsTrigger 
            value="customize"
            className="text-soulve-teal hover:text-soulve-blue data-[state=active]:bg-gradient-to-r data-[state=active]:from-soulve-teal data-[state=active]:to-soulve-blue data-[state=active]:text-white"
          >
            Customize
          </TabsTrigger>
          <TabsTrigger 
            value="preview"
            className="text-soulve-teal hover:text-soulve-blue data-[state=active]:bg-gradient-to-r data-[state=active]:from-soulve-teal data-[state=active]:to-soulve-blue data-[state=active]:text-white"
          >
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTemplates.map((template) => {
              const StatusIcon = getStatusIcon(template.status);
              return (
                <Card 
                  key={template.id}
                  className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <Badge variant="outline" className="mt-1">
                        {template.framework}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusIcon className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline" className={getStatusColor(template.status)}>
                        {template.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">{template.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Time:</span>
                      <span className="font-medium">{template.estimatedTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Sections:</span>
                      <span className="font-medium">{template.sections.length} sections</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-soulve-teal/20">
                    <div className="flex flex-wrap gap-1">
                      {template.sections.slice(0, 3).map((section) => (
                        <Badge key={section} variant="secondary" className="text-xs">
                          {section}
                        </Badge>
                      ))}
                      {template.sections.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.sections.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="customize" className="mt-6">
          {selectedTemplateData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Report Configuration */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Report Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Report Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter report title"
                      value={reportData.title}
                      onChange={(e) => setReportData({ ...reportData, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="period">Reporting Period</Label>
                    <Input
                      id="period"
                      placeholder="e.g., January 2024 - December 2024"
                      value={reportData.reportingPeriod}
                      onChange={(e) => setReportData({ ...reportData, reportingPeriod: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="summary">Executive Summary</Label>
                    <Textarea
                      id="summary"
                      placeholder="Brief overview of ESG performance and key highlights"
                      rows={4}
                      value={reportData.executiveSummary}
                      onChange={(e) => setReportData({ ...reportData, executiveSummary: e.target.value })}
                    />
                  </div>
                </div>
              </Card>

              {/* Section Selection */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Report Sections</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Select the sections to include in your {selectedTemplateData.name}
                </p>
                <div className="space-y-3">
                  {selectedTemplateData.sections.map((section) => (
                    <div key={section} className="flex items-center space-x-3">
                       <input
                         type="checkbox"
                         id={section}
                         checked={reportData.selectedSections.includes(section)}
                         onChange={() => handleSectionToggle(section)}
                         className="rounded border-soulve-teal text-soulve-teal focus:ring-soulve-teal"
                       />
                      <Label htmlFor={section} className="flex-1 cursor-pointer">
                        {section}
                      </Label>
                    </div>
                  ))}
                </div>

                 {/* Data Completeness Indicator */}
                 <div className="mt-6 p-4 bg-gradient-to-r from-soulve-teal/10 to-soulve-blue/10 rounded-lg border border-soulve-teal/30">
                   <h4 className="font-medium text-soulve-teal mb-2">Data Completeness</h4>
                   <div className="space-y-2">
                     <div className="flex justify-between text-sm">
                       <span className="text-soulve-teal">Environmental Data</span>
                       <span className="font-medium text-soulve-teal">85%</span>
                     </div>
                     <div className="w-full bg-soulve-teal/20 rounded-full h-2">
                       <div className="bg-soulve-teal h-2 rounded-full" style={{ width: '85%' }}></div>
                     </div>
                   </div>
                   <div className="space-y-2 mt-2">
                     <div className="flex justify-between text-sm">
                       <span className="text-soulve-blue">Social Data</span>
                       <span className="font-medium text-soulve-blue">72%</span>
                     </div>
                     <div className="w-full bg-soulve-blue/20 rounded-full h-2">
                       <div className="bg-soulve-blue h-2 rounded-full" style={{ width: '72%' }}></div>
                     </div>
                   </div>
                   <div className="space-y-2 mt-2">
                     <div className="flex justify-between text-sm">
                       <span className="text-soulve-purple">Governance Data</span>
                       <span className="font-medium text-soulve-purple">90%</span>
                     </div>
                     <div className="w-full bg-soulve-purple/20 rounded-full h-2">
                       <div className="bg-soulve-purple h-2 rounded-full" style={{ width: '90%' }}></div>
                     </div>
                   </div>
                 </div>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Report Preview</h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Full Preview
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>

            {selectedTemplateData && (
              <div className="space-y-6">
                 {/* Report Header */}
                 <div className="text-center border-b border-soulve-teal/20 pb-6">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {reportData.title || selectedTemplateData.name}
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    {reportData.reportingPeriod || 'Reporting Period Not Set'}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {selectedTemplateData.framework} Framework
                  </Badge>
                </div>

                {/* Executive Summary */}
                {reportData.executiveSummary && (
                  <div>
                    <h2 className="text-lg font-semibold mb-3">Executive Summary</h2>
                    <p className="text-muted-foreground">{reportData.executiveSummary}</p>
                  </div>
                )}

                {/* Selected Sections */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">Report Contents</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(reportData.selectedSections.length > 0 ? reportData.selectedSections : selectedTemplateData.sections).map((section, index) => (
                       <div key={section} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-soulve-teal/5 to-soulve-blue/5 rounded border border-soulve-teal/20">
                         <div className="w-8 h-8 bg-gradient-to-r from-soulve-teal to-soulve-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
                           {index + 1}
                         </div>
                        <span className="font-medium">{section}</span>
                      </div>
                    ))}
                  </div>
                </div>

                 {/* Generation Status */}
                 <div className="bg-gradient-to-r from-soulve-teal/10 to-soulve-blue/10 border border-soulve-teal/30 rounded-lg p-4">
                   <div className="flex items-center space-x-2">
                     <CheckCircle className="h-5 w-5 text-soulve-teal" />
                     <span className="font-medium text-soulve-teal">Ready to Generate</span>
                   </div>
                   <p className="text-soulve-blue text-sm mt-1">
                     All required data is available. Report can be generated in approximately 5-10 minutes.
                   </p>
                 </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ESGReportBuilder;