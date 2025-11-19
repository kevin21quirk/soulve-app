import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { useUserSearch } from "@/hooks/useUserSearch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface NewMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectUser: (userId: string) => void;
}

const NewMessageDialog = ({ open, onOpenChange, onSelectUser }: NewMessageDialogProps) => {
  const { searchResults, isLoading, handleSearch, searchQuery } = useUserSearch();
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(debouncedSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [debouncedSearch, handleSearch]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>Search for someone to message</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, location, or bio..."
              value={debouncedSearch}
              onChange={(e) => setDebouncedSearch(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>

          {/* Results List */}
          <ScrollArea className="h-[400px]">
            {isLoading ? (
              // Skeleton loaders
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !searchQuery ? (
              // Initial state
              <div className="flex flex-col items-center justify-center h-[400px] text-center px-4">
                <Search className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">
                  Start typing to search for users
                </p>
              </div>
            ) : searchResults.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center h-[400px] text-center px-4">
                <Search className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">
                  No users found matching "{searchQuery}"
                </p>
              </div>
            ) : (
              // User list
              <div className="space-y-1">
                {searchResults.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user.id);
                      onOpenChange(false);
                      setDebouncedSearch('');
                    }}
                    className="w-full p-3 hover:bg-accent rounded-lg flex items-center gap-3 transition-colors"
                  >
                    <Avatar>
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>
                        {user.first_name?.[0] || ''}{user.last_name?.[0] || ''}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-medium truncate">
                        {user.first_name} {user.last_name}
                      </p>
                      {user.location && (
                        <p className="text-sm text-muted-foreground truncate">
                          {user.location}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageDialog;
