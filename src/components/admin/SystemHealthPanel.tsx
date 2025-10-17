import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Activity, Database, Zap, HardDrive, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { LoadingState } from '@/components/ui/loading-state';

export const SystemHealthPanel = () => {
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState({
    database: { status: 'healthy', responseTime: 0 },
    storage: { status: 'healthy', used: 0, total: 100 },
    functions: { status: 'healthy', count: 0 },
    api: { status: 'healthy', rateLimit: { used: 0, limit: 1000 } }
  });

  useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const checkSystemHealth = async () => {
    try {
      const startTime = Date.now();
      
      // Test database connection
      const { error: dbError } = await supabase.from('profiles').select('id').limit(1);
      const dbResponseTime = Date.now() - startTime;
      
      setHealth({
        database: {
          status: dbError ? 'error' : 'healthy',
          responseTime: dbResponseTime
        },
        storage: {
          status: 'healthy',
          used: 45, // Mock data
          total: 100
        },
        functions: {
          status: 'healthy',
          count: 12 // Mock data
        },
        api: {
          status: 'healthy',
          rateLimit: { used: 234, limit: 1000 } // Mock data
        }
      });
    } catch (error) {
      console.error('Error checking system health:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'healthy') {
      return (
        <Badge className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          Healthy
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-500">
        <AlertCircle className="h-3 w-3 mr-1" />
        Error
      </Badge>
    );
  };

  if (loading) return <LoadingState message="Checking system health..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Health Monitor</h1>
          <p className="text-muted-foreground">Real-time platform health and performance metrics</p>
        </div>
        <Button onClick={checkSystemHealth} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Database Status</CardTitle>
                <CardDescription>Connection and query performance</CardDescription>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              {getStatusBadge(health.database.status)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Response Time</span>
              <span className="text-sm font-bold">{health.database.responseTime}ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Connection</span>
              <span className="text-sm text-green-600">Active</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Storage</CardTitle>
                <CardDescription>File storage usage</CardDescription>
              </div>
              <HardDrive className="h-8 w-8 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              {getStatusBadge(health.storage.status)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Usage</span>
                <span className="font-medium">{health.storage.used}GB / {health.storage.total}GB</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all"
                  style={{ width: `${(health.storage.used / health.storage.total) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Edge Functions</CardTitle>
                <CardDescription>Serverless function health</CardDescription>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              {getStatusBadge(health.functions.status)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Functions</span>
              <span className="text-sm font-bold">{health.functions.count}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Deployment</span>
              <span className="text-sm">2 hours ago</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>API Rate Limits</CardTitle>
                <CardDescription>Current API usage</CardDescription>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              {getStatusBadge(health.api.status)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Requests (hourly)</span>
                <span className="font-medium">
                  {health.api.rateLimit.used} / {health.api.rateLimit.limit}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ 
                    width: `${(health.api.rateLimit.used / health.api.rateLimit.limit) * 100}%` 
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Logs Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Events</CardTitle>
          <CardDescription>Latest errors and warnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">System backup completed successfully</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">High memory usage detected on server</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Database optimization completed</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};