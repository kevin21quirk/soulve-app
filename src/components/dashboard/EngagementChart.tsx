
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Heart } from "lucide-react";

interface EngagementData {
  day: string;
  posts: number;
  likes: number;
  comments: number;
}

interface EngagementChartProps {
  data: EngagementData[];
}

const EngagementChart = React.memo(({ data }: EngagementChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="h-5 w-5" />
          <span>Weekly Engagement</span>
        </CardTitle>
        <CardDescription>Your daily activity and community interaction</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="likes" stroke="#8884d8" name="Likes" />
            <Line type="monotone" dataKey="comments" stroke="#82ca9d" name="Comments" />
            <Line type="monotone" dataKey="posts" stroke="#ffc658" name="Posts" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

EngagementChart.displayName = "EngagementChart";

export default EngagementChart;
