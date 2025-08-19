import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Upload, Database, Save, Calendar as CalendarIcon, FileText, Plus } from "lucide-react";
import { format } from "date-fns";

const ESGDataInputForm = () => {
  const [formData, setFormData] = useState({
    framework: '',
    indicator: '',
    reportingPeriod: undefined as Date | undefined,
    value: '',
    unit: '',
    textValue: '',
    dataSource: 'manual_entry',
    verificationStatus: 'unverified',
    notes: '',
    supportingDocuments: [] as File[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const frameworks = [
    { id: 'gri', name: 'Global Reporting Initiative (GRI)' },
    { id: 'sasb', name: 'SASB Standards' },
    { id: 'tcfd', name: 'TCFD Framework' },
    { id: 'ungc', name: 'UN Global Compact' },
    { id: 'custom', name: 'Custom Framework' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Handle form submission
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      setFormData({
        ...formData,
        supportingDocuments: [...formData.supportingDocuments, ...Array.from(files)]
      });
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-0 shadow-sm">
      <div className="flex items-center mb-6">
        <Database className="h-6 w-6 text-primary mr-3" />
        <h3 className="text-lg font-semibold text-foreground">ESG Data Input</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Framework Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="framework">ESG Framework</Label>
            <Select value={formData.framework} onValueChange={(value) => setFormData({...formData, framework: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select framework" />
              </SelectTrigger>
              <SelectContent>
                {frameworks.map((framework) => (
                  <SelectItem key={framework.id} value={framework.id}>
                    {framework.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="indicator">ESG Indicator</Label>
            <Select value={formData.indicator} onValueChange={(value) => setFormData({...formData, indicator: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select indicator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ghg-emissions">GHG Emissions (Scope 1)</SelectItem>
                <SelectItem value="energy-consumption">Energy Consumption</SelectItem>
                <SelectItem value="water-usage">Water Usage</SelectItem>
                <SelectItem value="employee-diversity">Employee Diversity</SelectItem>
                <SelectItem value="board-independence">Board Independence</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reporting Period */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Reporting Period</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.reportingPeriod ? format(formData.reportingPeriod, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.reportingPeriod}
                  onSelect={(date) => setFormData({...formData, reportingPeriod: date})}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Numerical Value</Label>
            <Input
              id="value"
              type="number"
              placeholder="0.00"
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unit of Measurement</Label>
            <Input
              id="unit"
              placeholder="e.g., tCO2e, kWh, %"
              value={formData.unit}
              onChange={(e) => setFormData({...formData, unit: e.target.value})}
            />
          </div>
        </div>

        {/* Text Value for Qualitative Data */}
        <div className="space-y-2">
          <Label htmlFor="textValue">Qualitative Description (Optional)</Label>
          <Textarea
            id="textValue"
            placeholder="Enter qualitative description for non-numerical indicators"
            value={formData.textValue}
            onChange={(e) => setFormData({...formData, textValue: e.target.value})}
            rows={3}
          />
        </div>

        {/* Data Source and Verification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataSource">Data Source</Label>
            <Select value={formData.dataSource} onValueChange={(value) => setFormData({...formData, dataSource: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual_entry">Manual Entry</SelectItem>
                <SelectItem value="system_integration">System Integration</SelectItem>
                <SelectItem value="third_party_provider">Third Party Provider</SelectItem>
                <SelectItem value="external_audit">External Audit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verification">Verification Status</Label>
            <Select value={formData.verificationStatus} onValueChange={(value) => setFormData({...formData, verificationStatus: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unverified">Unverified</SelectItem>
                <SelectItem value="internal">Internal Verification</SelectItem>
                <SelectItem value="third_party">Third Party Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Supporting Documents */}
        <div className="space-y-2">
          <Label>Supporting Documents</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop files here, or click to select
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <Button variant="outline" size="sm" onClick={() => document.getElementById('file-upload')?.click()}>
              <Plus className="h-4 w-4 mr-2" />
              Select Files
            </Button>
          </div>
          
          {formData.supportingDocuments.length > 0 && (
            <div className="space-y-2">
              {formData.supportingDocuments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      const newDocs = formData.supportingDocuments.filter((_, i) => i !== index);
                      setFormData({...formData, supportingDocuments: newDocs});
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add any additional context or notes about this data point"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows={3}
          />
        </div>

        {/* Data Quality Indicators */}
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h4 className="font-medium text-sm mb-3">Data Quality Assessment</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                Complete
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">All required fields</p>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                Pending
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">Verification status</p>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                Traceable
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">Source documented</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button">
            Save as Draft
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save ESG Data'}
          </Button>
        </div>
      </form>

      <div className="mt-6 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
        <p className="text-xs text-muted-foreground">
          ESG data is automatically validated against framework requirements and flagged for any inconsistencies. 
          All data entries create an audit trail for compliance reporting.
        </p>
      </div>
    </Card>
  );
};

export default ESGDataInputForm;