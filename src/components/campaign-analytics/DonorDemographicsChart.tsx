
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Users, Globe, Smartphone } from "lucide-react";

interface DonorDemographicsChartProps {
  donations: Array<{
    id: string;
    amount: number;
    donationType: string;
    deviceType: string;
    locationCountry: string;
    locationCity: string;
    isAnonymous: boolean;
    createdAt: string;
  }>;
}

const COLORS = ['#0ce4af', '#18a5fe', '#4c3dfb', '#ff6b6b', '#ffd93d', '#6bcf7f'];

const DonorDemographicsChart = ({ donations }: DonorDemographicsChartProps) => {
  // Process donation types
  const donationTypes = React.useMemo(() => {
    const types: Record<string, number> = {};
    donations.forEach(donation => {
      types[donation.donationType] = (types[donation.donationType] || 0) + 1;
    });
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [donations]);

  // Process device types
  const deviceTypes = React.useMemo(() => {
    const devices: Record<string, number> = {};
    donations.forEach(donation => {
      const device = donation.deviceType || 'unknown';
      devices[device] = (devices[device] || 0) + 1;
    });
    return Object.entries(devices).map(([name, value]) => ({ name, value }));
  }, [donations]);

  // Process top countries
  const topCountries = React.useMemo(() => {
    const countries: Record<string, { count: number; amount: number }> = {};
    donations.forEach(donation => {
      const country = donation.locationCountry || 'Unknown';
      if (!countries[country]) {
        countries[country] = { count: 0, amount: 0 };
      }
      countries[country].count += 1;
      countries[country].amount += donation.amount;
    });
    
    return Object.entries(countries)
      .map(([name, data]) => ({ name, count: data.count, amount: data.amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);
  }, [donations]);

  const anonymousCount = donations.filter(d => d.isAnonymous).length;
  const publicCount = donations.length - anonymousCount;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">Anonymous Donors</div>
                <div className="text-xl font-bold">{anonymousCount}</div>
                <div className="text-xs text-gray-500">
                  {((anonymousCount / donations.length) * 100).toFixed(1)}% of total
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-sm text-gray-600">Countries Reached</div>
                <div className="text-xl font-bold">{topCountries.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4 text-purple-600" />
              <div>
                <div className="text-sm text-gray-600">Mobile Donations</div>
                <div className="text-xl font-bold">
                  {deviceTypes.find(d => d.name === 'mobile')?.value || 0}
                </div>
                <div className="text-xs text-gray-500">
                  {(((deviceTypes.find(d => d.name === 'mobile')?.value || 0) / donations.length) * 100).toFixed(1)}% of total
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Donation Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={donationTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {donationTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Countries */}
      <Card>
        <CardHeader>
          <CardTitle>Top Countries by Donation Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topCountries} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => `$${value}`} />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']} />
              <Bar dataKey="amount" fill="#0ce4af" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonorDemographicsChart;
