import { useState, useEffect } from 'react';
import { LazyImage } from './LazyImage';
import { getOptimizedImageSources, supportsWebP } from '@/utils/imageUtils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}

/**
 * OptimizedImage component with WebP support and lazy loading
 * Automatically serves WebP format when supported, falls back to original format
 */
export const OptimizedImage = ({
  src,
  alt,
  className,
  width,
  height,
  sizes,
  priority = false,
}: OptimizedImageProps) => {
  const [webpSupported, setWebpSupported] = useState<boolean | null>(null);

  useEffect(() => {
    supportsWebP().then(setWebpSupported);
  }, []);

  if (webpSupported === null) {
    // Show placeholder while checking WebP support
    return (
      <div 
        className={`lazy-image ${className || ''}`}
        style={{ width, height }}
        aria-label="Loading image"
      />
    );
  }

  const sources = getOptimizedImageSources(src);
  const imageSrc = webpSupported ? sources.webp : sources.fallback;

  // For priority images (above-the-fold), use regular img with eager loading
  if (priority) {
    return (
      <picture>
        <source type="image/webp" srcSet={sources.webp} />
        <img
          src={sources.fallback}
          alt={alt}
          width={width}
          height={height}
          className={className}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </picture>
    );
  }

  // For non-priority images, use lazy loading
  return (
    <picture>
      <source type="image/webp" srcSet={sources.webp} />
      <LazyImage
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    </picture>
  );
};
