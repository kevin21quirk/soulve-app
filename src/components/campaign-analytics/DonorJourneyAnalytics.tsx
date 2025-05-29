
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { MapPin, Smartphone, Monitor, Tablet, Globe } from "lucide-react";

interface Donation {
  id: string;
  amount: number;
  currency: string;
  donationType: string;
  source: string;
  deviceType: string;
  locationCountry: string;
  locationCity: string;
  paymentStatus: string;
  isAnonymous: boolean;
  createdAt: string;
}

interface DonorJourneyAnalyticsProps {
  donations: Donation[];
}

const DonorJourneyAnalytics = ({ donations }: DonorJourneyAnalyticsProps) => {
  // Process source data
  const sourceData = donations.reduce((acc, donation) => {
    const source = donation.source || 'direct';
    const existing = acc.find(item => item.source === source);
    if (existing) {
      existing.count++;
      existing.amount += donation.amount;
    } else {
      acc.push({ source, count: 1, amount: donation.amount });
    }
    return acc;
  }, [] as Array<{ source: string; count: number; amount: number }>);

  // Process device data
  const deviceData = donations.reduce((acc, donation) => {
    const device = donation.deviceType || 'unknown';
    const existing = acc.find(item => item.device === device);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ device, count: 1 });
    }
    return acc;
  }, [] as Array<{ device: string; count: number }>);

  // Process geographic data
  const geoData = donations.reduce((acc, donation) => {
    const country = donation.locationCountry || 'Unknown';
    const existing = acc.find(item => item.country === country);
    if (existing) {
      existing.count++;
      existing.amount += donation.amount;
    } else {
      acc.push({ country, count: 1, amount: donation.amount });
    }
    return acc;
  }, [] as Array<{ country: string; count: number; amount: number }>)
  .sort((a, b) => b.amount - a.amount)
  .slice(0, 10);

  const deviceIcons = {
    mobile: <Smartphone className="h-4 w-4" />,
    desktop: <Monitor className="h-4 w-4" />,
    tablet: <Tablet className="h-4 w-4" />,
    unknown: <Globe className="h-4 w-4" />
  };

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Donor Journey Analytics</h3>
        <Badge variant="outline">{donations.length} total donations</Badge>
      </div>

      {/* Traffic Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Traffic Sources & Conversion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'count' ? `${value} donations` : `$${value.toLocaleString()}`,
                    name === 'count' ? 'Donations' : 'Amount'
                  ]}
                />
                <Bar dataKey="count" fill="#8884d8" name="count" />
                <Bar dataKey="amount" fill="#82ca9d" name="amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Device Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      dataKey="count"
                      nameKey="device"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {deviceData.map((item, index) => (
                  <div key={item.device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {deviceIcons[item.device as keyof typeof deviceIcons] || deviceIcons.unknown}
                      <span className="text-sm capitalize">{item.device}</span>
                    </div>
                    <Badge variant="outline">
                      {item.count} ({((item.count / donations.length) * 100).toFixed(1)}%)
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Geographic Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {geoData.map((item, index) => (
                <div key={item.country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium text-sm">{item.country}</div>
                      <div className="text-xs text-gray-500">{item.count} donations</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${item.amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      {((item.amount / donations.reduce((sum, d) => sum + d.amount, 0)) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donation Type Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Donation Types & Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['one_time', 'recurring', 'anonymous'].map(type => {
              const typeData = donations.filter(d => d.donationType === type);
              const totalAmount = typeData.reduce((sum, d) => sum + d.amount, 0);
              const avgAmount = typeData.length > 0 ? totalAmount / typeData.length : 0;

              return (
                <div key={type} className="p-4 border rounded-lg">
                  <div className="space-y-2">
                    <h4 className="font-medium capitalize">{type.replace('_', ' ')}</h4>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold">{typeData.length}</div>
                      <div className="text-sm text-gray-500">
                        ${totalAmount.toLocaleString()} total
                      </div>
                      <div className="text-xs text-gray-400">
                        ${avgAmount.toFixed(0)} avg
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonorJourneyAnalytics;
