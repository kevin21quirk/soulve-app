import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ExternalLink } from 'lucide-react';
import { URLPreview } from '@/services/urlPreviewService';

interface LinkPreviewProps {
  preview: URLPreview;
  onRemove?: () => void;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({ preview, onRemove }) => {
  const domain = preview.site_name || new URL(preview.url).hostname;

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm z-10 hover:bg-background"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      )}

      <a
        href={preview.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col sm:flex-row group"
      >
        {preview.image_url && (
          <div className="w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden bg-muted">
            <img
              src={preview.image_url}
              alt={preview.title || 'Link preview'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Hide image if it fails to load
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="flex-1 p-4 flex flex-col justify-between min-h-[120px]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {preview.favicon && (
                <img
                  src={preview.favicon}
                  alt=""
                  className="w-4 h-4"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              )}
              <span className="text-xs text-muted-foreground">{domain}</span>
            </div>

            {preview.title && (
              <h3 className="font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-primary transition-colors">
                {preview.title}
              </h3>
            )}

            {preview.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {preview.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
            <ExternalLink className="h-3 w-3" />
            <span className="truncate">{new URL(preview.url).hostname}</span>
          </div>
        </div>
      </a>
    </Card>
  );
};
