
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";

interface UseDashboardShortcutsProps {
  setActiveTab: (tab: string) => void;
  setShowSearch: (show: boolean) => void;
  setShowNotifications: (show: boolean) => void;
  setShowShortcuts: (show: boolean) => void;
  setShowActivity: (show: boolean) => void;
}

export const useDashboardShortcuts = ({
  setActiveTab,
  setShowSearch,
  setShowNotifications,
  setShowShortcuts,
  setShowActivity,
}: UseDashboardShortcutsProps) => {
  const shortcuts = [
    {
      key: 'k',
      ctrlKey: true,
      action: () => setShowSearch(true),
      description: 'Open search'
    },
    {
      key: 'n',
      ctrlKey: true,
      action: () => setActiveTab('upload'),
      description: 'Create new post'
    },
    {
      key: 'm',
      ctrlKey: true,
      action: () => setActiveTab('messages'),
      description: 'Open messages'
    },
    {
      key: 'c',
      ctrlKey: true,
      shiftKey: true,
      action: () => setActiveTab('connections'),
      description: 'Open connections'
    },
    {
      key: 'a',
      ctrlKey: true,
      action: () => setActiveTab('analytics'),
      description: 'Open analytics'
    },
    {
      key: 'Escape',
      action: () => {
        setShowSearch(false);
        setShowNotifications(false);
        setShowShortcuts(false);
        setShowActivity(false);
      },
      description: 'Close modals'
    },
    {
      key: '?',
      action: () => setShowShortcuts(true),
      description: 'Show shortcuts'
    }
  ];

  useKeyboardShortcuts(shortcuts);
};
