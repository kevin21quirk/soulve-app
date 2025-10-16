import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  TrendingUp, 
  Users, 
  Building2, 
  Download,
  BarChart3
} from "lucide-react";

interface MaterialityItem {
  id: string;
  name: string;
  stakeholderImportance: number;
  businessImpact: number;
  category: 'environmental' | 'social' | 'governance';
}

const MaterialityAssessmentMatrix = () => {
  const [selectedItem, setSelectedItem] = useState<MaterialityItem | null>(null);

  // TODO: Fetch real materiality assessments from database
  // For now, using empty array until data is available
  const materialityItems: MaterialityItem[] = [];

  if (materialityItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Materiality Assessments</h3>
          <p className="text-muted-foreground max-w-md">
            Create your first materiality assessment to identify key ESG topics for your organization
          </p>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'environmental': return 'from-green-500 to-emerald-500';
      case 'social': return 'from-blue-500 to-cyan-500';
      case 'governance': return 'from-purple-500 to-violet-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'environmental': return Target;
      case 'social': return Users;
      case 'governance': return Building2;
      default: return BarChart3;
    }
  };

  const getPriorityLevel = (stakeholder: number, business: number) => {
    const average = (stakeholder + business) / 2;
    if (average >= 80) return { level: 'High', color: 'bg-red-100 text-red-800 border-red-200' };
    if (average >= 60) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    return { level: 'Low', color: 'bg-green-100 text-green-800 border-green-200' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Materiality Assessment Matrix
          </h2>
          <p className="text-muted-foreground mt-1">
            Map stakeholder importance vs business impact for ESG topics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Matrix
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Matrix Visualization */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="relative w-full h-96 border-2 border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-white">
              {/* Axis Labels */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-600">
                Business Impact
              </div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-600">
                Stakeholder Importance
              </div>

              {/* Quadrant Labels */}
              <div className="absolute top-2 left-2 text-xs text-gray-500 font-medium">High/Low</div>
              <div className="absolute top-2 right-2 text-xs text-gray-500 font-medium">High/High</div>
              <div className="absolute bottom-2 left-2 text-xs text-gray-500 font-medium">Low/Low</div>
              <div className="absolute bottom-2 right-2 text-xs text-gray-500 font-medium">Low/High</div>

              {/* Grid Lines */}
              <div className="absolute inset-0 flex">
                <div className="w-1/2 h-full border-r border-gray-300 border-dashed"></div>
                <div className="w-1/2 h-full"></div>
              </div>
              <div className="absolute inset-0 flex flex-col">
                <div className="w-full h-1/2 border-b border-gray-300 border-dashed"></div>
                <div className="w-full h-1/2"></div>
              </div>

              {/* Data Points */}
              {materialityItems.map((item) => {
                const x = (item.businessImpact / 100) * 100;
                const y = 100 - (item.stakeholderImportance / 100) * 100;
                const CategoryIcon = getCategoryIcon(item.category);
                
                return (
                  <div
                    key={item.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                      selectedItem?.id === item.id ? 'scale-125' : 'hover:scale-110'
                    } transition-transform duration-200`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getCategoryColor(item.category)} 
                      flex items-center justify-center shadow-lg border-2 border-white`}>
                      <CategoryIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Item Details & Legend */}
        <div className="space-y-6">
          {/* Selected Item Details */}
          {selectedItem && (
            <Card className="p-4">
              <h3 className="font-semibold text-sm mb-3">Selected Topic</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">{selectedItem.name}</h4>
                  <Badge variant="outline" className={getPriorityLevel(selectedItem.stakeholderImportance, selectedItem.businessImpact).color}>
                    {getPriorityLevel(selectedItem.stakeholderImportance, selectedItem.businessImpact).level} Priority
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Stakeholder Importance</span>
                    <span className="font-medium">{selectedItem.stakeholderImportance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${selectedItem.stakeholderImportance}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Business Impact</span>
                    <span className="font-medium">{selectedItem.businessImpact}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${selectedItem.businessImpact}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Category Legend */}
          <Card className="p-4">
            <h3 className="font-semibold text-sm mb-3">ESG Categories</h3>
            <div className="space-y-2">
              {[
                { category: 'environmental', label: 'Environmental', icon: Target },
                { category: 'social', label: 'Social', icon: Users },
                { category: 'governance', label: 'Governance', icon: Building2 }
              ].map(({ category, label, icon: Icon }) => (
                <div key={category} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getCategoryColor(category)}`}></div>
                  <Icon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Priority Summary */}
          <Card className="p-4">
            <h3 className="font-semibold text-sm mb-3">Priority Summary</h3>
            <div className="space-y-2">
              {['High', 'Medium', 'Low'].map((priority) => {
                const count = materialityItems.filter(item => 
                  getPriorityLevel(item.stakeholderImportance, item.businessImpact).level === priority
                ).length;
                const color = priority === 'High' ? 'text-red-600' : 
                            priority === 'Medium' ? 'text-yellow-600' : 'text-green-600';
                
                return (
                  <div key={priority} className="flex justify-between items-center">
                    <span className="text-sm">{priority} Priority</span>
                    <span className={`font-medium ${color}`}>{count} topics</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MaterialityAssessmentMatrix;