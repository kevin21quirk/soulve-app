
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useEnhancedPoints } from '@/hooks/useEnhancedPoints';
import { DollarSign, Heart, RefreshCw } from 'lucide-react';

interface DonationPointsIntegrationProps {
  campaignId: string;
  campaignTitle: string;
}

const DonationPointsIntegration = ({ campaignId, campaignTitle }: DonationPointsIntegrationProps) => {
  const [amount, setAmount] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  
  const { awardDonationPoints, loading } = useEnhancedPoints();

  const handleDonation = async () => {
    const donationAmount = parseFloat(amount);
    if (!donationAmount || donationAmount <= 0) return;

    await awardDonationPoints(donationAmount, isRecurring, isMatching);
    
    // Reset form
    setAmount('');
    setIsRecurring(false);
    setIsMatching(false);
  };

  const calculatePoints = () => {
    const donationAmount = parseFloat(amount) || 0;
    let pointsPerPound = 1; // Base rate
    
    if (isMatching) pointsPerPound = 2;
    else if (isRecurring) pointsPerPound = 1.2;
    
    return Math.round(donationAmount * pointsPerPound);
  };

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-green-800">
          <Heart className="h-5 w-5" />
          <span>Support Campaign & Earn Points</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-700 mb-4">
            Supporting: <strong>{campaignTitle}</strong>
          </p>
          <p className="text-xs text-green-600 mb-4">
            💝 Campaign points never decay - supporting long-term impact!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Donation Amount (£)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label>Points You'll Earn</Label>
            <div className="flex items-center h-10 px-3 border rounded-md bg-green-50">
              <DollarSign className="h-4 w-4 text-green-600 mr-1" />
              <span className="font-medium text-green-700">
                {calculatePoints()} points
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="recurring"
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
            <Label htmlFor="recurring" className="text-sm">
              Recurring donation (+20% bonus points)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="matching"
              checked={isMatching}
              onCheckedChange={setIsMatching}
            />
            <Label htmlFor="matching" className="text-sm">
              Matching donation (2x points)
            </Label>
          </div>
        </div>

        <div className="pt-2">
          <Button
            onClick={handleDonation}
            disabled={loading || !amount || parseFloat(amount) <= 0}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
            <DollarSign className="h-4 w-4 mr-2" />
            Donate £{amount || '0'} & Earn {calculatePoints()} Points
          </Button>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Campaign points are permanent and never decay</p>
          <p>• Points awarded instantly upon donation</p>
          <p>• Supports long-term community campaigns</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationPointsIntegration;
