
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AvatarUploadManagerProps {
  currentAvatar: string;
  userName: string;
  onAvatarUpdate: (newAvatarUrl: string) => void;
  isEditing?: boolean;
}

const AvatarUploadManager = ({ 
  currentAvatar, 
  userName, 
  onAvatarUpdate, 
  isEditing = false 
}: AvatarUploadManagerProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload to Supabase Storage
    await uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // Upload file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Update profile with new avatar URL
      onAvatarUpdate(publicUrl);

      toast({
        title: "Profile picture updated!",
        description: "Your profile picture has been updated successfully",
      });

      // Clean up preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onAvatarUpdate('');
  };

  const displayAvatar = previewUrl || currentAvatar;

  if (!isEditing) {
    return (
      <Avatar className="h-24 w-24 shadow-lg">
        <AvatarImage src={currentAvatar} alt={userName} />
        <AvatarFallback className="text-2xl">
          {userName.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div className="relative">
      <Avatar className="h-24 w-24 shadow-lg">
        <AvatarImage src={displayAvatar} alt={userName} />
        <AvatarFallback className="text-2xl">
          {userName.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      
      {/* Upload Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="text-white hover:text-white hover:bg-transparent"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Camera className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Remove Avatar Button */}
      {displayAvatar && (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={handleRemoveAvatar}
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      )}

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Progress Indicator */}
      {uploading && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            Uploading...
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarUploadManager;
