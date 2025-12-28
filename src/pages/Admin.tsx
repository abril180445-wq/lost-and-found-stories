import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Sparkles, 
  Save, 
  ArrowLeft,
  FileText,
  Eye,
  EyeOff,
  Image,
  Loader2
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  category: string | null;
  author: string | null;
  published: boolean | null;
  created_at: string;
  updated_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading, signOut } = useAdmin();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [aiTopic, setAiTopic] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    category: 'Motion Design',
    author: 'Rorschach Motion',
    published: true
  });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/admin/login');
    } else if (!isLoading && user && !isAdmin) {
      toast.error('Acesso negado. Você não é administrador.');
      signOut();
      navigate('/admin/login');
    }
  }, [user, isAdmin, isLoading, navigate, signOut]);

  useEffect(() => {
    if (isAdmin) {
      fetchPosts();
    }
  }, [isAdmin]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Erro ao carregar posts');
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const generateWithAI = async (type: 'full' | 'title' | 'excerpt') => {
    if (!aiTopic.trim()) {
      toast.error('Digite um tópico para gerar conteúdo');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-blog-content', {
        body: { topic: aiTopic, type }
      });

      if (error) throw error;

      if (type === 'full') {
        // Extract title from markdown (first # heading)
        const titleMatch = data.content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : aiTopic;
        
        setFormData(prev => ({
          ...prev,
          title,
          slug: generateSlug(title),
          content: data.content
        }));
        toast.success('Artigo completo gerado!');
      } else if (type === 'title') {
        const titles = data.content.split('\n').filter((t: string) => t.trim());
        if (titles.length > 0) {
          setFormData(prev => ({
            ...prev,
            title: titles[0].replace(/^\d+\.\s*/, ''),
            slug: generateSlug(titles[0])
          }));
          toast.success('Título gerado! Sugestões: ' + titles.join(' | '));
        }
      } else if (type === 'excerpt') {
        setFormData(prev => ({
          ...prev,
          excerpt: data.content
        }));
        toast.success('Resumo gerado!');
      }
    } catch (error: any) {
      console.error('AI generation error:', error);
      toast.error(error.message || 'Erro ao gerar conteúdo');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async () => {
    if (!aiTopic.trim() && !formData.title.trim()) {
      toast.error('Digite um tópico ou título para gerar a imagem');
      return;
    }

    const topic = aiTopic.trim() || formData.title;
    const slug = formData.slug || generateSlug(topic);

    setIsGeneratingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-blog-image', {
        body: { topic, slug }
      });

      if (error) throw error;

      if (data.imageUrl) {
        setFormData(prev => ({
          ...prev,
          image_url: data.imageUrl
        }));
        toast.success('Imagem gerada com sucesso!');
      }
    } catch (error: any) {
      console.error('Image generation error:', error);
      toast.error(error.message || 'Erro ao gerar imagem');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.slug.trim()) {
      toast.error('Título e slug são obrigatórios');
      return;
    }

    try {
      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(formData)
          .eq('id', editingPost.id);

        if (error) throw error;
        toast.success('Post atualizado!');
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([formData]);

        if (error) throw error;
        toast.success('Post criado!');
      }

      resetForm();
      fetchPosts();
    } catch (error: any) {
      console.error('Save error:', error);
      if (error.code === '23505') {
        toast.error('Já existe um post com este slug');
      } else {
        toast.error('Erro ao salvar post');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Post excluído!');
      fetchPosts();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Erro ao excluir post');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      image_url: post.image_url || '',
      category: post.category || 'Motion Design',
      author: post.author || 'Rorschach Motion',
      published: post.published || false
    });
    setIsCreating(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image_url: '',
      category: 'Motion Design',
      author: 'Rorschach Motion',
      published: true
    });
    setEditingPost(null);
    setIsCreating(false);
    setAiTopic('');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
            <span className="text-sm text-muted-foreground">{user?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Site
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!isCreating ? (
          <>
            {/* Posts List */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Posts do Blog</h2>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" /> Novo Post
              </Button>
            </div>

            {isLoadingPosts ? (
              <div className="text-center py-12 text-muted-foreground">Carregando...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Nenhum post encontrado</p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Criar primeiro post
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {posts.map(post => (
                  <div 
                    key={post.id} 
                    className="bg-card border border-border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{post.title}</h3>
                        {post.published ? (
                          <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded">
                            Publicado
                          </span>
                        ) : (
                          <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded">
                            Rascunho
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{post.excerpt}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {post.category} • {new Date(post.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(post)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Create/Edit Form */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">
                {editingPost ? 'Editar Post' : 'Novo Post'}
              </h2>
              <Button variant="ghost" onClick={resetForm}>
                ← Voltar para lista
              </Button>
            </div>

            {/* AI Generation Section */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Gerar com IA</h3>
              </div>
              <div className="flex gap-4 mb-4">
                <Input
                  placeholder="Digite o tópico do artigo (ex: Tendências de Motion Design 2025)"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  variant="secondary" 
                  onClick={() => generateWithAI('title')}
                  disabled={isGenerating}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar Título
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => generateWithAI('excerpt')}
                  disabled={isGenerating}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar Resumo
                </Button>
                <Button 
                  onClick={() => generateWithAI('full')}
                  disabled={isGenerating}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Gerando...' : 'Gerar Artigo Completo'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={generateImage}
                  disabled={isGeneratingImage}
                >
                  {isGeneratingImage ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Image className="w-4 h-4 mr-2" />
                  )}
                  {isGeneratingImage ? 'Gerando Imagem...' : 'Gerar Imagem'}
                </Button>
              </div>
              
              {/* Image Preview */}
              {formData.image_url && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Imagem gerada:</p>
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="max-w-md rounded-lg border border-border"
                  />
                </div>
              )}
            </div>

            {/* Post Form */}
            <div className="grid gap-6 max-w-4xl">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        title: e.target.value,
                        slug: generateSlug(e.target.value)
                      }));
                    }}
                    placeholder="Título do artigo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="titulo-do-artigo"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Resumo</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Breve descrição do artigo"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo (Markdown)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Conteúdo completo do artigo em Markdown..."
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image_url">URL da Imagem</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Motion Design"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Autor</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Nome do autor"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                />
                <Label htmlFor="published" className="flex items-center gap-2">
                  {formData.published ? (
                    <>
                      <Eye className="w-4 h-4" /> Publicado
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4" /> Rascunho
                    </>
                  )}
                </Label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingPost ? 'Atualizar Post' : 'Criar Post'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
