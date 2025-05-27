
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Keyboard, 
  Search, 
  Settings, 
  Download, 
  Upload, 
  RotateCcw,
  Zap,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ShortcutCategory from "./shortcuts/ShortcutCategory";
import ShortcutSearch from "./shortcuts/ShortcutSearch";
import CustomShortcutDialog from "./shortcuts/CustomShortcutDialog";

interface Shortcut {
  id: string;
  keys: string[];
  description: string;
  category: string;
  isCustom?: boolean;
  isEnabled?: boolean;
  frequency?: number;
}

const KeyboardShortcuts = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([
    // Navigation shortcuts
    { id: "1", keys: ['Ctrl', 'K'], description: 'Open global search', category: 'Navigation', frequency: 95 },
    { id: "2", keys: ['Ctrl', 'H'], description: 'Go to home feed', category: 'Navigation', frequency: 87 },
    { id: "3", keys: ['Ctrl', 'M'], description: 'Open messages', category: 'Navigation', frequency: 82 },
    { id: "4", keys: ['Ctrl', 'Shift', 'C'], description: 'Open connections', category: 'Navigation', frequency: 65 },
    { id: "5", keys: ['Ctrl', 'A'], description: 'Open analytics', category: 'Navigation', frequency: 45 },
    { id: "6", keys: ['G', 'N'], description: 'Go to notifications', category: 'Navigation', frequency: 78 },
    { id: "7", keys: ['G', 'P'], description: 'Go to profile', category: 'Navigation', frequency: 56 },
    
    // Content Creation
    { id: "8", keys: ['Ctrl', 'N'], description: 'Create new post', category: 'Content', frequency: 89 },
    { id: "9", keys: ['Ctrl', 'Shift', 'N'], description: 'Create story', category: 'Content', frequency: 34 },
    { id: "10", keys: ['Ctrl', 'U'], description: 'Upload media', category: 'Content', frequency: 67 },
    { id: "11", keys: ['Ctrl', 'E'], description: 'Create event', category: 'Content', frequency: 23 },
    { id: "12", keys: ['Ctrl', 'Shift', 'P'], description: 'Schedule post', category: 'Content', frequency: 45 },
    
    // Interactions
    { id: "13", keys: ['L'], description: 'Like focused post', category: 'Interactions', frequency: 92 },
    { id: "14", keys: ['C'], description: 'Comment on focused post', category: 'Interactions', frequency: 78 },
    { id: "15", keys: ['S'], description: 'Share focused post', category: 'Interactions', frequency: 56 },
    { id: "16", keys: ['B'], description: 'Bookmark focused post', category: 'Interactions', frequency: 43 },
    { id: "17", keys: ['R'], description: 'React to focused post', category: 'Interactions', frequency: 67 },
    { id: "18", keys: ['F'], description: 'Follow/Unfollow user', category: 'Interactions', frequency: 34 },
    
    // Accessibility
    { id: "19", keys: ['J'], description: 'Next post', category: 'Accessibility', frequency: 89 },
    { id: "20", keys: ['K'], description: 'Previous post', category: 'Accessibility', frequency: 87 },
    { id: "21", keys: ['Enter'], description: 'Open focused post', category: 'Accessibility', frequency: 76 },
    { id: "22", keys: ['Tab'], description: 'Navigate elements', category: 'Accessibility', frequency: 65 },
    { id: "23", keys: ['Shift', 'Tab'], description: 'Navigate backward', category: 'Accessibility', frequency: 54 },
    
    // System
    { id: "24", keys: ['Escape'], description: 'Close current modal', category: 'System', frequency: 98 },
    { id: "25", keys: ['?'], description: 'Show keyboard shortcuts', category: 'System', frequency: 45 },
    { id: "26", keys: ['Ctrl', ','], description: 'Open settings', category: 'System', frequency: 34 },
    { id: "27", keys: ['Ctrl', 'R'], description: 'Refresh feed', category: 'System', frequency: 67 },
    { id: "28", keys: ['Ctrl', 'Shift', 'D'], description: 'Toggle dark mode', category: 'System', frequency: 56 },
  ]);

  const categories = ['all', 'Navigation', 'Content', 'Interactions', 'Accessibility', 'System'];
  
  const filteredShortcuts = useMemo(() => {
    return shortcuts.filter(shortcut => {
      const matchesSearch = searchQuery === "" || 
        shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shortcut.keys.some(key => key.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || shortcut.category === selectedCategory;
      
      return matchesSearch && matchesCategory && shortcut.isEnabled !== false;
    });
  }, [shortcuts, searchQuery, selectedCategory]);

  const handleToggleShortcut = (shortcutId: string) => {
    setShortcuts(prev => 
      prev.map(shortcut => 
        shortcut.id === shortcutId 
          ? { ...shortcut, isEnabled: !shortcut.isEnabled }
          : shortcut
      )
    );
    
    toast({
      title: "Shortcut Updated",
      description: "Keyboard shortcut preference saved.",
    });
  };

  const handleAddCustomShortcut = (newShortcut: Omit<Shortcut, 'id'>) => {
    const shortcut: Shortcut = {
      ...newShortcut,
      id: Date.now().toString(),
      isCustom: true,
      isEnabled: true,
      frequency: 0
    };
    
    setShortcuts(prev => [...prev, shortcut]);
    setShowCustomDialog(false);
    
    toast({
      title: "Custom Shortcut Added",
      description: `Added shortcut: ${newShortcut.keys.join(' + ')}`,
    });
  };

  const handleExportShortcuts = () => {
    const data = JSON.stringify(shortcuts.filter(s => s.isCustom), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'keyboard-shortcuts.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Shortcuts Exported",
      description: "Custom shortcuts have been exported successfully.",
    });
  };

  const handleResetToDefaults = () => {
    setShortcuts(prev => 
      prev.map(shortcut => ({ ...shortcut, isEnabled: true }))
        .filter(shortcut => !shortcut.isCustom)
    );
    
    toast({
      title: "Reset Complete",
      description: "All shortcuts have been reset to defaults.",
    });
  };

  const getFrequencyColor = (frequency: number = 0) => {
    if (frequency >= 80) return "bg-green-100 text-green-800";
    if (frequency >= 60) return "bg-blue-100 text-blue-800";
    if (frequency >= 40) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getMostUsedShortcuts = () => {
    return shortcuts
      .filter(s => s.isEnabled !== false)
      .sort((a, b) => (b.frequency || 0) - (a.frequency || 0))
      .slice(0, 5);
  };

  return (
    <Card className="w-[500px] max-h-[600px] overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Keyboard className="h-5 w-5" />
            <span>Keyboard Shortcuts</span>
            <Badge variant="outline" className="text-xs">
              {filteredShortcuts.length} shortcuts
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCustomDialog(true)}
              className="h-8 w-8 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportShortcuts}
              className="h-8 w-8 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetToDefaults}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        
        <ShortcutSearch 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid grid-cols-6 w-full h-8 mx-4 mb-4">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="text-xs capitalize">
                {category === 'all' ? 'All' : category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="max-h-[400px] overflow-y-auto px-4 pb-4">
            <TabsContent value={selectedCategory} className="mt-0">
              {selectedCategory === 'all' && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-4 w-4 text-orange-500" />
                    <span className="font-medium text-sm">Most Used</span>
                  </div>
                  <div className="space-y-2">
                    {getMostUsedShortcuts().map(shortcut => (
                      <div key={shortcut.id} className="flex items-center justify-between p-2 bg-orange-50 rounded-md">
                        <span className="text-sm">{shortcut.description}</span>
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${getFrequencyColor(shortcut.frequency)}`}>
                            {shortcut.frequency}%
                          </Badge>
                          <div className="flex space-x-1">
                            {shortcut.keys.map((key, keyIndex) => (
                              <Badge key={keyIndex} variant="outline" className="text-xs px-2 py-0">
                                {key}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <ShortcutCategory
                shortcuts={filteredShortcuts}
                onToggleShortcut={handleToggleShortcut}
                getFrequencyColor={getFrequencyColor}
              />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
      
      <CustomShortcutDialog
        open={showCustomDialog}
        onOpenChange={setShowCustomDialog}
        onAddShortcut={handleAddCustomShortcut}
      />
    </Card>
  );
};

export default KeyboardShortcuts;
