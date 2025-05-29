
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Download, 
  FileText, 
  Calendar as CalendarIcon,
  Filter,
  BarChart3,
  Clock
} from "lucide-react";
import { format, subDays, subWeeks, subMonths } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ActivityExportProps {
  notifications: any[];
  activities: any[];
}

const ActivityExport = ({ notifications, activities }: ActivityExportProps) => {
  const { toast } = useToast();
  const [exportConfig, setExportConfig] = useState({
    format: "csv",
    dateRange: "7days",
    customDateFrom: new Date(subDays(new Date(), 7)),
    customDateTo: new Date(),
    includeNotifications: true,
    includeActivities: true,
    categories: {
      donations: true,
      campaigns: true,
      messages: true,
      social: true,
      system: true
    }
  });

  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: "csv", label: "CSV", icon: FileText },
    { value: "json", label: "JSON", icon: FileText },
    { value: "pdf", label: "PDF Report", icon: BarChart3 }
  ];

  const dateRangeOptions = [
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "3months", label: "Last 3 months" },
    { value: "custom", label: "Custom range" }
  ];

  const getDateRange = () => {
    const now = new Date();
    switch (exportConfig.dateRange) {
      case "7days":
        return { from: subDays(now, 7), to: now };
      case "30days":
        return { from: subDays(now, 30), to: now };
      case "3months":
        return { from: subMonths(now, 3), to: now };
      case "custom":
        return { from: exportConfig.customDateFrom, to: exportConfig.customDateTo };
      default:
        return { from: subDays(now, 7), to: now };
    }
  };

  const filterDataByDate = (data: any[], dateRange: { from: Date; to: Date }) => {
    return data.filter(item => {
      const itemDate = new Date(item.timestamp || item.created_at);
      return itemDate >= dateRange.from && itemDate <= dateRange.to;
    });
  };

  const filterDataByCategories = (data: any[]) => {
    return data.filter(item => {
      const category = item.type || item.category;
      return exportConfig.categories[category as keyof typeof exportConfig.categories];
    });
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]).join(',');
    const csvContent = [
      headers,
      ...data.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const generatePDFReport = async (data: any) => {
    // This would integrate with a PDF library like jsPDF
    // For now, we'll just show a message
    toast({
      title: "PDF Export",
      description: "PDF export feature coming soon!",
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const dateRange = getDateRange();
      let exportData: any = {};

      if (exportConfig.includeNotifications) {
        let filteredNotifications = filterDataByDate(notifications, dateRange);
        filteredNotifications = filterDataByCategories(filteredNotifications);
        exportData.notifications = filteredNotifications;
      }

      if (exportConfig.includeActivities) {
        let filteredActivities = filterDataByDate(activities, dateRange);
        filteredActivities = filterDataByCategories(filteredActivities);
        exportData.activities = filteredActivities;
      }

      const timestamp = format(new Date(), 'yyyy-MM-dd-HHmm');
      const filename = `activity-export-${timestamp}`;

      switch (exportConfig.format) {
        case "csv":
          if (exportData.notifications) {
            exportToCSV(exportData.notifications, `${filename}-notifications.csv`);
          }
          if (exportData.activities) {
            exportToCSV(exportData.activities, `${filename}-activities.csv`);
          }
          break;
        case "json":
          exportToJSON(exportData, `${filename}.json`);
          break;
        case "pdf":
          await generatePDFReport(exportData);
          break;
      }

      toast({
        title: "Export completed",
        description: `Data exported successfully as ${exportConfig.format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getTotalItems = () => {
    const dateRange = getDateRange();
    let total = 0;
    
    if (exportConfig.includeNotifications) {
      total += filterDataByCategories(filterDataByDate(notifications, dateRange)).length;
    }
    if (exportConfig.includeActivities) {
      total += filterDataByCategories(filterDataByDate(activities, dateRange)).length;
    }
    
    return total;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>Export Activity Data</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Format Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Export Format</label>
          <Select value={exportConfig.format} onValueChange={(value) => 
            setExportConfig(prev => ({ ...prev, format: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {formatOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center space-x-2">
                    <option.icon className="h-4 w-4" />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div>
          <label className="text-sm font-medium mb-2 block">Date Range</label>
          <Select value={exportConfig.dateRange} onValueChange={(value) => 
            setExportConfig(prev => ({ ...prev, dateRange: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dateRangeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {exportConfig.dateRange === "custom" && (
            <div className="flex space-x-2 mt-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {format(exportConfig.customDateFrom, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={exportConfig.customDateFrom}
                    onSelect={(date) => date && setExportConfig(prev => ({ 
                      ...prev, 
                      customDateFrom: date 
                    }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {format(exportConfig.customDateTo, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={exportConfig.customDateTo}
                    onSelect={(date) => date && setExportConfig(prev => ({ 
                      ...prev, 
                      customDateTo: date 
                    }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Data Types */}
        <div>
          <label className="text-sm font-medium mb-2 block">Include Data</label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={exportConfig.includeNotifications}
                onCheckedChange={(checked) => 
                  setExportConfig(prev => ({ ...prev, includeNotifications: !!checked }))
                }
              />
              <label className="text-sm">Notifications</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={exportConfig.includeActivities}
                onCheckedChange={(checked) => 
                  setExportConfig(prev => ({ ...prev, includeActivities: !!checked }))
                }
              />
              <label className="text-sm">Activity Feed</label>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="text-sm font-medium mb-2 block">Categories</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(exportConfig.categories).map(([category, enabled]) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  checked={enabled}
                  onCheckedChange={(checked) => 
                    setExportConfig(prev => ({
                      ...prev,
                      categories: { ...prev.categories, [category]: !!checked }
                    }))
                  }
                />
                <label className="text-sm capitalize">{category}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span>Items to export:</span>
            <Badge variant="secondary">{getTotalItems()}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span>Date range:</span>
            <span className="text-gray-600">
              {format(getDateRange().from, "MMM d")} - {format(getDateRange().to, "MMM d")}
            </span>
          </div>
        </div>

        {/* Export Button */}
        <Button 
          onClick={handleExport} 
          disabled={isExporting || getTotalItems() === 0}
          className="w-full"
        >
          {isExporting ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActivityExport;
