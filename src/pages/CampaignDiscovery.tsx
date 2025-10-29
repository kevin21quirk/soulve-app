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
import { Progress } from "@/components/ui/progress";
import { Search, MapPin, Calendar, Target, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import HomeHeader from "@/components/HomeHeader";
import Footer from "@/components/Footer";

const CampaignDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['public-campaigns', categoryFilter, urgencyFilter, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      if (urgencyFilter !== 'all') {
        query = query.eq('urgency', urgencyFilter);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Campaigns", href: "/campaigns" },
  ];

  return (
    <>
      <SEOHead
        title="Discover Campaigns - Support Social Impact Projects"
        description="Browse and support active fundraising campaigns making real social impact. Find causes you care about in health, education, environment, and more."
        keywords={['campaigns', 'fundraising', 'social impact', 'charity', 'donations', 'causes', 'support']}
        url="https://join-soulve.com/campaigns"
      />
      
      <StructuredData
        type="Organization"
        data={{
          name: "SouLVE Campaigns",
          description: "Discover and support social impact campaigns",
          url: "https://join-soulve.com/campaigns",
          logo: "https://join-soulve.com/og-image.png",
        }}
      />

      <div className="min-h-screen flex flex-col">
        <HomeHeader />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
            <div className="container mx-auto px-4">
              <Link to="/" className="inline-flex items-center text-white hover:text-teal-200 mb-6 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
              <h1 className="text-4xl font-bold mb-2">Discover Campaigns</h1>
              <p className="text-teal-100 text-lg">
                Support active campaigns making real social impact in communities worldwide
              </p>
            </div>
          </section>

          <div className="container mx-auto px-4 py-8">
            <BreadcrumbNav items={breadcrumbItems} />

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 mt-6">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="health">Health & Wellness</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="emergency">Emergency Relief</SelectItem>
                </SelectContent>
              </Select>

              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campaign Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted" />
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-full" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns?.map((campaign) => {
                  const progress = campaign.goal_amount
                    ? (campaign.current_amount / campaign.goal_amount) * 100
                    : 0;

                  return (
                    <Link key={campaign.id} to={`/campaigns/${campaign.id}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        {campaign.featured_image && (
                          <div className="h-48 overflow-hidden">
                            <img
                              src={campaign.featured_image}
                              alt={campaign.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Badge variant="secondary">{campaign.category}</Badge>
                            {campaign.urgency === 'urgent' && (
                              <Badge variant="destructive">Urgent</Badge>
                            )}
                          </div>
                          <CardTitle className="line-clamp-2">{campaign.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {campaign.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {campaign.location && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-2" />
                                {campaign.location}
                              </div>
                            )}

                            {campaign.goal_amount && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="font-semibold">
                                    £{campaign.current_amount.toLocaleString()}
                                  </span>
                                  <span className="text-muted-foreground">
                                    of £{campaign.goal_amount.toLocaleString()}
                                  </span>
                                </div>
                                <Progress value={progress} className="h-2" />
                                <p className="text-xs text-muted-foreground">
                                  {Math.round(progress)}% funded
                                </p>
                              </div>
                            )}

                            {campaign.end_date && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-2" />
                                Ends {new Date(campaign.end_date).toLocaleDateString()}
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

            {campaigns && campaigns.length === 0 && (
              <div className="text-center py-12">
                <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No campaigns found</h3>
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

export default CampaignDiscovery;
