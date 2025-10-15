import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Upload, X, Save, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface DynamicDataFormProps {
  indicator: {
    id: string;
    name: string;
    data_type: string;
    unit?: string;
    guidance?: string;
    validation_rules?: any;
  };
  requestId: string;
  existingData?: any;
  onSubmit: (data: any) => void;
  onSaveDraft?: (data: any) => void;
  isSubmitting?: boolean;
}

export const DynamicDataForm = ({
  indicator,
  requestId,
  existingData,
  onSubmit,
  onSaveDraft,
  isSubmitting
}: DynamicDataFormProps) => {
  const [value, setValue] = useState<any>(existingData?.value || '');
  const [date, setDate] = useState<Date | undefined>(existingData?.date_value);
  const [boolValue, setBoolValue] = useState<boolean>(existingData?.bool_value || false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(existingData?.supporting_documents || []);
  const [unit, setUnit] = useState(existingData?.unit || indicator.unit || '');
  const [notes, setNotes] = useState(existingData?.notes || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDraft, setIsDraft] = useState(false);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!onSaveDraft) return;
    
    const interval = setInterval(() => {
      const draftData = {
        value,
        date_value: date,
        bool_value: boolValue,
        unit,
        notes,
        supporting_documents: uploadedFiles
      };
      onSaveDraft(draftData);
      setIsDraft(true);
      setTimeout(() => setIsDraft(false), 2000);
    }, 30000);

    return () => clearInterval(interval);
  }, [value, date, boolValue, unit, notes, uploadedFiles, onSaveDraft]);

  const handleFileUpload = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const fileArray = Array.from(selectedFiles);
    setFiles(prev => [...prev, ...fileArray]);

    // Upload to Supabase storage
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    const uploadPromises = fileArray.map(async (file) => {
      const filePath = `${user.user!.id}/${requestId}/${file.name}`;
      const { error } = await supabase.storage
        .from('esg-supporting-documents')
        .upload(filePath, file);

      if (error) {
        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('esg-supporting-documents')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    });

    const urls = (await Promise.all(uploadPromises)).filter(Boolean) as string[];
    setUploadedFiles(prev => [...prev, ...urls]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const rules = indicator.validation_rules || {};

    if (indicator.data_type === 'numeric' && value) {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        newErrors.value = "Must be a valid number";
      }
      if (rules.min !== undefined && numValue < rules.min) {
        newErrors.value = `Must be at least ${rules.min}`;
      }
      if (rules.max !== undefined && numValue > rules.max) {
        newErrors.value = `Must be at most ${rules.max}`;
      }
    }

    if (indicator.data_type === 'text' && value) {
      if (rules.minLength && value.length < rules.minLength) {
        newErrors.value = `Must be at least ${rules.minLength} characters`;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        newErrors.value = `Must be at most ${rules.maxLength} characters`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const submissionData = {
      request_id: requestId,
      indicator_id: indicator.id,
      value,
      date_value: date,
      bool_value: boolValue,
      unit,
      notes,
      supporting_documents: uploadedFiles
    };

    onSubmit(submissionData);
  };

  const renderInput = () => {
    switch (indicator.data_type) {
      case 'numeric':
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter value"
                  className={errors.value ? "border-destructive" : ""}
                />
                {errors.value && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.value}
                  </p>
                )}
              </div>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tonnes">Tonnes</SelectItem>
                  <SelectItem value="kg">Kilograms</SelectItem>
                  <SelectItem value="kwh">kWh</SelectItem>
                  <SelectItem value="litres">Litres</SelectItem>
                  <SelectItem value="percent">%</SelectItem>
                  <SelectItem value="count">Count</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <Switch checked={boolValue} onCheckedChange={setBoolValue} id={`switch-${indicator.id}`} />
            <Label htmlFor={`switch-${indicator.id}`} className="cursor-pointer">
              {boolValue ? "Yes" : "No"}
            </Label>
          </div>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="pointer-events-auto" />
            </PopoverContent>
          </Popover>
        );

      case 'choice':
        return (
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {(indicator.validation_rules?.options || []).map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'file':
        return (
          <div className="space-y-3">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop files here, or click to browse
              </p>
              <Input
                type="file"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id={`file-${indicator.id}`}
                accept=".pdf,.xlsx,.xls,.jpg,.jpeg,.png,.docx"
              />
              <Label htmlFor={`file-${indicator.id}`}>
                <Button variant="outline" size="sm" asChild>
                  <span>Choose Files</span>
                </Button>
              </Label>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((url, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm truncate">{url.split('/').pop()}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter your data"
            rows={4}
            className={errors.value ? "border-destructive" : ""}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold">{indicator.name}</Label>
        {indicator.guidance && (
          <p className="text-sm text-muted-foreground mt-1">{indicator.guidance}</p>
        )}
      </div>

      {renderInput()}

      <div>
        <Label>Additional Notes (Optional)</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any context or explanations"
          rows={2}
        />
      </div>

      {indicator.data_type !== 'file' && (
        <div>
          <Label>Supporting Documents (Optional)</Label>
          <Input
            type="file"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            accept=".pdf,.xlsx,.xls,.jpg,.jpeg,.png,.docx"
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button onClick={handleSubmit} disabled={isSubmitting} variant="gradient">
          {isSubmitting ? "Submitting..." : "Submit Data"}
        </Button>
        {onSaveDraft && (
          <Button variant="outline" onClick={() => onSaveDraft({ value, date_value: date, bool_value: boolValue, unit, notes })}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        )}
        {isDraft && (
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Save className="h-3 w-3" />
            Draft saved
          </span>
        )}
      </div>
    </div>
  );
};
