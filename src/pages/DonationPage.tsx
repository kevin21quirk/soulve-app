import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { DonationService } from '@/services/donationService';
import { ArrowLeft, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function DonationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const postId = searchParams.get('postId');
  const postTitle = searchParams.get('title');
  
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'yapily' | 'bank_transfer'>('yapily');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campaignId, setCampaignId] = useState<string | null>(null);

  useEffect(() => {
    // Try to find if this post has an associated campaign
    const fetchCampaign = async () => {
      if (!postId) return;
      
      const { data } = await supabase
        .from('campaigns')
        .select('id')
        .eq('status', 'active')
        .limit(1)
        .single();
        
      if (data) {
        setCampaignId(data.id);
      }
    };
    
    fetchCampaign();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to donate.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (!campaignId) {
      toast({
        title: "Error",
        description: "No active campaign found for this post.",
        variant: "destructive"
      });
      return;
    }

    const donationAmount = parseFloat(amount === 'custom' ? customAmount : amount);
    
    if (!donationAmount || donationAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await DonationService.processDonation({
        campaignId,
        amount: donationAmount,
        currency: 'GBP',
        donorName: isAnonymous ? undefined : user.email,
        donorEmail: user.email,
        isAnonymous,
        message,
        paymentMethod
      });

      if (result.success) {
        toast({
          title: "Donation Successful!",
          description: `Thank you for your £${donationAmount} donation.`,
        });
        navigate('/dashboard?tab=campaigns');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Donation error:', error);
      toast({
        title: "Donation Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const presetAmounts = ['10', '25', '50', '100'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-2xl mx-auto py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              Make a Donation
            </CardTitle>
            <CardDescription>
              {postTitle ? `Supporting: ${postTitle}` : 'Support this cause'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label>Donation Amount (£)</Label>
                <RadioGroup value={amount} onValueChange={setAmount}>
                  <div className="grid grid-cols-2 gap-3">
                    {presetAmounts.map((preset) => (
                      <div key={preset} className="flex items-center space-x-2 border rounded-lg p-3 hover:border-primary cursor-pointer">
                        <RadioGroupItem value={preset} id={preset} />
                        <Label htmlFor={preset} className="flex-1 cursor-pointer">
                          £{preset}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="cursor-pointer">Custom Amount</Label>
                  </div>
                </RadioGroup>
                
                {amount === 'custom' && (
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    min="1"
                    step="0.01"
                  />
                )}
              </div>

              <div className="space-y-3">
                <Label>Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                  <div className="flex items-center space-x-2 border rounded-lg p-3">
                    <RadioGroupItem value="yapily" id="yapily" />
                    <Label htmlFor="yapily" className="flex-1 cursor-pointer">Pay with Bank (Instant)</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3">
                    <RadioGroupItem value="bank_transfer" id="bank" />
                    <Label htmlFor="bank" className="flex-1 cursor-pointer">Manual Bank Transfer</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Share a message of support..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                />
                <Label htmlFor="anonymous" className="cursor-pointer">
                  Make this donation anonymous
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting || !amount}
              >
                {isSubmitting ? 'Processing...' : 'Complete Donation'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
