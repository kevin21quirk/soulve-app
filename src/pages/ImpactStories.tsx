import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/seo/SEOHead";
import StructuredData from "@/components/seo/StructuredData";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Heart, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import HomeHeader from "@/components/HomeHeader";
import Footer from "@/components/Footer";

const ImpactStories = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: stories, isLoading } = useQuery({
    queryKey: ['impact-stories', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_author_id_fkey(
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('category', 'success_story')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(20);

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
    { label: "Impact Stories", href: "/stories" },
  ];

  return (
    <>
      <SEOHead
        title="Impact Stories - Real Stories of Social Change"
        description="Read inspiring stories of social impact, community help, and lives changed. Discover how SouLVE members are making a difference in their communities."
        keywords={['impact stories', 'success stories', 'testimonials', 'social change', 'community impact', 'helping others']}
        url="https://join-soulve.com/stories"
      />
      
      <StructuredData
        type="Organization"
        data={{
          name: "SouLVE Impact Stories",
          description: "Real stories of social impact and community change",
          url: "https://join-soulve.com/stories",
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
                <Heart className="h-10 w-10 text-primary" />
                <h1 className="text-4xl font-bold">Impact Stories</h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Real stories of social impact, community help, and lives changed
              </p>
            </div>

            {/* Search */}
            <div className="max-w-xl mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Stories Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-full" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stories?.map((story) => {
                  const profile = Array.isArray(story.profiles) ? story.profiles[0] : story.profiles;
                  const authorName = profile 
                    ? `${profile.first_name} ${profile.last_name}`.trim() 
                    : 'Anonymous';

                  return (
                    <Card key={story.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar>
                            <AvatarImage src={profile?.avatar_url || undefined} />
                            <AvatarFallback>
                              {authorName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold line-clamp-1">{authorName}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(story.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <CardTitle className="line-clamp-2">{story.title}</CardTitle>
                        <CardDescription className="line-clamp-3">
                          {story.content?.substring(0, 150) || 'No description available'}
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        {story.tags && story.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {story.tags.slice(0, 4).map((tag, idx) => (
                              <Badge key={idx} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <Link 
                          to={`/profile/${story.author_id}`}
                          className="text-sm text-primary hover:underline mt-4 inline-block"
                        >
                          Read more →
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {stories && stories.length === 0 && (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No stories found</h3>
                <p className="text-muted-foreground">
                  Be the first to share your impact story!
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

export default ImpactStories;
