// Image optimization utilities for WebP support and lazy loading

/**
 * Generate WebP and fallback image sources for responsive images
 */
export interface ImageSourceSet {
  webp: string;
  fallback: string;
  srcSet?: string;
}

/**
 * Create optimized image sources with WebP support
 * @param imagePath - Base image path without extension
 * @param sizes - Optional sizes for responsive images
 */
export const getOptimizedImageSources = (
  imagePath: string,
  sizes?: number[]
): ImageSourceSet => {
  const basePathWithoutExt = imagePath.replace(/\.[^/.]+$/, '');
  const ext = imagePath.split('.').pop() || 'png';

  if (sizes && sizes.length > 0) {
    // Generate srcSet for responsive images
    const webpSrcSet = sizes.map(size => `${basePathWithoutExt}-${size}w.webp ${size}w`).join(', ');
    const fallbackSrcSet = sizes.map(size => `${basePathWithoutExt}-${size}w.${ext} ${size}w`).join(', ');

    return {
      webp: `${basePathWithoutExt}.webp`,
      fallback: imagePath,
      srcSet: webpSrcSet,
    };
  }

  return {
    webp: `${basePathWithoutExt}.webp`,
    fallback: imagePath,
  };
};

/**
 * Preload critical images for faster LCP
 */
export const preloadImage = (src: string, as: 'image' = 'image') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  document.head.appendChild(link);
};

/**
 * Preload multiple critical images
 */
export const preloadImages = (sources: string[]) => {
  sources.forEach(src => preloadImage(src));
};

/**
 * Check if WebP is supported in the browser
 */
export const supportsWebP = (): Promise<boolean> => {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img.width === 1);
    img.onerror = () => resolve(false);
    img.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  });
};

/**
 * Get the appropriate image source based on WebP support
 */
export const getImageSrc = async (imagePath: string): Promise<string> => {
  const sources = getOptimizedImageSources(imagePath);
  const webpSupported = await supportsWebP();
  return webpSupported ? sources.webp : sources.fallback;
};
