import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QueryMonitor } from "@/utils/monitoring";
import { RefreshCw, Activity, Database, TrendingUp } from "lucide-react";

/**
 * Admin dashboard component for monitoring performance metrics
 * Only visible to admins
 */
const PerformanceDashboard = () => {
  const [stats, setStats] = useState({
    count: 0,
    avgDuration: 0,
    slowestQuery: null as any,
  });

  const refreshStats = () => {
    setStats(QueryMonitor.getStats());
  };

  useEffect(() => {
    refreshStats();
    const interval = setInterval(refreshStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Performance Monitoring</h2>
          <p className="text-muted-foreground">Real-time performance metrics and query analysis</p>
        </div>
        <Button onClick={refreshStats} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.count}</div>
            <p className="text-xs text-muted-foreground">Last 100 tracked queries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgDuration.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">Mean query execution time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Slowest Query</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.slowestQuery ? `${stats.slowestQuery.duration.toFixed(0)}ms` : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.slowestQuery ? stats.slowestQuery.name : "No queries tracked yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Guidelines</CardTitle>
          <CardDescription>Best practices for optimal performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
            <div>
              <p className="font-medium">Good: &lt; 500ms</p>
              <p className="text-sm text-muted-foreground">Fast and responsive</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2" />
            <div>
              <p className="font-medium">Warning: 500ms - 2000ms</p>
              <p className="text-sm text-muted-foreground">Acceptable but could be optimized</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 mt-2" />
            <div>
              <p className="font-medium">Critical: &gt; 2000ms</p>
              <p className="text-sm text-muted-foreground">Needs immediate optimization</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceDashboard;
