import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  BarChart3,
  Award,
  AlertCircle,
  ExternalLink
} from "lucide-react";

interface BenchmarkData {
  id: string;
  metric: string;
  ourValue: number;
  industryAverage: number;
  topQuartile: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  percentileRank: number;
  category: 'environmental' | 'social' | 'governance';
}

const ESGBenchmarkingCard = () => {
  // Mock data - in real app, this would come from the service
  const benchmarks: BenchmarkData[] = [
    {
      id: '1',
      metric: 'Carbon Intensity',
      ourValue: 2.1,
      industryAverage: 3.2,
      topQuartile: 1.8,
      unit: 'tCO2e/M revenue',
      trend: 'down',
      percentileRank: 75,
      category: 'environmental'
    },
    {
      id: '2',
      metric: 'Employee Turnover',
      ourValue: 12,
      industryAverage: 15,
      topQuartile: 8,
      unit: '%',
      trend: 'up',
      percentileRank: 65,
      category: 'social'
    },
    {
      id: '3',
      metric: 'Board Diversity',
      ourValue: 40,
      industryAverage: 35,
      topQuartile: 50,
      unit: '%',
      trend: 'up',
      percentileRank: 60,
      category: 'governance'
    },
    {
      id: '4',
      metric: 'Energy Efficiency',
      ourValue: 85,
      industryAverage: 78,
      topQuartile: 92,
      unit: '%',
      trend: 'up',
      percentileRank: 70,
      category: 'environmental'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'environmental': return 'bg-green-100 text-green-800 border-green-200';
      case 'social': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'governance': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPerformanceColor = (ourValue: number, industryAverage: number, isHigherBetter: boolean = true) => {
    const isPerforming = isHigherBetter ? ourValue > industryAverage : ourValue < industryAverage;
    return isPerforming ? 'text-green-600' : 'text-red-600';
  };

  const getPerformanceIcon = (ourValue: number, industryAverage: number, isHigherBetter: boolean = true) => {
    const isPerforming = isHigherBetter ? ourValue > industryAverage : ourValue < industryAverage;
    return isPerforming ? TrendingUp : TrendingDown;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Target;
    }
  };

  const getPercentileRankColor = (rank: number) => {
    if (rank >= 75) return 'text-green-600';
    if (rank >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-primary" />
            ESG Benchmarking
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            Compare your performance against industry standards
          </p>
        </div>
        <Button variant="outline" size="sm">
          <ExternalLink className="h-4 w-4 mr-2" />
          View Full Report
        </Button>
      </div>

      <div className="space-y-4">
        {benchmarks.map((benchmark) => {
          const isHigherBetter = !benchmark.metric.toLowerCase().includes('intensity') && 
                                !benchmark.metric.toLowerCase().includes('turnover');
          const PerformanceIcon = getPerformanceIcon(benchmark.ourValue, benchmark.industryAverage, isHigherBetter);
          const TrendIcon = getTrendIcon(benchmark.trend);
          
          return (
            <div key={benchmark.id} className="border rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium">{benchmark.metric}</h4>
                  <Badge variant="outline" className={getCategoryColor(benchmark.category)}>
                    {benchmark.category}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <PerformanceIcon className={`h-4 w-4 ${getPerformanceColor(benchmark.ourValue, benchmark.industryAverage, isHigherBetter)}`} />
                  <TrendIcon className={`h-4 w-4 ${benchmark.trend === 'up' ? 'text-green-500' : benchmark.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
                  <div className="text-lg font-bold text-blue-700">
                    {benchmark.ourValue}{benchmark.unit}
                  </div>
                  <div className="text-xs text-blue-600">Our Value</div>
                </div>

                <div className="text-center p-2 bg-gray-50 rounded border border-gray-200">
                  <div className="text-lg font-bold text-gray-700">
                    {benchmark.industryAverage}{benchmark.unit}
                  </div>
                  <div className="text-xs text-gray-600">Industry Avg</div>
                </div>

                <div className="text-center p-2 bg-green-50 rounded border border-green-200">
                  <div className="text-lg font-bold text-green-700">
                    {benchmark.topQuartile}{benchmark.unit}
                  </div>
                  <div className="text-xs text-green-600">Top Quartile</div>
                </div>

                <div className="text-center p-2 bg-purple-50 rounded border border-purple-200">
                  <div className={`text-lg font-bold ${getPercentileRankColor(benchmark.percentileRank)}`}>
                    {benchmark.percentileRank}%
                  </div>
                  <div className="text-xs text-purple-600">Percentile</div>
                </div>
              </div>

              {/* Progress bar showing position relative to industry */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Below Average</span>
                  <span>Top Quartile</span>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${benchmark.percentileRank}%` }}
                  ></div>
                  {/* Industry average marker */}
                  <div 
                    className="absolute top-0 w-1 h-2 bg-gray-500 rounded"
                    style={{ left: '50%', transform: 'translateX(-50%)' }}
                  ></div>
                  {/* Top quartile marker */}
                  <div 
                    className="absolute top-0 w-1 h-2 bg-green-500 rounded"
                    style={{ left: '75%', transform: 'translateX(-50%)' }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-center mb-1">
              <Award className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm font-medium text-green-800">Above Average</span>
            </div>
            <div className="text-xl font-bold text-green-700">
              {benchmarks.filter(b => {
                const isHigherBetter = !b.metric.toLowerCase().includes('intensity') && !b.metric.toLowerCase().includes('turnover');
                return isHigherBetter ? b.ourValue > b.industryAverage : b.ourValue < b.industryAverage;
              }).length}
            </div>
            <div className="text-xs text-green-600">metrics</div>
          </div>

          <div className="p-3 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-yellow-600 mr-1" />
              <span className="text-sm font-medium text-yellow-800">Average Percentile</span>
            </div>
            <div className="text-xl font-bold text-yellow-700">
              {Math.round(benchmarks.reduce((sum, b) => sum + b.percentileRank, 0) / benchmarks.length)}%
            </div>
            <div className="text-xs text-yellow-600">overall</div>
          </div>

          <div className="p-3 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-center mb-1">
              <AlertCircle className="h-4 w-4 text-red-600 mr-1" />
              <span className="text-sm font-medium text-red-800">Improvement Areas</span>
            </div>
            <div className="text-xl font-bold text-red-700">
              {benchmarks.filter(b => b.percentileRank < 50).length}
            </div>
            <div className="text-xs text-red-600">metrics</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ESGBenchmarkingCard;