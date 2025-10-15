import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInitiativeTemplates, createInitiative } from '@/services/esgInitiativeService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface InitiativeWizardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
}

const InitiativeWizardDialog = ({ open, onOpenChange, organizationId }: InitiativeWizardDialogProps) => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    initiative_name: '',
    initiative_type: 'report' as const,
    description: '',
    reporting_period_start: undefined as Date | undefined,
    reporting_period_end: undefined as Date | undefined,
    due_date: undefined as Date | undefined,
    target_stakeholder_groups: [] as string[],
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: templates } = useQuery({
    queryKey: ['esg-initiative-templates'],
    queryFn: getInitiativeTemplates,
    enabled: open
  });

  const createMutation = useMutation({
    mutationFn: createInitiative,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esg-initiatives', organizationId] });
      toast({
        title: 'Initiative Created',
        description: 'Your ESG initiative has been created successfully.',
      });
      onOpenChange(false);
      resetWizard();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create initiative',
        variant: 'destructive',
      });
    }
  });

  const resetWizard = () => {
    setStep(1);
    setSelectedTemplate(null);
    setFormData({
      initiative_name: '',
      initiative_type: 'report',
      description: '',
      reporting_period_start: undefined,
      reporting_period_end: undefined,
      due_date: undefined,
      target_stakeholder_groups: [],
    });
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates?.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setFormData(prev => ({
        ...prev,
        initiative_name: template.name,
        description: template.description || '',
        target_stakeholder_groups: template.suggested_stakeholder_types || []
      }));
    }
  };

  const handleSubmit = () => {
    createMutation.mutate({
      organization_id: organizationId,
      ...formData,
      reporting_period_start: formData.reporting_period_start?.toISOString(),
      reporting_period_end: formData.reporting_period_end?.toISOString(),
      due_date: formData.due_date?.toISOString(),
    });
  };

  const canProgress = () => {
    switch (step) {
      case 1:
        return true; // Can skip template selection
      case 2:
        return formData.initiative_name.trim().length > 0;
      case 3:
        return formData.target_stakeholder_groups.length > 0;
      default:
        return true;
    }
  };

  const stakeholderTypes = ['suppliers', 'employees', 'investors', 'community', 'regulators', 'customers'];

  const toggleStakeholder = (type: string) => {
    setFormData(prev => ({
      ...prev,
      target_stakeholder_groups: prev.target_stakeholder_groups.includes(type)
        ? prev.target_stakeholder_groups.filter(t => t !== type)
        : [...prev.target_stakeholder_groups, type]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Create New ESG Initiative
          </DialogTitle>
          <DialogDescription>
            Step {step} of 4: {step === 1 && 'Choose Template'}
            {step === 2 && 'Initiative Details'}
            {step === 3 && 'Select Stakeholders'}
            {step === 4 && 'Review & Create'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {/* Step 1: Template Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="font-semibold mb-2">Start with a template or create from scratch</h3>
                <p className="text-sm text-muted-foreground">
                  Templates include pre-configured indicators and suggested stakeholders
                </p>
              </div>
              
              <Button
                variant={selectedTemplate === null ? 'default' : 'outline'}
                className={cn(
                  "w-full justify-start h-auto p-4",
                  selectedTemplate === null && "bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
                )}
                onClick={() => setSelectedTemplate(null)}
              >
                <div className="text-left">
                  <div className="font-semibold">Start from Scratch</div>
                  <div className="text-sm opacity-80">Build a custom initiative</div>
                </div>
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {templates?.map(template => (
                  <Button
                    key={template.id}
                    variant={selectedTemplate === template.id ? 'default' : 'outline'}
                    className={cn(
                      "h-auto p-4 justify-start",
                      selectedTemplate === template.id && "bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
                    )}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className="text-left">
                      <div className="font-semibold">{template.name}</div>
                      <Badge variant="secondary" className="mt-1">
                        {template.category}
                      </Badge>
                      <div className="text-xs opacity-80 mt-1">{template.typical_duration_days} days typical</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Initiative Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="initiative_name">Initiative Name *</Label>
                <Input
                  id="initiative_name"
                  value={formData.initiative_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, initiative_name: e.target.value }))}
                  placeholder="e.g., Q4 2024 Sustainability Report"
                />
              </div>

              <div>
                <Label htmlFor="initiative_type">Type</Label>
                <Select
                  value={formData.initiative_type}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, initiative_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="audit">Audit</SelectItem>
                    <SelectItem value="certification">Certification</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the purpose and scope of this initiative"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.reporting_period_start ? format(formData.reporting_period_start, 'PPP') : 'Pick date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.reporting_period_start}
                        onSelect={(date) => setFormData(prev => ({ ...prev, reporting_period_start: date }))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.reporting_period_end ? format(formData.reporting_period_end, 'PPP') : 'Pick date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.reporting_period_end}
                        onSelect={(date) => setFormData(prev => ({ ...prev, reporting_period_end: date }))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.due_date ? format(formData.due_date, 'PPP') : 'Pick date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.due_date}
                        onSelect={(date) => setFormData(prev => ({ ...prev, due_date: date }))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Stakeholder Selection */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="font-semibold mb-2">Select Target Stakeholder Groups *</h3>
                <p className="text-sm text-muted-foreground">
                  Choose the groups you'll request data from
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {stakeholderTypes.map(type => (
                  <Button
                    key={type}
                    variant={formData.target_stakeholder_groups.includes(type) ? 'default' : 'outline'}
                    className={cn(
                      "h-auto p-4",
                      formData.target_stakeholder_groups.includes(type) && 
                      "bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
                    )}
                    onClick={() => toggleStakeholder(type)}
                  >
                    {formData.target_stakeholder_groups.includes(type) && (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="font-semibold mb-2">Review & Create</h3>
                <p className="text-sm text-muted-foreground">
                  Review your initiative details before creating
                </p>
              </div>

              <Card className="p-4 space-y-3">
                <div>
                  <Label className="text-muted-foreground">Initiative Name</Label>
                  <p className="font-medium">{formData.initiative_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium capitalize">{formData.initiative_type}</p>
                </div>
                {formData.description && (
                  <div>
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="font-medium text-sm">{formData.description}</p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Stakeholder Groups</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.target_stakeholder_groups.map(group => (
                      <Badge key={group} variant="secondary">{group}</Badge>
                    ))}
                  </div>
                </div>
                {formData.due_date && (
                  <div>
                    <Label className="text-muted-foreground">Due Date</Label>
                    <p className="font-medium">{format(formData.due_date, 'PPP')}</p>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex w-full justify-between">
            <Button
              variant="outline"
              onClick={() => step > 1 ? setStep(step - 1) : onOpenChange(false)}
            >
              {step > 1 ? (
                <>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </>
              ) : (
                'Cancel'
              )}
            </Button>
            
            {step < 4 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProgress()}
                className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending}
                className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Initiative'}
                <Check className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InitiativeWizardDialog;
