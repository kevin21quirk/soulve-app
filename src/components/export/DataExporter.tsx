import { useState } from 'react';
import { Download, FileText, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type ExportFormat = 'csv' | 'json' | 'pdf';
type DataType = 'profile' | 'activities' | 'donations' | 'campaigns' | 'all';

export const DataExporter = () => {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [dataType, setDataType] = useState<DataType>('all');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportData = async () => {
    setIsExporting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch user data based on selection
      let exportData: any = {};

      if (dataType === 'all' || dataType === 'profile') {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        exportData.profile = profile;
      }

      if (dataType === 'all' || dataType === 'activities') {
        const { data: activities } = await supabase
          .from('impact_activities')
          .select('*')
          .eq('user_id', user.id);
        exportData.activities = activities;
      }

      if (dataType === 'all' || dataType === 'donations') {
        const { data: donations } = await supabase
          .from('campaign_donations')
          .select('*')
          .eq('donor_id', user.id);
        exportData.donations = donations;
      }

      // Convert to selected format
      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === 'csv') {
        content = convertToCSV(exportData);
        filename = `soulve-data-${Date.now()}.csv`;
        mimeType = 'text/csv';
      } else if (format === 'json') {
        content = JSON.stringify(exportData, null, 2);
        filename = `soulve-data-${Date.now()}.json`;
        mimeType = 'application/json';
      } else {
        // PDF export would require a library like jsPDF
        toast({
          title: 'PDF Export Not Available',
          description: 'PDF export is in development. Please use CSV or JSON format.',
        });
        return;
      }

      // Download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export Successful',
        description: `Your data has been exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export your data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const convertToCSV = (data: any): string => {
    // Simple CSV conversion - enhance as needed
    const rows: string[] = [];
    
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        const items = data[key];
        if (items.length > 0) {
          rows.push(`\n${key.toUpperCase()}`);
          const headers = Object.keys(items[0]).join(',');
          rows.push(headers);
          items.forEach((item: any) => {
            const values = Object.values(item).map(v => 
              typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v
            ).join(',');
            rows.push(values);
          });
        }
      }
    });

    return rows.join('\n');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Your Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Type</label>
            <Select value={dataType} onValueChange={(v) => setDataType(v as DataType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Data</SelectItem>
                <SelectItem value="profile">Profile Information</SelectItem>
                <SelectItem value="activities">Impact Activities</SelectItem>
                <SelectItem value="donations">Donations</SelectItem>
                <SelectItem value="campaigns">Campaigns</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Format</label>
            <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    CSV
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    JSON
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    PDF (In Development)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={exportData}
          disabled={isExporting}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export Data'}
        </Button>

        <p className="text-xs text-muted-foreground">
          Your data will be downloaded in the selected format. This includes all information associated with your account as per GDPR requirements.
        </p>
      </CardContent>
    </Card>
  );
};
