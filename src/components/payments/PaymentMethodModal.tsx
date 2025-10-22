import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Clock, Zap } from "lucide-react";

interface PaymentMethodModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  onSelectMethod: (method: 'yapily' | 'bank_transfer') => void;
}

export const PaymentMethodModal = ({ open, onClose, amount, onSelectMethod }: PaymentMethodModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Choose Payment Method</DialogTitle>
          <DialogDescription>
            Select how you'd like to pay £{amount.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Yapily - Instant Payment */}
          <Card 
            className="cursor-pointer hover:border-primary transition-colors relative"
            onClick={() => onSelectMethod('yapily')}
          >
            <Badge className="absolute -top-2 right-4 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe]">
              Recommended
            </Badge>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Pay with Your Bank</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Instant payment via Open Banking. Secure and approved in seconds.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Transaction fee: £0.15 - £0.50</span>
                    <Badge variant="outline" className="text-xs">Instant</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bank Transfer - Manual */}
          <Card 
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => onSelectMethod('bank_transfer')}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Manual Bank Transfer</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Transfer manually from your bank. We'll confirm once received.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Takes 1-2 business days</span>
                    <Badge variant="outline" className="text-xs">No Fees</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
