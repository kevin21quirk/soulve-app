
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Heart, 
  Star, 
  Target,
  Activity,
  Calendar,
  Download,
  RefreshCw
} from "lucide-react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import MobileMetricsCard from "./MobileMetricsCard";
import MobileBarChart from "../charts/MobileBarChart";
import MobileLineChart from "../charts/MobileLineChart";
import MobilePieChart from "../charts/MobilePieChart";

const MobileAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { 
    helpActivityData, 
    engagementData, 
    categoryData, 
    impactMetrics, 
    isLoading, 
    error, 
    refetch 
  } = useAnalyticsData();

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-red-600 mb-2">Analytics Error</h3>
            <p className="text-gray-600 mb-4">Unable to load analytics data</p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="engagement">Social</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            {impactMetrics?.map((metric, index) => (
              <MobileMetricsCard
                key={index}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                trend={metric.trend}
                icon={index === 0 ? Users : index === 1 ? Heart : index === 2 ? Star : Target}
              />
            ))}
          </div>

          {/* Weekly Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Weekly Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {helpActivityData && (
                <MobileLineChart 
                  data={helpActivityData.map(item => ({
                    name: item.week.replace('Week ', 'W'),
                    value: item.helped,
                    received: item.received
                  }))}
                  height={180}
                  color="#0ce4af"
                />
              )}
            </CardContent>
          </Card>

          {/* Help Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Help Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData && (
                <MobilePieChart 
                  data={categoryData}
                  height={200}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4 mt-4">
          {/* Help Activity Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Help Activity Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {helpActivityData && (
                <MobileBarChart 
                  data={helpActivityData.map(item => ({
                    name: item.week.replace('Week ', 'W'),
                    value: item.helped,
                    color: "#18a5fe"
                  }))}
                  height={200}
                />
              )}
            </CardContent>
          </Card>

          {/* Activity Stats */}
          <div className="grid grid-cols-2 gap-4">
            <MobileMetricsCard
              title="Total Helped"
              value={helpActivityData?.reduce((sum, item) => sum + item.helped, 0) || 0}
              icon={Users}
              description="People you've helped"
              badge="Active"
              badgeVariant="default"
            />
            <MobileMetricsCard
              title="Help Received"
              value={helpActivityData?.reduce((sum, item) => sum + item.received, 0) || 0}
              icon={Heart}
              description="Times you received help"
              badge="Grateful"
              badgeVariant="secondary"
            />
          </div>

          {/* Recent Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Most Active Day</span>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    This Week
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Response Rate</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700">
                    96%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium">Avg Response Time</span>
                  </div>
                  <Badge variant="outline" className="bg-purple-100 text-purple-700">
                    2.3h
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4 mt-4">
          {/* Social Engagement Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Daily Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              {engagementData && (
                <MobileBarChart 
                  data={engagementData.map(item => ({
                    name: item.day,
                    value: item.likes + item.comments,
                    color: "#ff6b6b"
                  }))}
                  height={180}
                />
              )}
            </CardContent>
          </Card>

          {/* Engagement Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <MobileMetricsCard
              title="Total Likes"
              value={engagementData?.reduce((sum, item) => sum + item.likes, 0) || 0}
              change="+18%"
              trend="up"
              icon={Heart}
            />
            <MobileMetricsCard
              title="Comments"
              value={engagementData?.reduce((sum, item) => sum + item.comments, 0) || 0}
              change="+12%"
              trend="up"
              icon={Users}
            />
          </div>

          {/* Post Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Post Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {engagementData?.slice(0, 3).map((day, index) => (
                  <div key={day.day} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{day.day[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{day.day}</p>
                        <p className="text-xs text-gray-500">{day.posts} posts</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{day.likes + day.comments}</div>
                      <div className="text-xs text-gray-500">interactions</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="space-y-4 mt-4">
          {/* Impact Overview */}
          <div className="grid grid-cols-2 gap-4">
            <MobileMetricsCard
              title="Community Impact"
              value="312hrs"
              change="+22%"
              trend="up"
              icon={Target}
              description="Total volunteer hours"
            />
            <MobileMetricsCard
              title="Trust Score"
              value="94%"
              change="+2%"
              trend="up"
              icon={Star}
              description="Community trust rating"
            />
          </div>

          {/* Impact Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Impact by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData && (
                <div className="space-y-3">
                  {categoryData.map((category, index) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{category.name}</span>
                        <span className="text-sm text-gray-600">{category.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{
                            width: `${category.value}%`,
                            backgroundColor: category.color
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Monthly Goals</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Help 15 people</span>
                    <span>12/15</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Volunteer 20 hours</span>
                    <span>16/20</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Make 5 connections</span>
                    <span>7/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileAnalyticsDashboard;
