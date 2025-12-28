import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  image_url: string | null;
  category: string | null;
  author: string | null;
  created_at: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .maybeSingle();

        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">Post não encontrado</h1>
        <Link to="/#blog">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      {post.image_url && (
        <div className="w-full h-64 md:h-96 relative overflow-hidden">
          <img 
            src={post.image_url} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      )}

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link to="/#blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Blog
        </Link>

        {/* Post Header */}
        <header className="mb-8">
          {post.category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Tag className="w-3 h-3" />
              {post.category}
            </span>
          )}
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author || 'Rorschach Motion'}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(post.created_at)}
            </span>
          </div>
        </header>

        {/* Post Content */}
        <div className="prose prose-lg prose-invert max-w-none">
          {post.content?.split('\n').map((paragraph, index) => {
            // Handle markdown headings
            if (paragraph.startsWith('# ')) {
              return <h1 key={index} className="text-3xl font-bold text-foreground mt-8 mb-4">{paragraph.slice(2)}</h1>;
            }
            if (paragraph.startsWith('## ')) {
              return <h2 key={index} className="text-2xl font-bold text-foreground mt-6 mb-3">{paragraph.slice(3)}</h2>;
            }
            if (paragraph.startsWith('### ')) {
              return <h3 key={index} className="text-xl font-bold text-foreground mt-4 mb-2">{paragraph.slice(4)}</h3>;
            }
            // Handle list items
            if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
              return <li key={index} className="text-muted-foreground ml-4">{paragraph.slice(2)}</li>;
            }
            // Handle numbered lists
            if (/^\d+\.\s/.test(paragraph)) {
              return <li key={index} className="text-muted-foreground ml-4 list-decimal">{paragraph.replace(/^\d+\.\s/, '')}</li>;
            }
            // Handle bold text
            if (paragraph.includes('**')) {
              const parts = paragraph.split(/\*\*(.*?)\*\*/g);
              return (
                <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
                  {parts.map((part, i) => 
                    i % 2 === 1 ? <strong key={i} className="text-foreground font-semibold">{part}</strong> : part
                  )}
                </p>
              );
            }
            // Regular paragraphs
            if (paragraph.trim()) {
              return <p key={index} className="text-muted-foreground mb-4 leading-relaxed">{paragraph}</p>;
            }
            return null;
          })}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          <Link to="/#blog">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ver mais artigos
            </Button>
          </Link>
        </footer>
      </article>
    </div>
  );
};

export default BlogPost;
