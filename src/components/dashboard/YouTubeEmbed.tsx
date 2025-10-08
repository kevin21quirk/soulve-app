import { ExternalLink } from 'lucide-react';

interface YouTubeEmbedProps {
  url: string;
  title?: string;
  thumbnailUrl?: string | null;
}

const YouTubeEmbed = ({ url, title, thumbnailUrl }: YouTubeEmbedProps) => {
  const getYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  };

  console.log('🎬 [YouTubeEmbed] Rendering with:', { url, title, hasThumbnail: !!thumbnailUrl });

  const videoId = getYouTubeVideoId(url);
  
  console.log('🎬 [YouTubeEmbed] Extracted video ID:', videoId);
  
  if (!videoId) {
    console.warn('🎬 [YouTubeEmbed] Failed to extract video ID from URL:', url);
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-primary">
          <ExternalLink className="h-4 w-4" />
          <span className="text-sm font-medium">View on YouTube</span>
        </div>
      </a>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  const thumb = thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  console.log('🎬 [YouTubeEmbed] Embed URL:', embedUrl);
  console.log('🎬 [YouTubeEmbed] Thumbnail URL:', thumb);

  return (
    <div className="space-y-2">
      <div className="relative w-full rounded-lg overflow-hidden bg-black" style={{ paddingTop: '56.25%' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={embedUrl}
          title={title || 'YouTube video'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ExternalLink className="h-3 w-3" />
        <span>Watch on YouTube</span>
      </a>
    </div>
  );
};

export default YouTubeEmbed;
