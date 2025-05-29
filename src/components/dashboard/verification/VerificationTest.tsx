
import { useVerifications } from "@/hooks/useVerifications";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VerificationTest = () => {
  const { user } = useAuth();
  const { verifications, trustScore, loading, requestVerification } = useVerifications();

  const handleTestVerification = () => {
    requestVerification('email', { test: true });
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Please log in to test verification system</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification System Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p><strong>User ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
        
        <div>
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          <p><strong>Trust Score:</strong> {trustScore}%</p>
          <p><strong>Verifications Count:</strong> {verifications.length}</p>
        </div>

        <div>
          <h4 className="font-medium mb-2">Current Verifications:</h4>
          {verifications.length > 0 ? (
            <ul className="space-y-1">
              {verifications.map((v) => (
                <li key={v.id} className="text-sm">
                  {v.verification_type}: {v.status}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No verifications found</p>
          )}
        </div>

        <Button onClick={handleTestVerification} className="w-full">
          Test Email Verification Request
        </Button>
      </CardContent>
    </Card>
  );
};

export default VerificationTest;
