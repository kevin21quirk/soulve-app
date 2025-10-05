import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Save, Bell, Shield, Trash2 } from "lucide-react";
import DataDeletionRequest from "@/components/legal/DataDeletionRequest";

const ProfileSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
    avatarUrl: "",
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    allowDirectMessages: true,
    showOnlineStatus: true,
    showLocation: true,
    showEmail: false,
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    campaignUpdates: true,
    connectionRequests: true,
    messages: true,
  });

  useEffect(() => {
    loadProfile();
    loadPrivacySettings();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile({
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        bio: data.bio || "",
        location: data.location || "",
        avatarUrl: data.avatar_url || "",
      });
    }
  };

  const loadPrivacySettings = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("user_privacy_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setPrivacy({
        profileVisibility: data.profile_visibility || "public",
        allowDirectMessages: data.allow_direct_messages !== false,
        showOnlineStatus: data.show_online_status !== false,
        showLocation: data.show_location !== false,
        showEmail: data.show_email || false,
      });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatarUrl: publicUrl });
      toast({ title: "Avatar updated successfully" });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: profile.firstName,
          last_name: profile.lastName,
          bio: profile.bio,
          location: profile.location,
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast({ title: "Profile updated successfully" });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePrivacy = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("user_privacy_settings")
        .upsert({
          user_id: user?.id,
          profile_visibility: privacy.profileVisibility,
          allow_direct_messages: privacy.allowDirectMessages,
          show_online_status: privacy.showOnlineStatus,
          show_location: privacy.showLocation,
          show_email: privacy.showEmail,
        });

      if (error) throw error;

      toast({ title: "Privacy settings updated" });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile details and photo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatarUrl} />
                  <AvatarFallback>
                    {profile.firstName[0]}{profile.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="avatar" className="cursor-pointer">
                    <Button variant="outline" size="sm" disabled={uploading} asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? "Uploading..." : "Upload Photo"}
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG or GIF. Max 5MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="London, UK"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <Button onClick={saveProfile} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control who can see your information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Direct Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Let other users send you direct messages
                  </p>
                </div>
                <Switch
                  checked={privacy.allowDirectMessages}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, allowDirectMessages: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Online Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Display when you're active on the platform
                  </p>
                </div>
                <Switch
                  checked={privacy.showOnlineStatus}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, showOnlineStatus: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Location</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your location on your profile
                  </p>
                </div>
                <Switch
                  checked={privacy.showLocation}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, showLocation: checked })
                  }
                />
              </div>

              <Button onClick={savePrivacy} disabled={loading}>
                <Shield className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Privacy Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Campaign Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about campaigns you support
                  </p>
                </div>
                <Switch
                  checked={notifications.campaignUpdates}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, campaignUpdates: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Connection Requests</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications when someone wants to connect
                  </p>
                </div>
                <Switch
                  checked={notifications.connectionRequests}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, connectionRequests: checked })
                  }
                />
              </div>

              <Button disabled>
                <Bell className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security & Data</CardTitle>
                <CardDescription>Manage your account security and data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Download My Data
                </Button>
              </CardContent>
            </Card>

            <DataDeletionRequest />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileSettings;
