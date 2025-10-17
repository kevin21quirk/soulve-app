import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Building2, Shield, FileText, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const OrganizationSettingsPanel = () => {
  const [settings, setSettings] = useState({
    // General Settings
    platformName: 'FriendnPal',
    maintenanceMode: false,
    registrationEnabled: true,
    
    // Organization Settings
    autoVerifyOrganizations: false,
    requireCompanyNumber: true,
    allowSelfRegistration: true,
    
    // ESG Settings
    enableESGFrameworks: true,
    requireDataVerification: true,
    autoGenerateReports: false,
    
    // Security Settings
    enforceStrongPasswords: true,
    require2FA: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
  });

  const handleSave = () => {
    // Save settings to database
    toast({
      title: 'Settings Saved',
      description: 'Organization settings have been updated successfully',
    });
  };

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Organization Settings</h1>
        <p className="text-muted-foreground">Configure platform-wide settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="organizations">
            <Building2 className="h-4 w-4 mr-2" />
            Organizations
          </TabsTrigger>
          <TabsTrigger value="esg">
            <FileText className="h-4 w-4 mr-2" />
            ESG
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>General platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="platformName">Platform Name</Label>
                <Input
                  id="platformName"
                  value={settings.platformName}
                  onChange={(e) => setSettings(prev => ({ ...prev, platformName: e.target.value }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Temporarily disable access to the platform</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={() => handleToggle('maintenanceMode')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>User Registration</Label>
                  <p className="text-sm text-muted-foreground">Allow new users to register</p>
                </div>
                <Switch
                  checked={settings.registrationEnabled}
                  onCheckedChange={() => handleToggle('registrationEnabled')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organizations" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Configuration</CardTitle>
              <CardDescription>Settings for organization management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-Verify Organizations</Label>
                  <p className="text-sm text-muted-foreground">Automatically verify registered organizations</p>
                </div>
                <Switch
                  checked={settings.autoVerifyOrganizations}
                  onCheckedChange={() => handleToggle('autoVerifyOrganizations')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Company Number</Label>
                  <p className="text-sm text-muted-foreground">Make company registration number mandatory</p>
                </div>
                <Switch
                  checked={settings.requireCompanyNumber}
                  onCheckedChange={() => handleToggle('requireCompanyNumber')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Self-Registration</Label>
                  <p className="text-sm text-muted-foreground">Let users create their own organizations</p>
                </div>
                <Switch
                  checked={settings.allowSelfRegistration}
                  onCheckedChange={() => handleToggle('allowSelfRegistration')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="esg" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>ESG Framework Settings</CardTitle>
              <CardDescription>Configure ESG reporting and data management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable ESG Frameworks</Label>
                  <p className="text-sm text-muted-foreground">Allow organizations to use ESG frameworks</p>
                </div>
                <Switch
                  checked={settings.enableESGFrameworks}
                  onCheckedChange={() => handleToggle('enableESGFrameworks')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Data Verification</Label>
                  <p className="text-sm text-muted-foreground">All ESG data must be verified before use</p>
                </div>
                <Switch
                  checked={settings.requireDataVerification}
                  onCheckedChange={() => handleToggle('requireDataVerification')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-Generate Reports</Label>
                  <p className="text-sm text-muted-foreground">Automatically create reports at 100% completion</p>
                </div>
                <Switch
                  checked={settings.autoGenerateReports}
                  onCheckedChange={() => handleToggle('autoGenerateReports')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and authentication policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enforce Strong Passwords</Label>
                  <p className="text-sm text-muted-foreground">Require complex passwords (8+ chars, symbols, etc.)</p>
                </div>
                <Switch
                  checked={settings.enforceStrongPasswords}
                  onCheckedChange={() => handleToggle('enforceStrongPasswords')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Force all users to enable 2FA</p>
                </div>
                <Switch
                  checked={settings.require2FA}
                  onCheckedChange={() => handleToggle('require2FA')}
                />
              </div>

              <div>
                <Label>Session Timeout (minutes)</Label>
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                />
                <p className="text-sm text-muted-foreground mt-1">Auto-logout after inactivity</p>
              </div>

              <div>
                <Label>Max Login Attempts</Label>
                <Input
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                />
                <p className="text-sm text-muted-foreground mt-1">Lock account after failed attempts</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
};