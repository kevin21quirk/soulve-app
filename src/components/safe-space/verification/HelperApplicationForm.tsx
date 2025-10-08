import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useHelperVerification } from '@/hooks/useHelperVerification';
import { ArrowLeft, ArrowRight, CheckCircle2, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Qualification, ReferenceContact } from '@/types/helperVerification';
import { supabase } from '@/integrations/supabase/client';

const SPECIALIZATIONS = [
  'general',
  'anxiety',
  'depression',
  'grief_loss',
  'relationship_issues',
  'work_stress',
  'self_esteem',
  'trauma',
  'substance_abuse',
  'eating_disorders'
];

// Step 1: Personal Statement
const personalStatementSchema = z.object({
  personal_statement: z.string()
    .min(1, 'Personal statement is required')
    .max(2000, 'Personal statement must not exceed 2000 characters')
});

// Step 2: Experience & Qualifications
const experienceSchema = z.object({
  experience_description: z.string()
    .min(1, 'Experience description is required')
    .max(1000, 'Experience description must not exceed 1000 characters'),
  preferred_specializations: z.array(z.string())
    .min(1, 'Please select at least one specialization')
    .max(5, 'Please select no more than 5 specializations')
});

// Step 3: References
const referencesSchema = z.object({
  references: z.array(z.object({
    name: z.string().min(2, 'Name is required').max(100),
    email: z.string().email('Invalid email address').max(255),
    phone: z.string().optional(),
    relationship: z.string().min(2, 'Relationship is required').max(100)
  })).min(2, 'Please provide at least 2 references').max(3, 'Maximum 3 references allowed')
});

// Step 4: Availability
const availabilitySchema = z.object({
  availability_commitment: z.string()
    .min(10, 'Please describe your availability')
    .max(500, 'Availability description is too long')
});

type Step = 1 | 2 | 3 | 4;

