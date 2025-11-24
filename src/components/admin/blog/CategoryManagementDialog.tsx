import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';

interface CategoryManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CategoryManagementDialog = ({ open, onOpenChange }: CategoryManagementDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' });

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

  // Create category mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('blog_categories')
        .insert([newCategory]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      setNewCategory({ name: '', slug: '', description: '' });
      toast({ title: 'Category created successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Creation failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const { error } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', categoryId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      toast({ title: 'Category deleted successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Delete failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const generateSlug = () => {
    const slug = newCategory.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setNewCategory(prev => ({ ...prev, slug }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create New Category */}
          <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/50">
            <h3 className="font-semibold">Create New Category</h3>
            <div>
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Category name"
              />
            </div>
            <div>
              <Label htmlFor="cat-slug">Slug</Label>
              <div className="flex gap-2">
                <Input
                  id="cat-slug"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="category-slug"
                />
                <Button onClick={generateSlug} variant="outline">Generate</Button>
              </div>
            </div>
            <div>
              <Label htmlFor="cat-desc">Description (optional)</Label>
              <Textarea
                id="cat-desc"
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description"
                rows={2}
              />
            </div>
            <Button onClick={() => createMutation.mutate()} disabled={!newCategory.name || !newCategory.slug || createMutation.isPending}>
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          </div>

          {/* Existing Categories */}
          <div className="space-y-2">
            <h3 className="font-semibold">Existing Categories</h3>
            <div className="space-y-2">
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-muted-foreground">{category.slug}</div>
                      {category.description && (
                        <div className="text-xs text-muted-foreground mt-1">{category.description}</div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Delete category "${category.name}"? Posts using this category will become uncategorized.`)) {
                          deleteMutation.mutate(category.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">No categories yet</div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryManagementDialog;
