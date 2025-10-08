import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Camera, Upload } from "lucide-react";

interface OrganizationProfileBannerProps {
  banner: string | null;
  onBannerUpload?: (file: File) => void;
  onRemoveBanner?: () => void;
  isEditing: boolean;
}

const OrganizationProfileBanner = ({ 
  banner, 
  onBannerUpload, 
  onRemoveBanner, 
  isEditing 
}: OrganizationProfileBannerProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onBannerUpload) {
      onBannerUpload(file);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <Label>Organization Banner</Label>
        <div className="relative h-64 rounded-lg border-2 border-dashed border-gray-200 overflow-hidden">
          {banner ? (
            <div className="relative w-full h-full">
              <img
                src={banner}
                alt="Organization banner"
                className="w-full h-full object-cover"
              />
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
                <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-2">Upload a banner image</p>
                <label htmlFor="org-banner-upload">
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
          {banner && (
            <div className="absolute bottom-2 left-2">
              <label htmlFor="org-banner-upload">
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
          id="org-banner-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="text-xs text-gray-500">
          Recommended: 1200x300px or larger. Max file size: 10MB.
        </p>
      </div>
    );
  }

  // Display mode - show banner if it exists
  if (!banner) {
    return (
      <div className="h-32 rounded-t-lg bg-gradient-to-r from-teal-100 to-blue-100 flex items-center justify-center">
        <p className="text-gray-500 text-sm">No banner uploaded</p>
      </div>
    );
  }

  return (
    <div className="relative h-64 rounded-t-lg overflow-hidden">
      <img
        src={banner}
        alt="Organization banner"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default OrganizationProfileBanner;
