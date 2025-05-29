
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { createCampaign, type CampaignFormData } from "@/services/campaignService";
import { Target, Sparkles } from "lucide-react";
import { type CampaignTemplate } from "@/services/campaignTemplateService";
import BasicInfoTab from "./form-tabs/BasicInfoTab";
import GoalsTab from "./form-tabs/GoalsTab";
import ContentTab from "./form-tabs/ContentTab";
import SettingsTab from "./form-tabs/SettingsTab";
import PromotionTab from "./form-tabs/PromotionTab";

interface CampaignFormProps {
  onSuccess?: () => void;
  onCampaignCreated?: (title: string, description: string, type: 'fundraising' | 'volunteer' | 'awareness' | 'community') => void;
  selectedTemplate?: CampaignTemplate | null;
}

const CampaignForm = ({ onSuccess, onCampaignCreated, selectedTemplate }: CampaignFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<CampaignFormData>({
    defaultValues: {
      urgency: 'medium',
      visibility: 'public',
      allow_anonymous_donations: true,
      enable_comments: true,
      enable_updates: true,
      currency: 'USD'
    }
  });

  const goalType = watch('goal_type');
  const category = watch('category');

  // Pre-fill form with template data when template is selected
  useEffect(() => {
    if (selectedTemplate) {
      const template = selectedTemplate.template_data;
      
      // Reset form and set template values
      reset({
        title: template.title,
        description: template.description,
        story: template.story,
        category: selectedTemplate.category,
        organization_type: selectedTemplate.organization_type,
        goal_type: template.goal_type,
        goal_amount: template.suggested_goal_amount,
        urgency: template.urgency,
        visibility: 'public',
        allow_anonymous_donations: true,
        enable_comments: true,
        enable_updates: true,
        currency: 'USD'
      });

      // Set tags
      setTags(template.tags);
      setValue('tags', template.tags);

      // Set end date if duration is specified
      if (template.duration_days) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + template.duration_days);
        setValue('end_date', endDate.toISOString().split('T')[0]);
      }
    }
  }, [selectedTemplate, reset, setValue]);

  const onSubmit = async (data: CampaignFormData) => {
    setIsSubmitting(true);
    try {
      await createCampaign({ ...data, tags });
      
      // Call the auto-feed integration callback if provided
      if (onCampaignCreated && data.title && data.description && data.category) {
        onCampaignCreated(data.title, data.description, data.category as 'fundraising' | 'volunteer' | 'awareness' | 'community');
      }
      
      toast({
        title: "Campaign Created!",
        description: selectedTemplate 
          ? `Your campaign has been successfully created using the ${selectedTemplate.name} template.`
          : "Your campaign has been successfully created and is ready to launch.",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "There was an error creating your campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-teal-600" />
            {selectedTemplate && <Sparkles className="h-6 w-6 text-yellow-500" />}
            <span>
              {selectedTemplate ? `Create Campaign from Template` : "Create New Campaign"}
            </span>
          </CardTitle>
          <CardDescription>
            {selectedTemplate ? (
              <>Using template: <strong>{selectedTemplate.name}</strong> - All fields have been pre-filled with proven content. Customize as needed.</>
            ) : (
              "Build a compelling campaign that drives real impact and engages your community"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Tabs defaultValue="basics" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="promotion">Promotion</TabsTrigger>
              </TabsList>

              <TabsContent value="basics">
                <BasicInfoTab
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  selectedTemplate={selectedTemplate}
                  category={category}
                />
              </TabsContent>

              <TabsContent value="goals">
                <GoalsTab
                  register={register}
                  setValue={setValue}
                  watch={watch}
                />
              </TabsContent>

              <TabsContent value="content">
                <ContentTab
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  tags={tags}
                  setTags={setTags}
                />
              </TabsContent>

              <TabsContent value="settings">
                <SettingsTab setValue={setValue} />
              </TabsContent>

              <TabsContent value="promotion">
                <PromotionTab register={register} />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onSuccess}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700">
                {isSubmitting ? "Creating..." : "Create Campaign"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignForm;
