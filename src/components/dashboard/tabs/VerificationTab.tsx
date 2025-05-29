
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const VerificationTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <span>Verification</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Verification panel coming soon...</p>
      </CardContent>
    </Card>
  );
};

export default VerificationTab;
