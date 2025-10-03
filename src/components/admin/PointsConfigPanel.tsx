import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Save } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PointsConfig {
  id: string;
  config_key: string;
  config_value: any;
  description: string;
  category: string;
}

const PointsConfigPanel = () => {
  const [configs, setConfigs] = useState<PointsConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfigs();

    const channel = supabase
      .channel('points-config-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'points_configuration' }, () => {
        loadConfigs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('points_configuration')
        .select('*')
        .order('category');

      if (error) throw error;
      setConfigs(data || []);
    } catch (error) {
      console.error('Error loading configs:', error);
      toast.error('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (configKey: string, newValue: any) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('points_configuration')
        .update({ 
          config_value: newValue,
          updated_at: new Date().toISOString()
        })
        .eq('config_key', configKey);

      if (error) throw error;
      toast.success('Configuration updated successfully');
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const updateConfigValue = (configKey: string, path: string, value: any) => {
    setConfigs(configs.map(config => {
      if (config.config_key === configKey) {
        const newValue = { ...config.config_value };
        newValue[path] = value;
        return { ...config, config_value: newValue };
      }
      return config;
    }));
  };

  const getConfig = (key: string) => configs.find(c => c.config_key === key);

  if (loading) {
    return <div className="flex justify-center p-8">Loading configuration...</div>;
  }

  const basePointsConfig = getConfig('base_points');
  const multipliersConfig = getConfig('multipliers');
  const decayConfig = getConfig('decay_settings');
  const trustLevelsConfig = getConfig('trust_levels');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <CardTitle>Points System Configuration</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="base-points">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="base-points">Base Points</TabsTrigger>
            <TabsTrigger value="multipliers">Multipliers</TabsTrigger>
            <TabsTrigger value="decay">Decay Settings</TabsTrigger>
            <TabsTrigger value="trust-levels">Trust Levels</TabsTrigger>
          </TabsList>

          <TabsContent value="base-points" className="space-y-4">
            <div className="grid gap-4">
              {basePointsConfig && Object.entries(basePointsConfig.config_value).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label className="capitalize">{key.replace(/_/g, ' ')}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={value as number}
                      onChange={(e) => updateConfigValue('base_points', key, parseInt(e.target.value))}
                      className="w-24"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleSaveConfig('base_points', basePointsConfig.config_value)}
                      disabled={saving}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="multipliers" className="space-y-4">
            <div className="grid gap-4">
              {multipliersConfig && Object.entries(multipliersConfig.config_value).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label className="capitalize">{key.replace(/_/g, ' ')}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={value as number}
                      onChange={(e) => updateConfigValue('multipliers', key, parseFloat(e.target.value))}
                      className="w-24"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleSaveConfig('multipliers', multipliersConfig.config_value)}
                      disabled={saving}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="decay" className="space-y-4">
            {decayConfig && (
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Decay</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={decayConfig.config_value.enabled}
                      onCheckedChange={(checked) => {
                        updateConfigValue('decay_settings', 'enabled', checked);
                        handleSaveConfig('decay_settings', { ...decayConfig.config_value, enabled: checked });
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Decay Rate (%)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={decayConfig.config_value.rate}
                      onChange={(e) => updateConfigValue('decay_settings', 'rate', parseInt(e.target.value))}
                      className="w-24"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleSaveConfig('decay_settings', decayConfig.config_value)}
                      disabled={saving}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Interval (days)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={decayConfig.config_value.interval_days}
                      onChange={(e) => updateConfigValue('decay_settings', 'interval_days', parseInt(e.target.value))}
                      className="w-24"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleSaveConfig('decay_settings', decayConfig.config_value)}
                      disabled={saving}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Max Decay (%)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={decayConfig.config_value.max_decay}
                      onChange={(e) => updateConfigValue('decay_settings', 'max_decay', parseInt(e.target.value))}
                      className="w-24"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleSaveConfig('decay_settings', decayConfig.config_value)}
                      disabled={saving}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="trust-levels" className="space-y-4">
            <div className="grid gap-4">
              {trustLevelsConfig && Object.entries(trustLevelsConfig.config_value).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label className="capitalize">{key}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={value as number}
                      onChange={(e) => updateConfigValue('trust_levels', key, parseInt(e.target.value))}
                      className="w-24"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleSaveConfig('trust_levels', trustLevelsConfig.config_value)}
                      disabled={saving}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PointsConfigPanel;
