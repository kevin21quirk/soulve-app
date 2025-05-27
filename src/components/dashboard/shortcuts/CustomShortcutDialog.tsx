
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

interface CustomShortcutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddShortcut: (shortcut: Shortcut) => void;
}

const CustomShortcutDialog: React.FC<CustomShortcutDialogProps> = ({
  open,
  onOpenChange,
  onAddShortcut,
}) => {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Navigation");
  const [keys, setKeys] = useState<string[]>([]);
  const [currentKey, setCurrentKey] = useState("");

  const categories = ['Navigation', 'Content', 'Interactions', 'Accessibility', 'System'];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    const key = e.key;
    
    if (key === 'Backspace' && currentKey === '') {
      setKeys(prev => prev.slice(0, -1));
      return;
    }
    
    if (key.length === 1 || ['Escape', 'Enter', 'Tab', 'Space'].includes(key)) {
      const keyName = key === ' ' ? 'Space' : key;
      if (!keys.includes(keyName)) {
        setKeys(prev => [...prev, keyName]);
      }
    } else if (['Control', 'Shift', 'Alt', 'Meta'].includes(key)) {
      const modifierMap: Record<string, string> = {
        'Control': 'Ctrl',
        'Meta': 'Cmd'
      };
      const keyName = modifierMap[key] || key;
      if (!keys.includes(keyName)) {
        setKeys(prev => [...prev, keyName]);
      }
    }
  };

  const removeKey = (keyToRemove: string) => {
    setKeys(prev => prev.filter(key => key !== keyToRemove));
  };

  const handleSubmit = () => {
    if (description && keys.length > 0) {
      onAddShortcut({
        description,
        category,
        keys,
      });
      
      // Reset form
      setDescription("");
      setKeys([]);
      setCurrentKey("");
      setCategory("Navigation");
    }
  };

  const handleClose = () => {
    setDescription("");
    setKeys([]);
    setCurrentKey("");
    setCategory("Navigation");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Shortcut</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What does this shortcut do?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Keyboard Combination</Label>
            <div className="space-y-2">
              <Input
                placeholder="Press keys to record shortcut..."
                value={currentKey}
                onChange={(e) => setCurrentKey(e.target.value)}
                onKeyDown={handleKeyDown}
                className="font-mono"
              />
              
              {keys.length > 0 && (
                <div className="flex flex-wrap gap-1 p-2 bg-gray-50 rounded-md">
                  {keys.map((key, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {key}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeKey(key)}
                        className="ml-1 h-3 w-3 p-0 hover:bg-gray-200"
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Tip: Press Ctrl, Shift, Alt, or other modifier keys, then letter keys to create combinations
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!description || keys.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Shortcut
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomShortcutDialog;
