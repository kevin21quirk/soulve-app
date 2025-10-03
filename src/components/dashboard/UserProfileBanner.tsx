
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Camera, Upload, Video, Image as ImageIcon } from "lucide-react";
import { MediaFile } from "./UserProfileTypes";

interface UserProfileBannerProps {
  banner: string;
  bannerType: 'image' | 'video' | null;
  bannerFile: MediaFile | null;
  onBannerUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveBanner: () => void;
  isEditing: boolean;
}

const UserProfileBanner = ({ 
  banner, 
  bannerType, 
  bannerFile, 
  onBannerUpload, 
  onRemoveBanner, 
  isEditing 
}: UserProfileBannerProps) => {
  const displayBanner = bannerFile ? bannerFile.preview : banner;
  const displayBannerType = bannerFile ? bannerFile.type : bannerType;

  if (isEditing) {
    return (
      <div className="space-y-4">
        <Label>Profile Banner</Label>
        <div className="relative h-64 rounded-lg border-2 border-dashed border-gray-200 overflow-hidden">
          {displayBanner ? (
            <div className="relative w-full h-full">
              {displayBannerType === 'video' ? (
                <video
                  src={displayBanner}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  autoPlay
                />
              ) : (
                <img
                  src={displayBanner}
                  alt="Profile banner"
                  className="w-full h-full object-cover"
                />
              )}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={onRemoveBanner}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="flex justify-center space-x-2 mb-2">
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                  <Video className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-2">Upload a banner image or video</p>
                <label htmlFor="banner-upload">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          )}
          {displayBanner && (
            <div className="absolute bottom-2 left-2">
              <label htmlFor="banner-upload">
                <Button type="button" variant="secondary" size="sm" asChild>
                  <span className="cursor-pointer">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Banner
                  </span>
                </Button>
              </label>
            </div>
          )}
        </div>
        <input
          id="banner-upload"
          type="file"
          accept="image/*,video/*"
          onChange={onBannerUpload}
          className="hidden"
        />
        <p className="text-xs text-gray-500">
          Recommended: 1200x300px or larger. Max file size: 10MB. Supports images and videos.
        </p>
      </div>
    );
  }

  // Display mode - show banner if it exists
  if (!banner) {
    return (
      <div className="h-32 rounded-lg bg-gradient-to-r from-teal-100 to-blue-100 flex items-center justify-center">
        <p className="text-gray-500 text-sm">No banner uploaded</p>
      </div>
    );
  }

  return (
    <div className="relative h-64 rounded-t-lg overflow-hidden">
      {bannerType === 'video' ? (
        <video
          src={banner}
          className="w-full h-full object-cover"
          muted
          loop
          autoPlay
        />
      ) : (
        <img
          src={banner}
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default UserProfileBanner;
