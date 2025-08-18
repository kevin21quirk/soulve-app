import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Leaf, TrendingDown, Factory, Zap, Truck } from "lucide-react";

interface CarbonFootprintData {
  totalEmissions: number;
  scopeBreakdown: Record<string, { total: number; sources: any[] }>;
  monthlyData: Array<{ month: string; emissions: number; scope: number }>;
}

interface CarbonFootprintCardProps {
  carbonData: CarbonFootprintData;
  isLoading?: boolean;
}

const CarbonFootprintCard = ({ carbonData, isLoading = false }: CarbonFootprintCardProps) => {
  const scopeColors = {
    'Scope 1': '#dc2626', // red-600
    'Scope 2': '#ea580c', // orange-600  
    'Scope 3': '#ca8a04'  // yellow-600
  };

  const scopeIcons = {
    'Scope 1': Factory,
    'Scope 2': Zap,
    'Scope 3': Truck
  };

  const getScopeDescription = (scope: string) => {
    switch (scope) {
      case 'Scope 1':
        return 'Direct emissions from owned sources';
      case 'Scope 2':
        return 'Indirect emissions from purchased energy';
      case 'Scope 3':
        return 'All other indirect emissions';
      default:
        return '';
    }
  };

  // Prepare pie chart data
  const pieData = Object.entries(carbonData?.scopeBreakdown || {}).map(([scope, data]) => ({
    name: scope,
    value: data.total,
    color: scopeColors[scope as keyof typeof scopeColors]
  }));

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-green-50/50 to-emerald-50/50 border-0 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50/50 to-emerald-50/50 border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Leaf className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-foreground">Carbon Footprint</h3>
        </div>
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          <TrendingDown className="h-3 w-3 mr-1" />
          -12% vs last year
        </Badge>
      </div>

      {/* Total Emissions Summary */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-700 mb-1">
            {(carbonData?.totalEmissions || 0).toLocaleString()}
          </div>
          <div className="text-sm text-green-600">tCO₂e Total Emissions</div>
        </div>
      </div>

      <Tabs defaultValue="breakdown" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100">
          <TabsTrigger 
            value="breakdown"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
          >
            Scope Breakdown
          </TabsTrigger>
          <TabsTrigger 
            value="timeline"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
          >
            Monthly Trend
          </TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tCO₂e`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Scope Details */}
            <div className="space-y-4">
              {Object.entries(carbonData?.scopeBreakdown || {}).map(([scope, data]) => {
                const IconComponent = scopeIcons[scope as keyof typeof scopeIcons];
                const color = scopeColors[scope as keyof typeof scopeColors];
                
                return (
                  <div key={scope} className="p-3 rounded-lg border bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4" style={{ color }} />
                        <span className="font-medium text-sm">{scope}</span>
                      </div>
                      <span className="font-bold text-sm" style={{ color }}>
                        {data.total.toLocaleString()} tCO₂e
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {getScopeDescription(scope)}
                    </p>
                    <div className="mt-2 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(data.total / (carbonData?.totalEmissions || 1)) * 100}%`,
                          backgroundColor: color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={carbonData?.monthlyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  formatter={(value) => [`${value} tCO₂e`, 'Emissions']}
                  labelStyle={{ color: '#1f2937' }}
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="emissions" 
                  fill="url(#carbonGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Items */}
      <div className="mt-6 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <p className="text-xs text-blue-700 font-medium mb-1">Carbon Reduction Opportunities</p>
        <p className="text-xs text-blue-600">
          Focus on Scope 2 emissions reduction through renewable energy procurement and energy efficiency improvements.
        </p>
      </div>
    </Card>
  );
};

export default CarbonFootprintCard;