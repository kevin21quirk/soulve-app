
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface MobileLineChartProps {
  data: Array<{
    name: string;
    value: number;
    [key: string]: any;
  }>;
  height?: number;
  color?: string;
}

const MobileLineChart = ({ data, height = 200, color = "#18a5fe" }: MobileLineChartProps) => {
  const chartConfig = {
    value: {
      label: "Value",
      color: color,
    },
  };

  return (
    <ChartContainer config={chartConfig} className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11 }}
            width={30}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default MobileLineChart;
