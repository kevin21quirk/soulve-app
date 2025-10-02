# Image Optimization Plan

## Current Issues Identified

1. **External Avatar Service**: Using `randomuser.me` API
   - Privacy concerns (third-party tracking)
   - Rate limiting issues
   - Performance overhead from external requests
   - No control over uptime

2. **Broken Placeholder Paths**: Hardcoded paths like `/avatars/sarah.jpg`
   - Files may not exist
   - No fallback mechanism
   - Poor user experience

3. **No Image Optimization**:
   - No WebP format support
   - No lazy loading
   - No responsive images (srcset)
   - Large file sizes not optimized

## Recommended Solutions

### 1. Avatar System Replacement

**Option A: UI Avatars (Recommended for MVP)**
```typescript
// utils/avatarUtils.ts
export const generateAvatarUrl = (name: string, backgroundColor?: string) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  const bg = backgroundColor || '18a5fe'; // SouLVE brand color
  const color = 'ffffff';
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bg}&color=${color}&size=200&bold=true`;
};
```

**Option B: DiceBear API (More variety)**
```typescript
export const generateAvatarUrl = (userId: string, style: 'avataaars' | 'bottts' | 'identicon' = 'avataaars') => {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${userId}`;
};
```

**Option C: Local Generated Avatars (Best for privacy)**
- Install: `npm install @dicebear/collection @dicebear/core`
- Generate avatars locally without external API calls
- Full control and privacy

### 2. Image Upload & Storage Strategy

**Using Supabase Storage:**

```typescript
// services/imageService.ts
import { supabase } from '@/integrations/supabase/client';

export const uploadImage = async (
  file: File, 
  bucket: 'avatars' | 'posts' | 'campaigns',
  userId: string
) => {
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size must be less than 5MB');
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPEG, PNG, and WebP images are allowed');
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return publicUrl;
};
```

### 3. Lazy Loading Implementation

**React Component with Intersection Observer:**

```tsx
// components/ui/LazyImage.tsx
import { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

export const LazyImage = ({ src, alt, className, placeholder }: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={isInView ? src : placeholder || '/placeholder.svg'}
      alt={alt}
      className={className}
      onLoad={() => setIsLoaded(true)}
      loading="lazy"
    />
  );
};
```

### 4. WebP Format Support

**Automatic WebP Conversion (Supabase Edge Function):**

```typescript
// supabase/functions/optimize-image/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { imageUrl } = await req.json();
  
  // Fetch original image
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  
  // Convert to WebP using imagescript or similar
  // Return optimized image URL
  
  return new Response(JSON.stringify({ optimizedUrl }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

### 5. Responsive Images

**Using srcset for different viewport sizes:**

```tsx
<img
  src="/images/hero-800w.webp"
  srcSet="
    /images/hero-400w.webp 400w,
    /images/hero-800w.webp 800w,
    /images/hero-1200w.webp 1200w
  "
  sizes="
    (max-width: 640px) 400px,
    (max-width: 1024px) 800px,
    1200px
  "
  alt="Hero image"
  loading="lazy"
/>
```

## Implementation Priority

### Phase 1 (Immediate - 2 hours)
- [ ] Replace randomuser.me with UI Avatars utility
- [ ] Add error handling for broken image URLs
- [ ] Implement basic lazy loading with `loading="lazy"` attribute

### Phase 2 (Next Sprint - 4 hours)
- [ ] Create LazyImage component with Intersection Observer
- [ ] Set up Supabase Storage buckets for images
- [ ] Create image upload service with validation

### Phase 3 (Future Enhancement - 8 hours)
- [ ] Implement WebP conversion (edge function or build-time)
- [ ] Add responsive image generation
- [ ] Implement image CDN caching strategy
- [ ] Add image compression on upload

## Storage Bucket Configuration

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('avatars', 'avatars', true),
  ('posts', 'posts', true),
  ('campaigns', 'campaigns', true);

-- RLS Policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## Performance Metrics to Track

- Average image load time
- Cumulative Layout Shift (CLS)
- Largest Contentful Paint (LCP)
- Total page weight
- Number of external requests

## Resources

- [UI Avatars Documentation](https://ui-avatars.com/api/)
- [DiceBear Documentation](https://www.dicebear.com/)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
