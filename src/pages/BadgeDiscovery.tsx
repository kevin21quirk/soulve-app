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
import { Search, Award, Users, Calendar, Sparkles } from "lucide-react";
import HomeHeader from "@/components/HomeHeader";
import Footer from "@/components/Footer";

const BadgeDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [rarityFilter, setRarityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data: badges, isLoading } = useQuery({
    queryKey: ['public-badges', rarityFilter, categoryFilter, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('badges')
        .select('*, badge_award_log(count)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (rarityFilter !== 'all') {
        query = query.eq('rarity', rarityFilter);
      }

      if (categoryFilter !== 'all') {
        query = query.eq('badge_category', categoryFilter);
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Badges", href: "/badges" },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-amber-500 to-orange-600';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-600';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-600';
      case 'uncommon': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-600';
    }
  };

  return (
    <>
      <SEOHead
        title="Badge Discovery - Earn Recognition for Social Impact"
        description="Explore achievement badges available on SouLVE. Earn recognition for your social impact contributions, from common achievements to legendary limited editions."
        keywords={['badges', 'achievements', 'recognition', 'rewards', 'social impact', 'gamification']}
        url="https://join-soulve.com/badges"
      />
      
      <StructuredData
        type="Organization"
        data={{
          name: "SouLVE Badges",
          description: "Achievement badges for social impact",
          url: "https://join-soulve.com/badges",
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
                <Award className="h-10 w-10 text-primary" />
                <h1 className="text-4xl font-bold">Badge Discovery</h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Earn recognition for your social impact contributions. From common achievements to legendary limited editions.
              </p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search badges..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={rarityFilter} onValueChange={setRarityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Rarity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rarities</SelectItem>
                  <SelectItem value="common">Common</SelectItem>
                  <SelectItem value="uncommon">Uncommon</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                  <SelectItem value="legendary">Legendary</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                  <SelectItem value="milestone">Milestone</SelectItem>
                  <SelectItem value="special">Special Event</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Badge Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-40 bg-muted" />
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-full" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {badges?.map((badge) => (
                  <Card key={badge.id} className="group hover:shadow-xl transition-all duration-300">
                    <div className={`h-40 ${getRarityColor(badge.rarity)} flex items-center justify-center relative overflow-hidden`}>
                      <div className="text-8xl opacity-90 group-hover:scale-110 transition-transform">
                        {badge.icon}
                      </div>
                      {badge.limited_edition && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-white/90">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Limited
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="capitalize">
                          {badge.rarity}
                        </Badge>
                        <Badge variant="secondary">{badge.badge_category}</Badge>
                      </div>
                      <CardTitle className="line-clamp-1">{badge.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {badge.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-2" />
                          {badge.current_award_count || 0} earned
                          {badge.max_awards && ` / ${badge.max_awards} max`}
                        </div>

                        {badge.availability_window_start && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            {badge.availability_window_end
                              ? `Available until ${new Date(badge.availability_window_end).toLocaleDateString()}`
                              : `Available from ${new Date(badge.availability_window_start).toLocaleDateString()}`
                            }
                          </div>
                        )}

                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">
                            <strong>How to earn:</strong> {badge.requirement_type === 'points' 
                              ? `Earn ${badge.requirement_value} impact points`
                              : badge.requirement_type === 'help_count'
                              ? `Complete ${badge.requirement_value} help requests`
                              : badge.requirement_type === 'volunteer_hours'
                              ? `Volunteer ${badge.requirement_value} hours`
                              : badge.requirement_type === 'donation_amount'
                              ? `Donate £${badge.requirement_value}`
                              : 'Special requirements'
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {badges && badges.length === 0 && (
              <div className="text-center py-12">
                <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No badges found</h3>
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

export default BadgeDiscovery;
