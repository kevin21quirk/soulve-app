import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Building,
  Filter,
  Search,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyESGState } from "@/components/ui/empty-esg-state";
import { format } from "date-fns";

const AdminESGReports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Fetch all ESG reports across all organizations (admin view)
  const { data: reports, isLoading } = useQuery({
    queryKey: ["admin-esg-reports", statusFilter, dateFilter],
    queryFn: async () => {
      let query = supabase
        .from("esg_reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      if (dateFilter !== "all") {
        const now = new Date();
        let startDate = new Date();
        
        switch (dateFilter) {
          case "week":
            startDate.setDate(now.getDate() - 7);
            break;
          case "month":
            startDate.setMonth(now.getMonth() - 1);
            break;
          case "quarter":
            startDate.setMonth(now.getMonth() - 3);
            break;
          case "year":
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        query = query.gte("created_at", startDate.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch organizations separately
      const organizationIds = [...new Set(data?.map(r => r.organization_id).filter(Boolean))];
      const { data: orgs } = await supabase
        .from('organizations')
        .select('id, name, avatar_url')
        .in('id', organizationIds);

      // Map organizations to reports
      const reportsWithOrgs = data?.map(report => ({
        ...report,
        organization: orgs?.find(o => o.id === report.organization_id)
      }));

      return reportsWithOrgs;
    },
  });

  // Calculate summary statistics
  const stats = {
    total: reports?.length || 0,
    draft: reports?.filter(r => r.status === "draft").length || 0,
    approved: reports?.filter(r => r.status === "approved").length || 0,
    published: reports?.filter(r => r.status === "published").length || 0,
    organizations: new Set(reports?.map(r => r.organization_id)).size || 0,
  };

  // Filter reports by search term
  const filteredReports = reports?.filter(report =>
    report.report_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.organization?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "published":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleDownload = async (report: any) => {
    if (report.pdf_url) {
      const { data } = await supabase.storage
        .from("esg-reports")
        .createSignedUrl(report.pdf_url, 60);
      
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } else if (report.generated_content) {
      const blob = new Blob([report.generated_content], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.report_name}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading ESG reports..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ESG Reports Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Centralized view of all organization ESG reports
          </p>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold">{stats.draft}</p>
              <p className="text-sm text-muted-foreground">Draft</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{stats.approved}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{stats.published}</p>
              <p className="text-sm text-muted-foreground">Published</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Building className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold">{stats.organizations}</p>
              <p className="text-sm text-muted-foreground">Organizations</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports or organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Reports List */}
      {filteredReports && filteredReports.length > 0 ? (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{report.report_name}</h3>
                    <Badge variant="outline" className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                    <Badge variant="outline">
                      {report.report_type}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mt-4">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span>{report.organization?.name || "Unknown Org"}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {report.reporting_period_start && report.reporting_period_end
                          ? `${format(new Date(report.reporting_period_start), "MMM yyyy")} - ${format(new Date(report.reporting_period_end), "MMM yyyy")}`
                          : "No period set"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>
                        Created {format(new Date(report.created_at), "MMM d, yyyy")}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>{report.download_count || 0} downloads</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(report)}
                    disabled={!report.generated_content && !report.pdf_url}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Open report preview in new tab
                      if (report.generated_content) {
                        const blob = new Blob([report.generated_content], { type: "text/html" });
                        const url = window.URL.createObjectURL(blob);
                        window.open(url, "_blank");
                      }
                    }}
                    disabled={!report.generated_content}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyESGState
          icon={FileText}
          title="No ESG Reports Found"
          description="No reports match your current filters. Try adjusting your search criteria."
        />
      )}
    </div>
  );
};

export default AdminESGReports;