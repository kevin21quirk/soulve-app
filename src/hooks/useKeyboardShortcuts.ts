
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[], enabled: boolean = true) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find(shortcut => 
        shortcut.key.toLowerCase() === event.key.toLowerCase() &&
        !!shortcut.ctrlKey === event.ctrlKey &&
        !!shortcut.shiftKey === event.shiftKey &&
        !!shortcut.altKey === event.altKey
      );

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);

  const showShortcuts = () => {
    const shortcutList = shortcuts.map(s => {
      const keys = [];
      if (s.ctrlKey) keys.push('Ctrl');
      if (s.shiftKey) keys.push('Shift');
      if (s.altKey) keys.push('Alt');
      keys.push(s.key.toUpperCase());
      return `${keys.join(' + ')}: ${s.description}`;
    }).join('\n');

    toast({
      title: "Keyboard Shortcuts",
      description: shortcutList,
    });
  };

  return { showShortcuts };
};
