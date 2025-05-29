
import { Badge } from "@/components/ui/badge";
import SouLVELogo from "@/components/SouLVELogo";

const HeaderLogo = () => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10">
          <SouLVELogo size="small" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          SouLVE
        </h1>
      </div>
      <Badge variant="secondary" className="hidden sm:inline-flex">
        Dashboard
      </Badge>
    </div>
  );
};

export default HeaderLogo;
