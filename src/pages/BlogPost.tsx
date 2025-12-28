import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Calendar, User, Tag, Share2, Facebook, Copy, Check, MessageCircle, Linkedin, Twitter, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  const [copied, setCopied] = useState(false);

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

  // Update meta tags for social sharing
  useEffect(() => {
    if (post) {
      // Update document title
      document.title = `${post.title} | Rorschach Motion`;
      
      // Update or create meta tags
      const updateMetaTag = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.content = content;
      };

      const currentUrl = window.location.href;
      const imageUrl = post.image_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=630&fit=crop';

      // Open Graph tags for Facebook/Instagram
      updateMetaTag('og:title', post.title);
      updateMetaTag('og:description', post.excerpt || 'Leia mais no blog da Rorschach Motion');
      updateMetaTag('og:image', imageUrl);
      updateMetaTag('og:url', currentUrl);
      updateMetaTag('og:type', 'article');
      updateMetaTag('og:site_name', 'Rorschach Motion');
      
      // Twitter Card tags
      updateMetaTag('twitter:card', 'summary_large_image');
      updateMetaTag('twitter:title', post.title);
      updateMetaTag('twitter:description', post.excerpt || 'Leia mais no blog da Rorschach Motion');
      updateMetaTag('twitter:image', imageUrl);
    }

    return () => {
      document.title = 'Rorschach Motion';
    };
  }, [post]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = encodeURIComponent(post?.title || 'Confira este artigo!');
  const shareUrl = encodeURIComponent(currentUrl);

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => window.open(`https://wa.me/?text=${shareText}%20${shareUrl}`, '_blank'),
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank'),
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank'),
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      action: () => window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, '_blank'),
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700',
      action: () => window.open(`mailto:?subject=${shareText}&body=${encodeURIComponent(`${post?.excerpt || ''}\n\nLeia mais: ${currentUrl}`)}`, '_blank'),
    },
  ];

  const nativeShare = async () => {
    const shareData = {
      title: post?.title || 'Artigo do Blog',
      text: post?.excerpt || 'Confira este artigo!',
      url: currentUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Compartilhado com sucesso!');
      } else {
        await copyLink();
      }
    } catch (err) {
      console.log('Share cancelled');
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success('Link copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Erro ao copiar link');
    }
  };

  const openFacebookPage = () => {
    window.open('https://www.facebook.com/profile.php?id=61568748082795', '_blank');
  };

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

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author || 'Rorschach Motion'}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(post.created_at)}
            </span>
          </div>

          {/* Share Buttons */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Share2 className="w-4 h-4" />
              <span>Compartilhe este artigo:</span>
            </div>
            
            {/* Social Share Buttons */}
            <div className="flex flex-wrap gap-2">
              {shareOptions.map((option) => (
                <Button
                  key={option.name}
                  size="sm"
                  onClick={option.action}
                  className={`gap-2 text-white ${option.color} border-0`}
                >
                  <option.icon className="w-4 h-4" />
                  {option.name}
                </Button>
              ))}
            </div>

            {/* Copy and Native Share */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
              <Button
                variant="outline"
                size="sm"
                onClick={copyLink}
                className="gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Link Copiado!' : 'Copiar Link'}
              </Button>
              
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nativeShare}
                  className="gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Mais opções
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={openFacebookPage}
                className="gap-2 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
              >
                <Facebook className="w-4 h-4" />
                Nossa Página
              </Button>
            </div>
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
