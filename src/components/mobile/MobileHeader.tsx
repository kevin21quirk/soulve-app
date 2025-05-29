
import { Search, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SouLVELogo from "@/components/SouLVELogo";

const MobileHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <SouLVELogo size="small" />
          <span className="ml-2 text-xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
            SouLVE
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Search className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 relative">
            <MessageCircle className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              2
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
