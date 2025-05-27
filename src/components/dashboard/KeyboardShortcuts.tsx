
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Keyboard } from "lucide-react";

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const KeyboardShortcuts = () => {
  const shortcuts: Shortcut[] = [
    { keys: ['Ctrl', 'K'], description: 'Open search', category: 'Navigation' },
    { keys: ['Ctrl', 'N'], description: 'Create new post', category: 'Actions' },
    { keys: ['Ctrl', 'M'], description: 'Open messages', category: 'Communication' },
    { keys: ['Ctrl', 'Shift', 'C'], description: 'Open connections', category: 'Network' },
    { keys: ['Escape'], description: 'Close current modal', category: 'Navigation' },
    { keys: ['?'], description: 'Show keyboard shortcuts', category: 'Help' },
  ];

  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Keyboard className="h-5 w-5" />
          <span>Keyboard Shortcuts</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map(category => (
          <div key={category}>
            <h4 className="font-medium text-sm text-gray-700 mb-2">{category}</h4>
            <div className="space-y-2">
              {shortcuts.filter(s => s.category === category).map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{shortcut.description}</span>
                  <div className="flex space-x-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <Badge key={keyIndex} variant="outline" className="text-xs px-2 py-1">
                        {key}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default KeyboardShortcuts;
