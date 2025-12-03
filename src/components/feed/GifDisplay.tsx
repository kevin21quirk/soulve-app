interface GifData {
  id: string;
  title: string;
  url: string;
  preview: string;
}

interface GifDisplayProps {
  gifData: GifData;
}

export const GifDisplay = ({ gifData }: GifDisplayProps) => {
  return (
    <div className="rounded-lg overflow-hidden bg-muted/30">
      <img
        src={gifData.url}
        alt={gifData.title || 'GIF'}
        className="w-full max-h-80 object-contain"
        loading="lazy"
      />
      {gifData.title && (
        <div className="px-2 py-1 bg-muted/50">
          <span className="text-xs text-muted-foreground">GIF: {gifData.title}</span>
        </div>
      )}
    </div>
  );
};

export default GifDisplay;
