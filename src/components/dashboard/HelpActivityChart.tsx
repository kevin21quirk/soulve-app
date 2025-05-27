
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users } from "lucide-react";

interface HelpActivityData {
  week: string;
  helped: number;
  received: number;
}

interface HelpActivityChartProps {
  data: HelpActivityData[];
}

const HelpActivityChart = React.memo(({ data }: HelpActivityChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Help Activity Trends</span>
        </CardTitle>
        <CardDescription>Your helping patterns over the last 6 weeks</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="helped" fill="#8884d8" name="People Helped" />
            <Bar dataKey="received" fill="#82ca9d" name="Help Received" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

HelpActivityChart.displayName = "HelpActivityChart";

export default HelpActivityChart;
