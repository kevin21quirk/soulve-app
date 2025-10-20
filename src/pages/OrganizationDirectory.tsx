import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/seo/SEOHead";
import StructuredData from "@/components/seo/StructuredData";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, MapPin, Shield, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import HomeHeader from "@/components/HomeHeader";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const OrganizationDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  const { data: organizations, isLoading } = useQuery({
    queryKey: ['public-organizations', typeFilter, verifiedOnly, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('organizations')
        .select(`
          *,
          organization_trust_scores(overall_score)
        `)
        .order('created_at', { ascending: false });

      if (typeFilter !== 'all') {
        query = query.eq('organization_type', typeFilter);
      }

      if (verifiedOnly) {
        query = query.eq('is_verified', true);
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,mission.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Organizations", href: "/organizations" },
  ];

  return (
    <>
      <SEOHead
        title="Organization Directory - Verified Social Impact Organizations"
        description="Discover verified charities, nonprofits, and social enterprises making real impact. Connect with organizations aligned with your values."
        keywords={['organizations', 'charities', 'nonprofits', 'social enterprises', 'NGOs', 'verified organizations']}
        url="https://join-soulve.com/organizations"
      />
      
      <StructuredData
        type="Organization"
        data={{
          name: "SouLVE Organization Directory",
          description: "Directory of verified social impact organizations",
          url: "https://join-soulve.com/organizations",
          logo: "https://join-soulve.com/og-image.png",
        }}
      />

      <div className="min-h-screen flex flex-col">
        <HomeHeader />
        
        <main className="flex-1 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 py-8">
            <BreadcrumbNav items={breadcrumbItems} />

            <div className="mt-6 mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="h-10 w-10 text-primary" />
                <h1 className="text-4xl font-bold">Organization Directory</h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Discover verified charities, nonprofits, and social enterprises making real impact
              </p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search organizations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Organization Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="nonprofit">Nonprofit</SelectItem>
                  <SelectItem value="charity">Charity</SelectItem>
                  <SelectItem value="social_enterprise">Social Enterprise</SelectItem>
                  <SelectItem value="ngo">NGO</SelectItem>
                  <SelectItem value="community_group">Community Group</SelectItem>
                </SelectContent>
              </Select>

              <Select value={verifiedOnly ? "verified" : "all"} onValueChange={(val) => setVerifiedOnly(val === "verified")}>
                <SelectTrigger>
                  <SelectValue placeholder="Verification Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organizations</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Organization Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-12 w-12 bg-muted rounded-full mb-2" />
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-full" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizations?.map((org) => {
                  const trustScore = org.organization_trust_scores?.[0]?.overall_score || 50;
                  
                  return (
                    <Link key={org.id} to={`/organization/${org.id}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={org.avatar_url || undefined} />
                              <AvatarFallback>
                                {org.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <CardTitle className="line-clamp-1">{org.name}</CardTitle>
                                {org.is_verified && (
                                  <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="secondary" className="capitalize">
                                  {org.organization_type?.replace('_', ' ')}
                                </Badge>
                                <Badge variant="outline">
                                  Trust Score: {trustScore}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <CardDescription className="line-clamp-3 mt-4">
                            {org.description || org.mission}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="space-y-2">
                            {org.location && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span className="line-clamp-1">{org.location}</span>
                              </div>
                            )}

                            {org.website && (
                              <div className="flex items-center text-sm text-muted-foreground hover:text-primary">
                                <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span className="line-clamp-1">{org.website}</span>
                              </div>
                            )}

                            {org.tags && org.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-2">
                                {org.tags.slice(0, 3).map((tag, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {org.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{org.tags.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}

            {organizations && organizations.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No organizations found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default OrganizationDirectory;
