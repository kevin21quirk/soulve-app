
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Smartphone } from 'lucide-react';
import { useAppInstallPrompt } from '@/hooks/useAppInstallPrompt';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileInstallPrompt = () => {
  const { isInstallable, promptInstall } = useAppInstallPrompt();
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('installPromptDismissed');
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  useEffect(() => {
    if (isInstallable && isMobile && !isDismissed) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isMobile, isDismissed]);

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  if (!isVisible || !isMobile) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-in-right">
      <Card className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white border-none shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className="p-2 bg-white bg-opacity-20 rounded-full">
                <Smartphone className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">Install SouLVE App</h4>
                <p className="text-xs opacity-90">
                  Get the full app experience with offline access
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleInstall}
                className="bg-white text-blue-600 hover:bg-gray-100 text-xs px-3 py-1"
              >
                <Download className="h-3 w-3 mr-1" />
                Install
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="text-white hover:bg-white hover:bg-opacity-20 p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileInstallPrompt;
