
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

const SettingsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-6 w-6" />
          <span>Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Settings panel coming soon...</p>
      </CardContent>
    </Card>
  );
};

export default SettingsTab;
