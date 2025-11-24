import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Upload } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { uploadBlogImage } from '@/utils/blogImageUpload';

interface BlogPostFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId?: string;
}

const BlogPostForm = ({ open, onOpenChange, postId }: BlogPostFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_id: '',
    featured_image: '',
    excerpt: '',
    content: '',
    tags: [] as string[],
    meta_description: '',
    meta_keywords: [] as string[],
    is_published: false,
  });
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch post data if editing
  useQuery({
    queryKey: ['blog-post', postId],
    enabled: !!postId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId!)
        .single();
      if (error) throw error;
      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        category_id: data.category_id || '',
        featured_image: data.featured_image || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        tags: data.tags || [],
        meta_description: data.meta_description || '',
        meta_keywords: data.meta_keywords || [],
        is_published: data.is_published || false,
      });
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const postData = {
        ...formData,
        author_id: user.id,
        read_time: Math.ceil(formData.content.split(' ').length / 200), // ~200 words/min
        published_at: formData.is_published ? new Date().toISOString() : null,
      };

      if (postId) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', postId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({
        title: postId ? 'Post updated' : 'Post created',
        description: 'Blog post saved successfully',
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const url = await uploadBlogImage(file, user.id);
      setFormData(prev => ({ ...prev, featured_image: url }));
      toast({ title: 'Image uploaded successfully' });
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.meta_keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({ ...prev, meta_keywords: [...prev.meta_keywords, keywordInput.trim()] }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({ ...prev, meta_keywords: prev.meta_keywords.filter(k => k !== keyword) }));
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{postId ? 'Edit Post' : 'Create New Post'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter post title"
            />
          </div>

          {/* Slug */}
          <div>
            <Label htmlFor="slug">URL Slug *</Label>
            <div className="flex gap-2">
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="url-friendly-slug"
              />
              <Button onClick={generateSlug} variant="outline">Generate</Button>
            </div>
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Featured Image */}
          <div>
            <Label htmlFor="featured_image">Featured Image</Label>
            <div className="space-y-2">
              {formData.featured_image && (
                <img src={formData.featured_image} alt="Featured" className="w-full max-w-md rounded-lg" />
              )}
              <div className="flex gap-2">
                <Input
                  id="featured_image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                {uploadingImage && <span className="text-sm text-muted-foreground">Uploading...</span>}
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <Label htmlFor="excerpt">Excerpt (200 chars max)</Label>
            <Input
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value.slice(0, 200) }))}
              placeholder="Brief summary"
              maxLength={200}
            />
            <span className="text-xs text-muted-foreground">{formData.excerpt.length}/200</span>
          </div>

          {/* Content */}
          <div>
            <Label>Content *</Label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              onImageClick={() => document.getElementById('featured_image')?.click()}
            />
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag"
              />
              <Button onClick={addTag} variant="outline">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                  <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Meta Description */}
          <div>
            <Label htmlFor="meta_description">Meta Description (160 chars max)</Label>
            <Input
              id="meta_description"
              value={formData.meta_description}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value.slice(0, 160) }))}
              placeholder="SEO description"
              maxLength={160}
            />
            <span className="text-xs text-muted-foreground">{formData.meta_description.length}/160</span>
          </div>

          {/* Meta Keywords */}
          <div>
            <Label htmlFor="keywords">SEO Keywords</Label>
            <div className="flex gap-2 mb-2">
              <Input
                id="keywords"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                placeholder="Add keyword"
              />
              <Button onClick={addKeyword} variant="outline">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.meta_keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary">
                  {keyword}
                  <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeKeyword(keyword)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="publish">Publish Post</Label>
            <Switch
              id="publish"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : postId ? 'Update Post' : 'Create Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostForm;
