
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";

interface Shortcut {
  id: string;
  keys: string[];
  description: string;
  category: string;
  isCustom?: boolean;
  isEnabled?: boolean;
  frequency?: number;
}

interface ShortcutCategoryProps {
  shortcuts: Shortcut[];
  onToggleShortcut: (shortcutId: string) => void;
  getFrequencyColor: (frequency: number) => string;
}

const ShortcutCategory: React.FC<ShortcutCategoryProps> = ({
  shortcuts,
  onToggleShortcut,
  getFrequencyColor,
}) => {
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  return (
    <div className="space-y-4">
      {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
        <div key={category}>
          <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center justify-between">
            <span>{category}</span>
            <Badge variant="secondary" className="text-xs">
              {categoryShortcuts.length}
            </Badge>
          </h4>
          <div className="space-y-2">
            {categoryShortcuts.map((shortcut) => (
              <div 
                key={shortcut.id} 
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  shortcut.isEnabled === false 
                    ? 'bg-gray-50 border-gray-200 opacity-60' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={shortcut.isEnabled !== false}
                    onCheckedChange={() => onToggleShortcut(shortcut.id)}
                    className="scale-75"
                  />
                  <div>
                    <span className="text-sm font-medium">{shortcut.description}</span>
                    {shortcut.isCustom && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Custom
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {shortcut.frequency !== undefined && (
                    <Badge className={`text-xs ${getFrequencyColor(shortcut.frequency)}`}>
                      {shortcut.frequency}%
                    </Badge>
                  )}
                  
                  <div className="flex space-x-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <Badge 
                        key={keyIndex} 
                        variant="outline" 
                        className="text-xs px-2 py-1 font-mono"
                      >
                        {key}
                      </Badge>
                    ))}
                  </div>
                  
                  {shortcut.isCustom && (
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShortcutCategory;
