import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, ShieldCheck, FileText, Clock, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const ReportIssue = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [contentLink, setContentLink] = useState("");
  const [email, setEmail] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const issueTypes = [
    { value: "harassment", label: "Harassment or Bullying", icon: "👤" },
    { value: "spam", label: "Spam or Scam", icon: "🚫" },
    { value: "inappropriate_content", label: "Inappropriate Content", icon: "⚠️" },
    { value: "fake_account", label: "Impersonation or Fake Account", icon: "🎭" },
    { value: "fraud", label: "Campaign Fraud or Misuse", icon: "💰" },
    { value: "technical", label: "Technical Issue", icon: "🔧" },
    { value: "privacy", label: "Privacy Concern", icon: "🔒" },
    { value: "other", label: "Other", icon: "📝" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!issueType || !description) {
      toast({
        title: "Missing information",
        description: "Please select an issue type and provide details",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("content_reports").insert({
        reported_by: anonymous ? null : user?.id,
        content_id: contentLink || null,
        content_type: "report",
        reason: issueType,
        details: description,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Report submitted successfully",
        description: "We'll review your report within 24 hours and take appropriate action.",
      });

      // Reset form
      setIssueType("");
      setDescription("");
      setContentLink("");
      setEmail("");
      setAnonymous(false);
    } catch (error: any) {
      toast({
        title: "Error submitting report",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Report an Issue | SouLVE</title>
        <meta
          name="description"
          content="Report safety concerns, inappropriate content, or technical issues. Help keep SouLVE a safe and welcoming community."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <Link to="/" className="inline-flex items-center text-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-6">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">Report an Issue</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Help keep SouLVE safe and welcoming. Your report will be reviewed by our moderation team within 24 hours.
            </p>
          </div>

          <Card className="shadow-lg border-border/50">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Issue Type Selection */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">What type of issue are you reporting?</Label>
                  <RadioGroup value={issueType} onValueChange={setIssueType}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {issueTypes.map((type) => (
                        <div key={type.value} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <RadioGroupItem value={type.value} id={type.value} />
                          <Label htmlFor={type.value} className="flex items-center gap-2 cursor-pointer flex-1">
                            <span className="text-xl">{type.icon}</span>
                            <span>{type.label}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-lg font-semibold">
                    What happened? <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide as much detail as possible about what happened, when it occurred, and why you're concerned..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    required
                    className="resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    The more detail you provide, the easier it is for us to investigate and take action.
                  </p>
                </div>

                {/* Content Link */}
                <div className="space-y-2">
                  <Label htmlFor="contentLink">Link to content or profile (optional)</Label>
                  <Input
                    id="contentLink"
                    type="url"
                    placeholder="https://soulve.org/..."
                    value={contentLink}
                    onChange={(e) => setContentLink(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    If reporting specific content or a user, paste the URL here.
                  </p>
                </div>

                {/* Contact Email */}
                {!user && (
                  <div className="space-y-2">
                    <Label htmlFor="email">Your email (for follow-up)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      We may need to contact you for more information.
                    </p>
                  </div>
                )}

                {/* Anonymous Reporting */}
                <div className="flex items-center space-x-2 p-4 bg-muted/30 rounded-lg">
                  <Checkbox
                    id="anonymous"
                    checked={anonymous}
                    onCheckedChange={(checked) => setAnonymous(checked as boolean)}
                  />
                  <Label htmlFor="anonymous" className="cursor-pointer">
                    Submit this report anonymously
                  </Label>
                </div>

                {/* Submit Button */}
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border/50">
              <CardContent className="p-6 text-center">
                <FileText className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">1. We Review</h3>
                <p className="text-sm text-muted-foreground">
                  Our moderation team reviews all reports within 24 hours
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-6 text-center">
                <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">2. We Investigate</h3>
                <p className="text-sm text-muted-foreground">
                  We gather evidence and assess the situation carefully
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-6 text-center">
                <Clock className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">3. We Act</h3>
                <p className="text-sm text-muted-foreground">
                  Appropriate action is taken to protect our community
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Resources */}
          <Card className="mt-8 bg-destructive/5 border-destructive/20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                In an Emergency
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you or someone else is in immediate danger, please contact emergency services immediately:
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="font-semibold">Emergency:</span> 999 (UK)
                </div>
                <div>
                  <span className="font-semibold">Samaritans:</span> 116 123
                </div>
                <div>
                  <span className="font-semibold">Childline:</span> 0800 1111
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default ReportIssue;
