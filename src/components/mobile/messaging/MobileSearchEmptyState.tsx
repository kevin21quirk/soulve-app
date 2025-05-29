
import { Search } from "lucide-react";

interface MobileSearchEmptyStateProps {
  searchQuery: string;
}

const MobileSearchEmptyState = ({ searchQuery }: MobileSearchEmptyStateProps) => {
  if (!searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Search className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium mb-2">Search Messages</p>
        <p className="text-sm text-center px-8">
          Find conversations, people, and messages
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
      <Search className="h-12 w-12 mb-4" />
      <p className="text-lg font-medium mb-2">No results found</p>
      <p className="text-sm text-center px-8">
        Try different keywords or check spelling
      </p>
    </div>
  );
};

export default MobileSearchEmptyState;
