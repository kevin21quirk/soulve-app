import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Calendar, Users, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getInitiatives, getInitiativeStatus, type ESGInitiative } from '@/services/esgInitiativeService';
import { formatDistanceToNow } from 'date-fns';
import InitiativeWizardDialog from './InitiativeWizardDialog';

interface InitiativeManagementPanelProps {
  organizationId: string;
}

const InitiativeManagementPanel = ({ organizationId }: InitiativeManagementPanelProps) => {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedInitiative, setSelectedInitiative] = useState<ESGInitiative | null>(null);

  const { data: initiatives, isLoading } = useQuery({
    queryKey: ['esg-initiatives', organizationId],
    queryFn: () => getInitiatives(organizationId),
    enabled: !!organizationId
  });

  const getStatusColor = (status: ReturnType<typeof getInitiativeStatus>) => {
    switch (status) {
      case 'on_track':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'at_risk':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: ReturnType<typeof getInitiativeStatus>) => {
    switch (status) {
      case 'on_track':
        return 'On Track';
      case 'at_risk':
        return 'At Risk';
      case 'overdue':
        return 'Overdue';
      default:
        return 'Unknown';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
              ESG Initiatives
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your ESG reporting initiatives and track progress
            </p>
          </div>
          <Button
            onClick={() => setWizardOpen(true)}
            className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Initiative
          </Button>
        </div>

        {/* Initiative Cards Grid */}
        {initiatives && initiatives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initiatives.map(initiative => {
              const status = getInitiativeStatus(initiative);
              return (
                <Card
                  key={initiative.id}
                  className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedInitiative(initiative)}
                >
                  {/* Initiative Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {initiative.initiative_name}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {initiative.initiative_type}
                      </Badge>
                    </div>
                    <Badge variant="outline" className={getStatusColor(status)}>
                      {getStatusLabel(status)}
                    </Badge>
                  </div>

                  {/* Description */}
                  {initiative.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {initiative.description}
                    </p>
                  )}

                  {/* Progress Ring */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className={`text-sm font-bold ${getProgressColor(initiative.progress_percentage)}`}>
                        {initiative.progress_percentage}%
                      </span>
                    </div>
                    <Progress value={initiative.progress_percentage} className="h-2" />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {initiative.due_date 
                          ? `Due ${formatDistanceToNow(new Date(initiative.due_date), { addSuffix: true })}`
                          : 'No deadline'
                        }
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {initiative.target_stakeholder_groups?.length || 0} groups
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInitiative(initiative);
                      }}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    {initiative.progress_percentage === 100 && (
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Generate report logic
                        }}
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Generate Report
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Initiatives Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first ESG initiative to start collecting stakeholder data
            </p>
            <Button
              onClick={() => setWizardOpen(true)}
              className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Initiative
            </Button>
          </div>
        )}
      </Card>

      <InitiativeWizardDialog
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        organizationId={organizationId}
      />
    </>
  );
};

export default InitiativeManagementPanel;
