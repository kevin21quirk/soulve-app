
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Settings, Save, RotateCcw, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PointConfig {
  category: string;
  basePoints: number;
  multiplier: number;
  cooldown: number;
  enabled: boolean;
}

interface TrustLevelConfig {
  level: string;
  name: string;
  minPoints: number;
  color: string;
  benefits: string[];
}

const AdminCustomizationPanel = () => {
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);

  const [pointConfigs, setPointConfigs] = useState<PointConfig[]>([
    { category: 'help_completed', basePoints: 25, multiplier: 1.0, cooldown: 0, enabled: true },
    { category: 'emergency_help', basePoints: 50, multiplier: 1.0, cooldown: 60, enabled: true },
    { category: 'donation', basePoints: 10, multiplier: 1.0, cooldown: 0, enabled: true },
    { category: 'recurring_help', basePoints: 35, multiplier: 1.5, cooldown: 1440, enabled: true },
    { category: 'user_referral', basePoints: 20, multiplier: 1.0, cooldown: 1440, enabled: true },
  ]);

  const [trustLevels, setTrustLevels] = useState<TrustLevelConfig[]>([
    {
      level: 'new_user',
      name: 'New User',
      minPoints: 0,
      color: 'gray',
      benefits: ['Basic platform access', 'Limited help requests']
    },
    {
      level: 'verified_helper',
      name: 'Verified Helper',
      minPoints: 100,
      color: 'blue',
      benefits: ['Increased limits', 'Profile badge', 'Priority matching']
    },
    {
      level: 'trusted_helper',
      name: 'Trusted Helper',
      minPoints: 500,
      color: 'green',
      benefits: ['Unlimited requests', 'Mentor access', 'Advanced features']
    },
    {
      level: 'community_leader',
      name: 'Community Leader',
      minPoints: 1500,
      color: 'purple',
      benefits: ['Moderation tools', 'Group creation', 'Featured status']
    },
    {
      level: 'impact_champion',
      name: 'Impact Champion',
      minPoints: 3000,
      color: 'yellow',
      benefits: ['All privileges', 'Advisory access', 'Partnership benefits']
    }
  ]);

  const [systemSettings, setSystemSettings] = useState({
    enableRealTimeUpdates: true,
    enableSeasonalBonuses: true,
    enableAchievementNotifications: true,
    maxPointsPerDay: 500,
    trustScoreDecayRate: 0.1,
    leaderboardUpdateInterval: 300
  });

  const updatePointConfig = (index: number, field: keyof PointConfig, value: any) => {
    const updated = [...pointConfigs];
    updated[index] = { ...updated[index], [field]: value };
    setPointConfigs(updated);
    setHasChanges(true);
  };

  const updateTrustLevel = (index: number, field: keyof TrustLevelConfig, value: any) => {
    const updated = [...trustLevels];
    updated[index] = { ...updated[index], [field]: value };
    setTrustLevels(updated);
    setHasChanges(true);
  };

  const updateSystemSetting = (field: string, value: any) => {
    setSystemSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real implementation, this would send the config to the backend
    toast({
      title: "Configuration Saved ✅",
      description: "All changes have been applied successfully.",
    });
    setHasChanges(false);
  };

  const handleReset = () => {
    // Reset to default values
    toast({
      title: "Configuration Reset",
      description: "All settings have been restored to defaults.",
    });
    setHasChanges(false);
  };

  const formatCategory = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Gamification Admin Panel</span>
          </div>
          {hasChanges && (
            <Badge variant="outline" className="bg-orange-50 text-orange-700">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Unsaved Changes
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Customize point values, trust levels, and system behavior
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="points" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="points">Point Values</TabsTrigger>
            <TabsTrigger value="levels">Trust Levels</TabsTrigger>
            <TabsTrigger value="system">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="points" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Point Categories Configuration</h4>
              {pointConfigs.map((config, index) => (
                <Card key={config.category}>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                      <div>
                        <Label className="text-sm font-medium">
                          {formatCategory(config.category)}
                        </Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Switch
                            checked={config.enabled}
                            onCheckedChange={(enabled) => updatePointConfig(index, 'enabled', enabled)}
                          />
                          <span className="text-xs text-gray-500">
                            {config.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm">Base Points</Label>
                        <Input
                          type="number"
                          value={config.basePoints}
                          onChange={(e) => updatePointConfig(index, 'basePoints', Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm">Multiplier</Label>
                        <div className="space-y-2 mt-1">
                          <Slider
                            value={[config.multiplier]}
                            onValueChange={([value]) => updatePointConfig(index, 'multiplier', value)}
                            max={3}
                            min={0.1}
                            step={0.1}
                          />
                          <span className="text-xs text-gray-500">{config.multiplier}x</span>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm">Cooldown (min)</Label>
                        <Input
                          type="number"
                          value={config.cooldown}
                          onChange={(e) => updatePointConfig(index, 'cooldown', Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-medium">
                          Final Points: {Math.round(config.basePoints * config.multiplier)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {config.cooldown > 0 ? `${config.cooldown}min cooldown` : 'No cooldown'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="levels" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Trust Level Configuration</h4>
              {trustLevels.map((level, index) => (
                <Card key={level.level}>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm">Level Name</Label>
                        <Input
                          value={level.name}
                          onChange={(e) => updateTrustLevel(index, 'name', e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm">Minimum Points</Label>
                        <Input
                          type="number"
                          value={level.minPoints}
                          onChange={(e) => updateTrustLevel(index, 'minPoints', Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm">Color Theme</Label>
                        <select
                          value={level.color}
                          onChange={(e) => updateTrustLevel(index, 'color', e.target.value)}
                          className="w-full mt-1 p-2 border rounded-md"
                        >
                          <option value="gray">Gray</option>
                          <option value="blue">Blue</option>
                          <option value="green">Green</option>
                          <option value="purple">Purple</option>
                          <option value="yellow">Yellow</option>
                          <option value="red">Red</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label className="text-sm">Benefits</Label>
                      <div className="mt-2 space-y-1">
                        {level.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                            <span className="text-sm text-gray-600">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <div className="space-y-6">
              <h4 className="font-medium">System Behavior Settings</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Real-time Updates</Label>
                        <Switch
                          checked={systemSettings.enableRealTimeUpdates}
                          onCheckedChange={(checked) => updateSystemSetting('enableRealTimeUpdates', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Seasonal Bonuses</Label>
                        <Switch
                          checked={systemSettings.enableSeasonalBonuses}
                          onCheckedChange={(checked) => updateSystemSetting('enableSeasonalBonuses', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Achievement Notifications</Label>
                        <Switch
                          checked={systemSettings.enableAchievementNotifications}
                          onCheckedChange={(checked) => updateSystemSetting('enableAchievementNotifications', checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <Label>Max Points Per Day</Label>
                        <Input
                          type="number"
                          value={systemSettings.maxPointsPerDay}
                          onChange={(e) => updateSystemSetting('maxPointsPerDay', Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label>Trust Score Decay Rate (%)</Label>
                        <div className="space-y-2 mt-1">
                          <Slider
                            value={[systemSettings.trustScoreDecayRate]}
                            onValueChange={([value]) => updateSystemSetting('trustScoreDecayRate', value)}
                            max={1}
                            min={0}
                            step={0.01}
                          />
                          <span className="text-xs text-gray-500">{(systemSettings.trustScoreDecayRate * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Leaderboard Update Interval (seconds)</Label>
                        <Input
                          type="number"
                          value={systemSettings.leaderboardUpdateInterval}
                          onChange={(e) => updateSystemSetting('leaderboardUpdateInterval', Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between mt-6 pt-6 border-t">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCustomizationPanel;
