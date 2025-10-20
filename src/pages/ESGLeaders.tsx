import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Award, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SEOHead from "@/components/seo/SEOHead";

export default function ESGLeaders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [frameworkFilter, setFrameworkFilter] = useState<string>("all");

  const { data: organizations, isLoading } = useQuery({
    queryKey: ["esg-leaders", searchQuery, industryFilter, frameworkFilter],
    queryFn: async () => {
      let query = supabase
        .from("organizations")
        .select(`
          id,
          name,
          avatar_url,
          organization_type,
          description,
          location,
          organization_trust_scores (
            overall_score,
            esg_score,
            transparency_score
          ),
          materiality_assessments (
            assessment_year,
            business_impact,
            stakeholder_importance
          )
        `)
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      if (industryFilter !== "all") {
        query = query.eq("organization_type", industryFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Calculate ESG scores and filter by framework if needed
      const orgsWithScores = data?.map(org => {
        const trustScore = org.organization_trust_scores?.[0];
        const assessments = org.materiality_assessments || [];
        
        // Calculate average ESG score from materiality assessments
        const avgScore = assessments.length > 0
          ? assessments.reduce((acc, a) => acc + ((a.business_impact + a.stakeholder_importance) / 2), 0) / assessments.length
          : trustScore?.esg_score || 0;

        return {
          ...org,
          esg_score: Math.round(avgScore),
          transparency_score: trustScore?.transparency_score || 0,
          overall_score: trustScore?.overall_score || 0,
        };
      }) || [];

      // Sort by ESG score
      return orgsWithScores.sort((a, b) => b.esg_score - a.esg_score);
    },
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <SEOHead
        title="ESG Leaders - Top Organizations for Social Impact"
        description="Discover organizations leading the way in Environmental, Social, and Governance performance. Compare ESG scores, transparency ratings, and trust metrics."
        keywords={[
          'ESG leaders',
          'top ESG organizations',
          'environmental social governance',
          'ESG scores',
          'sustainability leaders',
          'corporate social responsibility',
          'ESG ratings',
          'impact organizations'
        ]}
        url="https://join-soulve.com/esg-leaders"
      />
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Award className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">ESG Leaders</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Discover organizations leading the way in Environmental, Social, and Governance performance
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="col-span-1 md:col-span-3"
            />
            
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="charity">Charity</SelectItem>
                <SelectItem value="social_enterprise">Social Enterprise</SelectItem>
                <SelectItem value="cic">Community Interest Company</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>

            <Select value={frameworkFilter} onValueChange={setFrameworkFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Frameworks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frameworks</SelectItem>
                <SelectItem value="gri">GRI Standards</SelectItem>
                <SelectItem value="sasb">SASB</SelectItem>
                <SelectItem value="tcfd">TCFD</SelectItem>
                <SelectItem value="ungc">UN Global Compact</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => {
              setSearchQuery("");
              setIndustryFilter("all");
              setFrameworkFilter("all");
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations?.map((org, index) => (
            <Link key={org.id} to={`/organization/${org.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {org.avatar_url ? (
                        <img
                          src={org.avatar_url}
                          alt={org.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-1">{org.name}</h3>
                        <Badge variant="outline" className="text-xs mt-1">
                          {org.organization_type?.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    </div>
                    {index < 3 && (
                      <Badge className={getScoreBadge(org.esg_score)}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Top {index + 1}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {org.description || "No description available"}
                  </p>

                  {org.location && (
                    <p className="text-xs text-muted-foreground mb-4">📍 {org.location}</p>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">ESG Score</span>
                      <span className={`text-2xl font-bold ${getScoreColor(org.esg_score)}`}>
                        {org.esg_score}/100
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-muted p-2 rounded">
                        <div className="text-muted-foreground mb-1">Transparency</div>
                        <div className="font-semibold">{org.transparency_score}/100</div>
                      </div>
                      <div className="bg-muted p-2 rounded">
                        <div className="text-muted-foreground mb-1">Trust Score</div>
                        <div className="font-semibold">{org.overall_score}/100</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && organizations?.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No organizations found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
