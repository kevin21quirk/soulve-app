import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          blog_categories (
            name,
            slug
          )
        `)
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <Helmet>
        <title>SouLVE Blog - Community Stories, Platform Updates & Social Impact News</title>
        <meta 
          name="description" 
          content="Read the latest stories from the SouLVE community, platform updates, social impact insights, and tips for making meaningful connections." 
        />
        <meta property="og:title" content="SouLVE Blog - Community Stories & Updates" />
        <link rel="canonical" href="https://join-soulve.com/blog" />
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Back Link */}
        <div className="container mx-auto px-4 pt-8">
          <Link to="/" className="inline-flex items-center text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              SouLVE Blog & News
            </h1>
            <p className="text-xl text-teal-100">
              Stories, insights, and updates from our community-driven platform.
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-lg" />
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-6 bg-muted rounded" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded w-5/6" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`}>
                    <Card className="hover:shadow-lg transition-shadow h-full">
                      {post.featured_image && (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          {post.blog_categories && (
                            <span className="text-primary font-medium">
                              {post.blog_categories.name}
                            </span>
                          )}
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{post.read_time || 5} min read</span>
                          </div>
                        </div>
                        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                        <CardDescription className="line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {post.published_at && format(new Date(post.published_at), "MMM d, yyyy")}
                          </span>
                          <span className="text-primary flex items-center gap-1 font-medium">
                            Read more <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-2xl font-semibold mb-4">Coming Soon!</h3>
                <p className="text-muted-foreground text-lg">
                  We're working on exciting content for you. Check back soon for community stories, 
                  platform updates, and insights on building better communities.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default Blog;
