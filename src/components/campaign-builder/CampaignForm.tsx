import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { createCampaign, type CampaignFormData } from "@/services/campaignService";
import { Calendar, DollarSign, Globe, Users, Target, Settings, Image, Share2 } from "lucide-react";

interface CampaignFormProps {
  onSuccess: () => void;
}

const CampaignForm = ({ onSuccess }: CampaignFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CampaignFormData>({
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

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      setValue('tags', updatedTags);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    setValue('tags', updatedTags);
  };

  const onSubmit = async (data: CampaignFormData) => {
    setIsSubmitting(true);
    try {
      await createCampaign({ ...data, tags });
      toast({
        title: "Campaign Created!",
        description: "Your campaign has been successfully created and is ready to launch.",
      });
      onSuccess();
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
            <span>Create New Campaign</span>
          </CardTitle>
          <CardDescription>
            Build a compelling campaign that drives real impact and engages your community
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

              <TabsContent value="basics" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Campaign Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter a compelling title"
                      {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Campaign Type *</Label>
                    <Select onValueChange={(value: any) => setValue('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fundraising">Fundraising</SelectItem>
                        <SelectItem value="volunteer">Volunteer</SelectItem>
                        <SelectItem value="awareness">Awareness</SelectItem>
                        <SelectItem value="community">Community</SelectItem>
                        <SelectItem value="petition">Petition</SelectItem>
                        <SelectItem value="social_cause">Social Cause</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization_type">Organization Type *</Label>
                    <Select onValueChange={(value: any) => setValue('organization_type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="charity">Charity</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="social_group">Social Group</SelectItem>
                        <SelectItem value="community_group">Community Group</SelectItem>
                        <SelectItem value="individual">Individual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      {...register("location")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Briefly describe your campaign (1-2 sentences)"
                    rows={3}
                    {...register("description", { required: "Description is required" })}
                  />
                  {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
                </div>
              </TabsContent>

              <TabsContent value="goals" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="goal_type">Goal Type *</Label>
                    <Select onValueChange={(value: any) => setValue('goal_type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="What are you trying to achieve?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monetary">Monetary</SelectItem>
                        <SelectItem value="volunteers">Volunteers</SelectItem>
                        <SelectItem value="signatures">Signatures</SelectItem>
                        <SelectItem value="participants">Participants</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {goalType === 'monetary' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select onValueChange={(value) => setValue('currency', value)} defaultValue="USD">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="CAD">CAD ($)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="goal_amount">
                      Target {goalType === 'monetary' ? 'Amount' : 
                             goalType === 'volunteers' ? 'Volunteers' :
                             goalType === 'signatures' ? 'Signatures' : 'Participants'}
                    </Label>
                    <Input
                      id="goal_amount"
                      type="number"
                      placeholder="Enter target number"
                      {...register("goal_amount", { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      {...register("end_date")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select onValueChange={(value: any) => setValue('urgency', value)} defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="story">Campaign Story *</Label>
                  <Textarea
                    id="story"
                    placeholder="Tell your story in detail. Explain why this campaign matters, what impact it will have, and why people should support it."
                    rows={8}
                    {...register("story", { required: "Campaign story is required" })}
                  />
                  {errors.story && <p className="text-sm text-red-600">{errors.story.message}</p>}
                </div>

                <div className="space-y-4">
                  <Label>Tags</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 mt-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="visibility">Campaign Visibility</Label>
                    <Select onValueChange={(value: any) => setValue('visibility', value)} defaultValue="public">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Anyone can see and join</SelectItem>
                        <SelectItem value="private">Private - Only you can see</SelectItem>
                        <SelectItem value="invite_only">Invite Only - Only invited people can see</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Allow Anonymous Donations</Label>
                        <p className="text-sm text-gray-600">Let people contribute without revealing their identity</p>
                      </div>
                      <Switch
                        defaultChecked
                        onCheckedChange={(checked) => setValue('allow_anonymous_donations', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Comments</Label>
                        <p className="text-sm text-gray-600">Allow supporters to leave comments and messages</p>
                      </div>
                      <Switch
                        defaultChecked
                        onCheckedChange={(checked) => setValue('enable_comments', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Updates</Label>
                        <p className="text-sm text-gray-600">Allow posting progress updates to supporters</p>
                      </div>
                      <Switch
                        defaultChecked
                        onCheckedChange={(checked) => setValue('enable_updates', checked)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="promotion" className="space-y-6 mt-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="promotion_budget">Promotion Budget</Label>
                    <Input
                      id="promotion_budget"
                      type="number"
                      placeholder="Amount to spend on promoting this campaign"
                      {...register("promotion_budget", { valueAsNumber: true })}
                    />
                    <p className="text-sm text-gray-600">
                      Set aside budget to boost your campaign's visibility and reach more supporters
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Promotion Features</h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• Featured placement in search results</li>
                      <li>• Social media promotion tools</li>
                      <li>• Email marketing templates</li>
                      <li>• Analytics and performance tracking</li>
                    </ul>
                  </div>
                </div>
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
