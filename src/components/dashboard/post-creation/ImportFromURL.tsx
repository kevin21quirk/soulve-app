import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ContentImportService, ImportedContentData } from '@/services/contentImportService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Link as LinkIcon, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ImportFromURLProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (content: ImportedContentData) => void;
}

const ImportFromURL = ({ isOpen, onClose, onImport }: ImportFromURLProps) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<ImportedContentData | null>(null);
  const { toast } = useToast();

  const handleFetchContent = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    if (!ContentImportService.isValidURL(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const content = await ContentImportService.importFromURL(url);
      setPreview(content);
      
      toast({
        title: "Content Fetched",
        description: `Successfully imported ${content.platform} content`,
      });
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import content from URL",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    if (preview) {
      onImport(preview);
      handleClose();
    }
  };

  const handleClose = () => {
    setUrl('');
    setPreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Import Content from URL
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Paste URL (YouTube, Twitter, Article, etc.)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleFetchContent()}
              className="flex-1"
            />
            <Button 
              onClick={handleFetchContent}
              disabled={isLoading || !url.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                'Fetch'
              )}
            </Button>
          </div>

          {url && ContentImportService.isValidURL(url) && (
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="font-medium">Detected:</span>
              <span className="px-2 py-1 bg-primary/10 rounded">
                {ContentImportService.detectURLType(url)}
              </span>
            </div>
          )}

          {preview && (
            <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-1 bg-primary/10 rounded capitalize">
                      {preview.platform}
                    </span>
                    {preview.author && (
                      <span className="text-xs text-muted-foreground">
                        by {preview.author}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-semibold line-clamp-2">{preview.title}</h3>
                  
                  {preview.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {preview.description}
                    </p>
                  )}
                  
                  {preview.tags && preview.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {preview.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 bg-secondary rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {preview.thumbnailUrl && (
                  <img 
                    src={preview.thumbnailUrl} 
                    alt={preview.title}
                    className="w-24 h-24 object-cover rounded ml-4"
                  />
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleImport} className="flex-1">
                  Import This Content
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setPreview(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportFromURL;
