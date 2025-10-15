import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, TrendingUp, Users, FileCheck, Calendar, ArrowUpDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getInitiatives, getInitiativeStatus, type ESGInitiative } from '@/services/esgInitiativeService';
import { formatDistanceToNow } from 'date-fns';

interface InitiativeProgressDashboardProps {
  organizationId: string;
}

const InitiativeProgressDashboard = ({ organizationId }: InitiativeProgressDashboardProps) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'due_date'>('due_date');

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

  // Calculate hero metrics
  const activeInitiatives = initiatives?.filter(i => i.status !== 'archived').length || 0;
  const avgCollectionRate = initiatives?.length 
    ? Math.round(initiatives.reduce((sum, i) => sum + i.progress_percentage, 0) / initiatives.length)
    : 0;
  const completedInitiatives = initiatives?.filter(i => i.progress_percentage === 100).length || 0;

  // Filter and sort initiatives
  const filteredInitiatives = initiatives?.filter(initiative => {
    if (statusFilter === 'all') return true;
    const status = getInitiativeStatus(initiative);
    return status === statusFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.initiative_name.localeCompare(b.initiative_name);
      case 'progress':
        return b.progress_percentage - a.progress_percentage;
      case 'due_date':
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Initiatives</p>
              <p className="text-3xl font-bold mt-1">{activeInitiatives}</p>
            </div>
            <Target className="h-10 w-10 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Collection Rate</p>
              <p className="text-3xl font-bold mt-1">{avgCollectionRate}%</p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Stakeholders Engaged</p>
              <p className="text-3xl font-bold mt-1">
                {initiatives?.reduce((sum, i) => sum + (i.target_stakeholder_groups?.length || 0), 0) || 0}
              </p>
            </div>
            <Users className="h-10 w-10 text-purple-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-3xl font-bold mt-1">{completedInitiatives}</p>
            </div>
            <FileCheck className="h-10 w-10 text-orange-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Initiative List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
            Initiative Progress Tracking
          </h2>
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="on_track">On Track</SelectItem>
                <SelectItem value="at_risk">At Risk</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[150px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="due_date">Due Date</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredInitiatives && filteredInitiatives.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Initiative Name</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stakeholders</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInitiatives.map(initiative => {
                const status = getInitiativeStatus(initiative);
                return (
                  <TableRow key={initiative.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{initiative.initiative_name}</div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {initiative.initiative_type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[150px]">
                        <Progress value={initiative.progress_percentage} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{initiative.progress_percentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(status)}>
                        {getStatusLabel(status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {initiative.target_stakeholder_groups?.slice(0, 2).map(group => (
                          <Badge key={group} variant="secondary" className="text-xs">
                            {group}
                          </Badge>
                        ))}
                        {initiative.target_stakeholder_groups && initiative.target_stakeholder_groups.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{initiative.target_stakeholder_groups.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {initiative.due_date 
                          ? formatDistanceToNow(new Date(initiative.due_date), { addSuffix: true })
                          : 'No deadline'
                        }
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No initiatives found matching the selected filters
          </div>
        )}
      </Card>
    </div>
  );
};

export default InitiativeProgressDashboard;
