import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MediaUpload from "./MediaUpload";
import { MediaFile } from "./media-upload/MediaUploadTypes";

const ContentUpload = () => {
  const { toast } = useToast();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    urgency: "",
    contactMethod: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Post shared successfully!",
      description: `Your request has been posted to the community feed${mediaFiles.length > 0 ? ` with ${mediaFiles.length} media file(s)` : ''}.`,
    });
    setFormData({
      title: "",
      description: "",
      category: "",
      location: "",
      urgency: "",
      contactMethod: ""
    });
    setMediaFiles([]);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMediaChange = (files: MediaFile[]) => {
    setMediaFiles(files);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Share Your Need</h2>
        <p className="text-gray-600">Let your community know how they can help you</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Create a New Post</span>
          </CardTitle>
          <CardDescription>
            Fill out the details below to share your need with the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="What do you need help with?"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide more details about what you need..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* Media Upload Section */}
            <div className="space-y-2">
              <Label>Add Photos or Videos</Label>
              <MediaUpload
                onMediaChange={handleMediaChange}
                maxFiles={5}
                maxFileSize={10}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="moving">Moving & Logistics</SelectItem>
                    <SelectItem value="food">Food & Groceries</SelectItem>
                    <SelectItem value="childcare">Childcare</SelectItem>
                    <SelectItem value="eldercare">Elder Care</SelectItem>
                    <SelectItem value="home-repair">Home Repair</SelectItem>
                    <SelectItem value="tutoring">Tutoring & Education</SelectItem>
                    <SelectItem value="emotional-support">Emotional Support</SelectItem>
                    <SelectItem value="financial">Financial Assistance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How urgent is this?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Flexible timing</SelectItem>
                    <SelectItem value="medium">Medium - Within a week</SelectItem>
                    <SelectItem value="high">High - Within 24 hours</SelectItem>
                    <SelectItem value="emergency">Emergency - Immediate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Where do you need help? (e.g., Downtown, Main St)"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Preferred Contact Method</Label>
              <Select value={formData.contactMethod} onValueChange={(value) => handleInputChange("contactMethod", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="How should people contact you?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soulve-message">SouLVE Messages</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="text">Text Message</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" size="lg">
                <Send className="h-4 w-4 mr-2" />
                Share with Community
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentUpload;
