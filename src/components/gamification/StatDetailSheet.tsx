import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Info, Target, Award } from "lucide-react";

interface StatDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  icon: React.ReactNode;
  currentValue: number | string;
  unit?: string;
  color: string;
  stats?: {
    label: string;
    value: string | number;
    subValue?: string;
  }[];
  tips?: string[];
  relatedAchievements?: {
    title: string;
    progress: number;
    maxProgress: number;
  }[];
  history?: {
    label: string;
    value: number;
  }[];
}

const StatDetailSheet = ({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  icon, 
  currentValue, 
  unit,
  color,
  stats = [],
  tips = [],
  relatedAchievements = [],
  history = []
}: StatDetailSheetProps) => {
  const maxHistoryValue = history.length > 0 ? Math.max(...history.map(h => h.value), 1) : 1;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {icon}
            {title}
          </SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Current Value Display */}
          <Card className={`bg-gradient-to-br ${color}`}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-foreground">
                  {currentValue}
                  {unit && <span className="text-2xl ml-1">{unit}</span>}
                </div>
                <p className="text-primary-foreground/80 mt-2">Current {title}</p>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          {stats.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="pt-4 text-center">
                    <div className="text-xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    {stat.subValue && (
                      <p className="text-xs text-muted-foreground mt-1">{stat.subValue}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* History Chart */}
          {history.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                History
              </h3>
              <div className="flex items-end justify-between gap-1 h-24 bg-muted/30 rounded-lg p-3">
                {history.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full bg-primary rounded-t"
                      style={{ height: `${(item.value / maxHistoryValue) * 100}%`, minHeight: '4px' }}
                    />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Achievements */}
          {relatedAchievements.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Related Achievements
              </h3>
              <div className="space-y-3">
                {relatedAchievements.map((achievement, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{achievement.title}</span>
                      <Badge variant="secondary" className="text-xs">
                        {achievement.progress}/{achievement.maxProgress}
                      </Badge>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.maxProgress) * 100} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {tips.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2 mb-2">
                <Info className="h-4 w-4" />
                How to Improve
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Target className="h-3 w-3" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default StatDetailSheet;
