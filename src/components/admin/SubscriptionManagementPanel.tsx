import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Crown, Search, Shield, AlertCircle, Calendar, CheckCircle2 } from 'lucide-react';
import FoundingMemberBadge from '../subscription/FoundingMemberBadge';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  is_founding_member: boolean;
  founding_member_granted_at: string | null;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price_monthly: number;
  price_annual: number;
}

const SubscriptionManagementPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showGrantDialog, setShowGrantDialog] = useState(false);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load users with their profiles
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, is_founding_member, founding_member_granted_at')
        .order('first_name');

      if (usersError) throw usersError;

      // Load subscription plans
      const { data: plansData, error: plansError } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price_monthly');

      if (plansError) throw plansError;

      setUsers(usersData || []);
      setPlans(plansData || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleGrantFoundingMember = async () => {
    if (!selectedUser) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.rpc('admin_grant_founding_member', {
        target_user_id: selectedUser.id,
        admin_user_id: user.id,
        reason_text: reason || null
      });

      if (error) throw error;

      toast.success(`Granted founding member status to ${selectedUser.first_name} ${selectedUser.last_name}`);
      setShowGrantDialog(false);
      setReason('');
      setSelectedUser(null);
      loadData();
    } catch (error: any) {
      console.error('Failed to grant founding member:', error);
      toast.error(error.message || 'Failed to grant founding member status');
    }
  };

  const handleRevokeFoundingMember = async () => {
    if (!selectedUser) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.rpc('admin_revoke_founding_member', {
        target_user_id: selectedUser.id,
        admin_user_id: user.id,
        reason_text: reason || null
      });

      if (error) throw error;

      toast.success(`Revoked founding member status from ${selectedUser.first_name} ${selectedUser.last_name}`);
      setShowRevokeDialog(false);
      setReason('');
      setSelectedUser(null);
      loadData();
    } catch (error: any) {
      console.error('Failed to revoke founding member:', error);
      toast.error(error.message || 'Failed to revoke founding member status');
    }
  };

  const handleAssignSubscription = async () => {
    if (!selectedUser || !selectedPlan) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.rpc('admin_assign_subscription', {
        target_user_id: selectedUser.id,
        plan_uuid: selectedPlan,
        billing_cycle_type: billingCycle,
        admin_user_id: user.id,
        reason_text: reason || null
      });

      if (error) throw error;

      toast.success(`Assigned subscription to ${selectedUser.first_name} ${selectedUser.last_name}`);
      setShowAssignDialog(false);
      setReason('');
      setSelectedPlan('');
      setSelectedUser(null);
      loadData();
    } catch (error: any) {
      console.error('Failed to assign subscription:', error);
      toast.error(error.message || 'Failed to assign subscription');
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const foundingMemberCount = users.filter(u => u.is_founding_member).length;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading subscription data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-500" />
              Founding Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{foundingMemberCount}</div>
            <p className="text-xs text-muted-foreground">Total founding members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">All platform users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" />
              Available Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
            <p className="text-xs text-muted-foreground">Subscription tiers</p>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle>User Subscription Management</CardTitle>
          <CardDescription>
            Manage founding member status and subscription plans for users
          </CardDescription>
          <div className="flex items-center gap-2 mt-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Granted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.first_name} {user.last_name}</div>
                      <div className="text-sm text-muted-foreground">User ID: {user.id.slice(0, 8)}...</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.is_founding_member ? (
                      <FoundingMemberBadge size="sm" />
                    ) : (
                      <Badge variant="outline">Regular User</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.founding_member_granted_at ? (
                      <div className="text-sm">
                        {new Date(user.founding_member_granted_at).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {user.is_founding_member ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowRevokeDialog(true);
                        }}
                      >
                        Revoke
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowGrantDialog(true);
                        }}
                      >
                        <Crown className="h-3 w-3 mr-1" />
                        Grant
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowAssignDialog(true);
                      }}
                    >
                      Assign Plan
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Grant Founding Member Dialog */}
      <Dialog open={showGrantDialog} onOpenChange={setShowGrantDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              Grant Founding Member Status
            </DialogTitle>
            <DialogDescription>
              Give {selectedUser?.first_name} {selectedUser?.last_name} founding member status with unlimited access to all features.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-900">Founding members receive:</p>
                  <ul className="mt-2 space-y-1 text-amber-800">
                    <li>• Unlimited campaigns</li>
                    <li>• Unlimited team members</li>
                    <li>• White label branding</li>
                    <li>• Full ESG reporting access</li>
                    <li>• Lifetime access (no expiration)</li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Reason (optional)</label>
              <Textarea
                placeholder="Why are you granting founding member status?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGrantDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleGrantFoundingMember}>
              <Crown className="h-4 w-4 mr-2" />
              Grant Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Founding Member Dialog */}
      <Dialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Revoke Founding Member Status
            </DialogTitle>
            <DialogDescription>
              Remove founding member status from {selectedUser?.first_name} {selectedUser?.last_name}. This action will revert them to their subscription plan limits or free tier.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                ⚠️ This will immediately remove all founding member benefits including unlimited campaigns, team members, and premium features.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Reason (required)</label>
              <Textarea
                placeholder="Why are you revoking founding member status?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRevokeDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRevokeFoundingMember}
              disabled={!reason.trim()}
            >
              Revoke Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Subscription Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Subscription Plan</DialogTitle>
            <DialogDescription>
              Manually assign a subscription plan to {selectedUser?.first_name} {selectedUser?.last_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Plan</label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} - £{plan.price_monthly}/month
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Billing Cycle</label>
              <Select 
                value={billingCycle} 
                onValueChange={(value) => setBillingCycle(value as 'monthly' | 'annual')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Reason (optional)</label>
              <Textarea
                placeholder="Why are you assigning this subscription?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignSubscription} disabled={!selectedPlan}>
              Assign Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionManagementPanel;
