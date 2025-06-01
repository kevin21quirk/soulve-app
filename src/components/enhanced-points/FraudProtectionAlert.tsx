
import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEnhancedPoints } from '@/hooks/useEnhancedPoints';
import { AlertTriangle, Shield, Eye } from 'lucide-react';

const FraudProtectionAlert = () => {
  const { redFlags, loading } = useEnhancedPoints();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setShowAlert(redFlags.length > 0 && !loading);
  }, [redFlags, loading]);

  if (!showAlert) return null;

  const highSeverityFlags = redFlags.filter(flag => flag.severity === 'high' || flag.severity === 'critical');
  const hasHighSeverity = highSeverityFlags.length > 0;

  return (
    <Alert className={`border-l-4 ${hasHighSeverity ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'} mb-6`}>
      <AlertTriangle className={`h-4 w-4 ${hasHighSeverity ? 'text-red-600' : 'text-yellow-600'}`} />
      <AlertDescription>
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`font-medium ${hasHighSeverity ? 'text-red-800' : 'text-yellow-800'} mb-1`}>
              Account Security Notice
            </h4>
            <p className={`text-sm ${hasHighSeverity ? 'text-red-700' : 'text-yellow-700'} mb-2`}>
              {hasHighSeverity 
                ? 'Your account has been flagged for unusual activity and requires review.' 
                : 'Some recent activity requires verification to maintain your trust score.'}
            </p>
            <div className="flex flex-wrap gap-2">
              {redFlags.map((flag) => (
                <Badge 
                  key={flag.id} 
                  variant={flag.severity === 'high' || flag.severity === 'critical' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {flag.flag_type.replace('_', ' ')} • {flag.severity}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAlert(false)}
              className="text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              Dismiss
            </Button>
            {hasHighSeverity && (
              <Button
                size="sm"
                variant="destructive"
                className="text-xs"
              >
                <Shield className="h-3 w-3 mr-1" />
                Contact Support
              </Button>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default FraudProtectionAlert;
