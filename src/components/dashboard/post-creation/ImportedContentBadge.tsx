import { ExternalLink, X } from 'lucide-react';
import { ImportedContent } from '../CreatePostTypes';

interface ImportedContentBadgeProps {
  content: ImportedContent;
  onRemove: () => void;
}

const ImportedContentBadge = ({ content, onRemove }: ImportedContentBadgeProps) => {
  return (
    <div className="px-4 py-2 bg-primary/5 border-l-4 border-primary flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm">
        <ExternalLink className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground">
          Imported from <span className="font-medium capitalize">{content.sourcePlatform}</span>:
        </span>
        <a 
          href={content.sourceUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline max-w-xs truncate"
        >
          {content.sourceTitle}
        </a>
        {content.sourceAuthor && (
          <span className="text-muted-foreground text-xs">
            by {content.sourceAuthor}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ImportedContentBadge;
