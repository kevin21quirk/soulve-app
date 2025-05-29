
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";

interface MobileSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onBack: () => void;
}

const MobileSearchHeader = ({ 
  searchQuery, 
  onSearchChange, 
  onBack 
}: MobileSearchHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
      <div className="flex items-center space-x-3 mb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-0 hover:bg-transparent"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations and messages..."
            className="pl-10 rounded-full border-gray-300 focus:border-[#18a5fe] focus:ring-[#18a5fe]"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default MobileSearchHeader;
