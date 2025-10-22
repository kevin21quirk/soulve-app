import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface BankTransferInstructionsProps {
  accountName: string;
  sortCode: string;
  accountNumber: string;
  reference: string;
  amount: number;
  currency?: string;
}

export const BankTransferInstructions = ({
  accountName,
  sortCode,
  accountNumber,
  reference,
  amount,
  currency = 'GBP'
}: BankTransferInstructionsProps) => {
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied`
    });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-primary" />
          Bank Transfer Details
        </CardTitle>
        <CardDescription>
          Please use the following details to make your payment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Account Name */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Account Name</p>
            <p className="font-mono font-semibold">{accountName}</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => copyToClipboard(accountName, 'Account name')}
          >
            {copied === 'Account name' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        {/* Sort Code */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Sort Code</p>
            <p className="font-mono font-semibold">{sortCode}</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => copyToClipboard(sortCode.replace(/-/g, ''), 'Sort code')}
          >
            {copied === 'Sort code' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        {/* Account Number */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Account Number</p>
            <p className="font-mono font-semibold">{accountNumber}</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => copyToClipboard(accountNumber, 'Account number')}
          >
            {copied === 'Account number' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        {/* Payment Reference - CRITICAL */}
        <div className="flex items-center justify-between p-3 bg-primary/10 border-2 border-primary rounded-lg">
          <div>
            <p className="text-xs font-semibold text-primary">Payment Reference (IMPORTANT)</p>
            <p className="font-mono font-bold text-lg">{reference}</p>
          </div>
          <Button
            size="sm"
            variant="default"
            onClick={() => copyToClipboard(reference, 'Payment reference')}
          >
            {copied === 'Payment reference' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Amount to Pay</p>
            <p className="font-mono font-semibold text-xl">
              {currency === 'GBP' ? '£' : currency} {amount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2">
            ⚠️ Important: Include the Payment Reference
          </p>
          <p className="text-xs text-muted-foreground">
            Please ensure you include the payment reference <strong>{reference}</strong> when making your transfer. 
            This helps us identify your payment and activate your subscription immediately.
          </p>
        </div>

        {/* Timeline */}
        <div className="text-xs text-muted-foreground text-center pt-2">
          Your subscription will be activated within 1-2 business days after we receive payment
        </div>
      </CardContent>
    </Card>
  );
};