export const HelperApplicationForm = () => {
  const { application, createApplication, updateApplication, submitApplication, loading } = useHelperVerification();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [newQualification, setNewQualification] = useState<Partial<Qualification>>({});

  // Form for Step 1
  const form1 = useForm({
    resolver: zodResolver(personalStatementSchema),
    defaultValues: {
      personal_statement: application?.personal_statement || ''
    }
  });

  // Form for Step 2
  const form2 = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      experience_description: application?.experience_description || '',
      preferred_specializations: application?.preferred_specializations || []
    }
  });

  // Form for Step 3
  const form3 = useForm({
    resolver: zodResolver(referencesSchema),
    defaultValues: {
      references: application?.reference_contacts || [
        { name: '', email: '', phone: '', relationship: '' },
        { name: '', email: '', phone: '', relationship: '' }
      ]
    }
  });

  // Form for Step 4
  const form4 = useForm({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      availability_commitment: application?.availability_commitment || ''
    }
  });

  useEffect(() => {
    if (application) {
      form1.reset({ personal_statement: application.personal_statement || '' });
      form2.reset({
        experience_description: application.experience_description || '',
        preferred_specializations: application.preferred_specializations || []
      });
      form3.reset({
        references: application.reference_contacts.length > 0 
          ? application.reference_contacts 
          : [
              { name: '', email: '', phone: '', relationship: '' },
              { name: '', email: '', phone: '', relationship: '' }
            ]
      });
      form4.reset({ availability_commitment: application.availability_commitment || '' });
      setQualifications(application.qualifications || []);
    }
  }, [application]);

  const initializeApplication = async () => {
    if (!application) {
      await createApplication();
    }
  };

  useEffect(() => {
    initializeApplication();
  }, []);

  const saveAndNext = async (data: any, nextStep: Step) => {
    if (!application) return;

    const updates: any = {};
    
    if (currentStep === 1) {
      updates.personal_statement = data.personal_statement;
    } else if (currentStep === 2) {
      updates.experience_description = data.experience_description;
      updates.preferred_specializations = data.preferred_specializations;
      updates.qualifications = qualifications;
    } else if (currentStep === 3) {
      updates.reference_contacts = data.references;
      
      // Send reference emails after saving
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && application?.id) {
          await supabase.functions.invoke('send-reference-request', {
            body: {
              applicationId: application.id,
              applicantName: user.user_metadata?.first_name || 'A Safe Space applicant',
              references: data.references.filter((ref: any) => ref.email)
            }
          });
          toast({
            title: "References Notified",
            description: "Reference request emails have been sent."
          });
        }
      } catch (error) {
        console.error('Error sending reference emails:', error);
        toast({
          title: "Note",
          description: "Application saved, but reference emails could not be sent.",
          variant: "default"
        });
      }
    } else if (currentStep === 4) {
      updates.availability_commitment = data.availability_commitment;
    }

    await updateApplication(updates);
    setCurrentStep(nextStep);
  };

  const handleSubmitApplication = async (data: any) => {
    if (!application) return;

    await updateApplication({
      availability_commitment: data.availability_commitment
    });

    const success = await submitApplication();
    if (success) {
      toast({
        title: "Application Submitted!",
        description: "Your helper application has been submitted for review."
      });
    }
  };

  const addQualification = () => {
    if (newQualification.type && newQualification.title && newQualification.institution && newQualification.year) {
      setQualifications([...qualifications, newQualification as Qualification]);
      setNewQualification({});
    }
  };

  const removeQualification = (index: number) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
  };

  const toggleSpecialization = (spec: string, currentValues: string[]) => {
    if (currentValues.includes(spec)) {
      return currentValues.filter(s => s !== spec);
    } else if (currentValues.length < 5) {
      return [...currentValues, spec];
    }
    return currentValues;
  };

  const progressPercentage = (currentStep / 4) * 100;

  if (loading && !application) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading application...</p>
        </CardContent>
      </Card>
    );
  }

  if (application?.application_status === 'submitted') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            Application Submitted
          </CardTitle>
          <CardDescription>
            Your application has been submitted and is under review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We'll notify you once your application has been reviewed. This typically takes 5-7 business days.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Step {currentStep} of 4</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-4">
              <span className={currentStep >= 1 ? 'text-primary font-medium' : ''}>Statement</span>
              <span className={currentStep >= 2 ? 'text-primary font-medium' : ''}>Experience</span>
              <span className={currentStep >= 3 ? 'text-primary font-medium' : ''}>References</span>
              <span className={currentStep >= 4 ? 'text-primary font-medium' : ''}>Availability</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Personal Statement */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Statement</CardTitle>
            <CardDescription>
              Tell us why you want to become a Safe Space helper (500-2000 characters)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form1}>
              <form onSubmit={form1.handleSubmit((data) => saveAndNext(data, 2))} className="space-y-6">
                <FormField
                  control={form1.control}
                  name="personal_statement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why do you want to be a helper?</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Share your motivation, relevant experiences, and what you hope to achieve as a Safe Space helper..."
                          className="min-h-[200px] resize-y"
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0} / 2000 characters
                        {field.value?.length >= 200 && ' • We recommend at least 500 characters for a strong application'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit">
                    Next Step <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Experience & Qualifications */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Experience & Qualifications</CardTitle>
            <CardDescription>
              Share your relevant experience and select your areas of expertise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form2}>
              <form onSubmit={form2.handleSubmit((data) => saveAndNext(data, 3))} className="space-y-6">
                <FormField
                  control={form2.control}
                  name="experience_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relevant Experience</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe your experience in counseling, mental health support, social work, or related fields..."
                          className="min-h-[150px] resize-y"
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0} / 1000 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Qualifications */}
                <div className="space-y-4">
                  <FormLabel>Qualifications (Optional)</FormLabel>
                  <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        placeholder="Type (e.g., Degree, Certificate)"
                        value={newQualification.type || ''}
                        onChange={(e) => setNewQualification({ ...newQualification, type: e.target.value })}
                      />
                      <Input
                        placeholder="Title"
                        value={newQualification.title || ''}
                        onChange={(e) => setNewQualification({ ...newQualification, title: e.target.value })}
                      />
                      <Input
                        placeholder="Institution"
                        value={newQualification.institution || ''}
                        onChange={(e) => setNewQualification({ ...newQualification, institution: e.target.value })}
                      />
                      <Input
                        type="number"
                        placeholder="Year"
                        min="1950"
                        max={new Date().getFullYear()}
                        value={newQualification.year || ''}
                        onChange={(e) => setNewQualification({ ...newQualification, year: parseInt(e.target.value) })}
                      />
                    </div>
                    <Button type="button" onClick={addQualification} variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Add Qualification
                    </Button>
                  </div>

                  {qualifications.length > 0 && (
                    <div className="space-y-2">
                      {qualifications.map((qual, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{qual.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {qual.type} • {qual.institution} • {qual.year}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQualification(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Specializations */}
                <FormField
                  control={form2.control}
                  name="preferred_specializations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Specializations (1-5)</FormLabel>
                      <FormDescription>
                        Select areas where you feel most confident providing support
                      </FormDescription>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          {SPECIALIZATIONS.map((spec) => (
                            <Badge
                              key={spec}
                              variant={field.value.includes(spec) ? 'default' : 'outline'}
                              className="cursor-pointer"
                              onClick={() => {
                                const newValue = toggleSpecialization(spec, field.value);
                                field.onChange(newValue);
                              }}
                            >
                              {spec.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button type="submit">
                    Next Step <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Step 3: References */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Professional References</CardTitle>
            <CardDescription>
              Provide 2-3 professional references who can vouch for your character and abilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form3}>
              <form onSubmit={form3.handleSubmit((data) => saveAndNext(data, 4))} className="space-y-6">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <h4 className="font-medium text-sm">Reference {index + 1} {index === 2 && '(Optional)'}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form3.control}
                        name={`references.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Jane Smith" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form3.control}
                        name={`references.${index}.relationship`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Supervisor, Colleague" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form3.control}
                        name={`references.${index}.email`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="jane@example.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form3.control}
                        name={`references.${index}.phone`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="+44 123 456 7890" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button type="submit">
                    Next Step <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Availability */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Availability Commitment</CardTitle>
            <CardDescription>
              Tell us about your availability to help others
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form4}>
              <form onSubmit={form4.handleSubmit(handleSubmitApplication)} className="space-y-6">
                <FormField
                  control={form4.control}
                  name="availability_commitment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>When can you be available?</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe your typical availability (days, times, hours per week)..."
                          className="min-h-[120px] resize-y"
                        />
                      </FormControl>
                      <FormDescription>
                        Be realistic about your time commitment. Quality is more important than quantity.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                  <h4 className="font-medium mb-2 text-sm">Next Steps</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Submit your application for review</li>
                    <li>Complete identity verification</li>
                    <li>Obtain background check (DBS certificate)</li>
                    <li>Complete training modules</li>
                    <li>Wait for admin approval</li>
                  </ul>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(3)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button type="submit" className="bg-primary">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Submit Application
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
