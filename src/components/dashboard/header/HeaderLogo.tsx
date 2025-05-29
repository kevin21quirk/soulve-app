
import { Badge } from "@/components/ui/badge";
import SouLVELogo from "@/components/SouLVELogo";

const HeaderLogo = () => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10">
          <SouLVELogo size="small" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
          SouLVE
        </h1>
      </div>
      <Badge variant="secondary" className="hidden sm:inline-flex bg-[#4c3dfb] text-white hover:bg-[#4c3dfb]/90">
        Dashboard
      </Badge>
    </div>
  );
};

export default HeaderLogo;
