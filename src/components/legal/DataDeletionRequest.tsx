import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DataDeletionRequest = () => {
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { signOut } = useAuth();

  const handleDeleteAccount = async () => {
    if (!confirmed) {
      toast({
        title: "Confirmation required",
        description: "Please confirm you understand this action is permanent.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Request account deletion via edge function
      const { error } = await supabase.functions.invoke("delete-user-data", {
        body: { confirmed: true },
      });

      if (error) throw error;

      toast({
        title: "Account deletion requested",
        description: "Your account and data will be permanently deleted within 30 days. You will receive a confirmation email.",
      });

      // Sign out the user
      await signOut();
    } catch (error: any) {
      toast({
        title: "Deletion request failed",
        description: error.message || "Unable to process deletion request. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Delete Account & Data
        </CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>
            <strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted, including:
            <ul className="list-disc list-inside mt-2 ml-2">
              <li>Profile information</li>
              <li>Posts and comments</li>
              <li>Connections and messages</li>
              <li>Campaign participation history</li>
              <li>ESG data and reports</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="confirm-deletion"
            checked={confirmed}
            onCheckedChange={(checked) => setConfirmed(checked as boolean)}
          />
          <label
            htmlFor="confirm-deletion"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I understand that this action is permanent and cannot be undone
          </label>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={!confirmed || loading}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {loading ? "Processing..." : "Delete My Account"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your account and remove all your data from our servers. This action cannot be reversed.
                You will be logged out immediately and your data will be deleted within 30 days.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Yes, Delete Everything
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <p className="text-xs text-muted-foreground">
          Need help? Contact us at privacy@soulve.com before deleting your account.
        </p>
      </CardContent>
    </Card>
  );
};

export default DataDeletionRequest;
