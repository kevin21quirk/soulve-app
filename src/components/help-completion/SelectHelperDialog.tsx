import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle } from 'lucide-react';

interface Helper {
  id: string;
  name: string;
  avatar?: string;
}

interface SelectHelperDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  postTitle: string;
  onHelperSelected: (helperId: string, helperName: string) => Promise<void>;
}

const SelectHelperDialog = ({
  open,
  onOpenChange,
  postId,
  postTitle,
  onHelperSelected
}: SelectHelperDialogProps) => {
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [selectedHelper, setSelectedHelper] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingHelpers, setLoadingHelpers] = useState(true);

  useEffect(() => {
    if (open) {
      loadHelpers();
    }
  }, [open, postId]);

  const loadHelpers = async () => {
    setLoadingHelpers(true);
    try {
      // Get users who interacted with this post
      const { data: interactions, error } = await supabase
        .from('post_interactions')
        .select(`
          user_id,
          profiles:user_id (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .in('interaction_type', ['offer_help', 'interested', 'comment']);

      if (error) throw error;

      // Transform to helpers list, removing duplicates
      const uniqueHelpers = new Map<string, Helper>();
      interactions?.forEach((interaction: any) => {
        const profile = interaction.profiles;
        if (profile && !uniqueHelpers.has(profile.id)) {
          uniqueHelpers.set(profile.id, {
            id: profile.id,
            name: `${profile.first_name} ${profile.last_name}`,
            avatar: profile.avatar_url
          });
        }
      });

      setHelpers(Array.from(uniqueHelpers.values()));
    } catch (error) {
      console.error('Error loading helpers:', error);
    } finally {
      setLoadingHelpers(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedHelper) return;

    setLoading(true);
    try {
      const helper = helpers.find(h => h.id === selectedHelper);
      if (helper) {
        await onHelperSelected(selectedHelper, helper.name);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error confirming helper:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Who Helped You?
          </DialogTitle>
          <DialogDescription>
            Select the person who helped you with: <span className="font-semibold">{postTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {loadingHelpers ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : helpers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No one has offered help yet.</p>
              <p className="text-sm mt-2">People who comment or show interest will appear here.</p>
            </div>
          ) : (
            <RadioGroup value={selectedHelper} onValueChange={setSelectedHelper}>
              <div className="space-y-3">
                {helpers.map((helper) => (
                  <div
                    key={helper.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedHelper === helper.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedHelper(helper.id)}
                  >
                    <RadioGroupItem value={helper.id} id={helper.id} />
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={helper.avatar} alt={helper.name} />
                      <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                        {helper.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Label htmlFor={helper.id} className="flex-1 cursor-pointer font-medium">
                      {helper.name}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading || !selectedHelper}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? 'Confirming...' : 'Confirm Selected Helper'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectHelperDialog;
