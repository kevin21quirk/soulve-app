import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Clock, ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
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
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const publishedDate = post.published_at ? new Date(post.published_at) : new Date();

  return (
    <>
      <Helmet>
        <title>{post.title} - SouLVE Blog</title>
        <meta name="description" content={post.meta_description || post.excerpt || post.title} />
        {post.meta_keywords && <meta name="keywords" content={post.meta_keywords.join(", ")} />}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ""} />
        {post.featured_image && <meta property="og:image" content={post.featured_image} />}
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={publishedDate.toISOString()} />
        <link rel="canonical" href={`https://join-soulve.com/blog/${post.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            image: post.featured_image,
            datePublished: publishedDate.toISOString(),
            dateModified: post.updated_at,
            author: {
              "@type": "Organization",
              name: "SouLVE",
            },
          })}
        </script>
      </Helmet>

      <article className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-muted/50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/blog">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>

            {post.blog_categories && (
              <div className="text-primary font-medium text-sm mb-4">
                {post.blog_categories.name}
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={publishedDate.toISOString()}>
                  {format(publishedDate, "MMMM d, yyyy")}
                </time>
              </div>
              {post.read_time && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.read_time} min read</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-16 px-4 sm:px-6 lg:px-8 mt-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join the SouLVE Community</h2>
            <p className="text-xl text-teal-100 mb-8">
              Start making meaningful connections and creating positive impact today.
            </p>
            <a
              href="mailto:info@join-soulve.com"
              className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
            >
              Get Started
            </a>
          </div>
        </section>
      </article>
    </>
  );
};

export default BlogPost;
