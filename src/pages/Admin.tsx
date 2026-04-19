import { useEffect, useState, useCallback } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Loader2,
  Facebook,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Wand2,
  Zap
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

type IntegrationLog = {
  service: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  timestamp: Date;
};

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading, signOut } = useAdmin();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isPublishingToFacebook, setIsPublishingToFacebook] = useState(false);
  const [autoPublishFacebook, setAutoPublishFacebook] = useState(true);
  const [zapierWebhookUrl, setZapierWebhookUrl] = useState(() => localStorage.getItem('zapier_webhook_url') || '');
  const [autoTriggerZapier, setAutoTriggerZapier] = useState(() => localStorage.getItem('zapier_auto_trigger') === 'true');
  const [isTriggeringZapier, setIsTriggeringZapier] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [integrationLogs, setIntegrationLogs] = useState<IntegrationLog[]>([]);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [autoGenerateImage, setAutoGenerateImage] = useState(true);
  const [autoPublishOnGenerate, setAutoPublishOnGenerate] = useState(true);
  const [batchCount, setBatchCount] = useState(3);
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ done: 0, total: 0, current: '' });

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
    if (isAdmin) fetchPosts();
  }, [isAdmin]);

  const addLog = useCallback((service: string, status: IntegrationLog['status'], message: string) => {
    setIntegrationLogs(prev => [{ service, status, message, timestamp: new Date() }, ...prev.slice(0, 9)]);
  }, []);

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
        const titleMatch = data.content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : aiTopic;
        setFormData(prev => ({ ...prev, title, slug: generateSlug(title), content: data.content }));
        toast.success('Artigo completo gerado!');
      } else if (type === 'title') {
        const titles = data.content.split('\n').filter((t: string) => t.trim());
        if (titles.length > 0) {
          setFormData(prev => ({ ...prev, title: titles[0].replace(/^\d+\.\s*/, ''), slug: generateSlug(titles[0]) }));
          toast.success('Título gerado! Sugestões: ' + titles.join(' | '));
        }
      } else if (type === 'excerpt') {
        setFormData(prev => ({ ...prev, excerpt: data.content }));
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
      const { data, error } = await supabase.functions.invoke('generate-blog-image', { body: { topic, slug } });
      if (error) throw error;
      if (data.imageUrl) {
        setFormData(prev => ({ ...prev, image_url: data.imageUrl }));
        toast.success('Imagem gerada com sucesso!');
      }
    } catch (error: any) {
      console.error('Image generation error:', error);
      toast.error(error.message || 'Erro ao gerar imagem');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // 🚀 Geração 100% automática: tópico (opcional) → título + slug + resumo + artigo + categoria + imagem → salva → integrações
  const generateAutoPost = async (opts?: { topic?: string; silent?: boolean; autoSave?: boolean }) => {
    const useTopic = (opts?.topic ?? aiTopic).trim();
    const shouldSave = opts?.autoSave ?? autoPublishOnGenerate;
    setIsAutoGenerating(true);
    setIntegrationLogs([]);
    addLog('IA', 'pending', useTopic ? `Gerando artigo sobre "${useTopic}"...` : 'IA escolhendo tópico e gerando artigo...');

    try {
      // 1) Gera artigo estruturado em uma única chamada
      const { data, error } = await supabase.functions.invoke('generate-blog-auto', {
        body: { topic: useTopic || undefined, suggestTopic: !useTopic },
      });
      if (error) throw error;
      if (!data?.title) throw new Error('IA não retornou conteúdo válido');

      addLog('IA', 'success', `Artigo gerado: "${data.title}"`);

      // 2) Imagem (opcional)
      let imageUrl = '';
      if (autoGenerateImage) {
        addLog('Imagem IA', 'pending', 'Gerando imagem de capa...');
        try {
          const { data: img, error: imgErr } = await supabase.functions.invoke('generate-blog-image', {
            body: { topic: data.imagePrompt || data.title, slug: data.slug },
          });
          if (imgErr) throw imgErr;
          imageUrl = img?.imageUrl || '';
          if (imageUrl) addLog('Imagem IA', 'success', 'Imagem gerada e salva');
          else addLog('Imagem IA', 'error', 'Sem imagem retornada');
        } catch (e: any) {
          addLog('Imagem IA', 'error', e.message || 'Falha ao gerar imagem');
        }
      }

      const newPost = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        image_url: imageUrl,
        category: data.category || 'Motion Design',
        author: 'Rorschach Motion',
        published: shouldSave,
      };

      // Reflete no formulário (mesmo se autoSave)
      setFormData(newPost);
      setIsCreating(true);

      // 3) Salva direto no banco se autoSave
      if (shouldSave) {
        addLog('Banco', 'pending', 'Salvando no banco de dados...');
        const { error: insErr } = await supabase.from('blog_posts').insert([newPost]);
        if (insErr) {
          if (insErr.code === '23505') {
            addLog('Banco', 'error', 'Slug duplicado, gere novamente');
            throw new Error('Slug duplicado');
          }
          throw insErr;
        }
        addLog('Banco', 'success', 'Post publicado!');

        // 4) Integrações
        if (autoPublishFacebook) {
          await publishToFacebook(newPost.title, newPost.excerpt, newPost.slug, newPost.image_url || undefined);
        }
        if (autoTriggerZapier && zapierWebhookUrl.trim()) {
          await triggerZapierWebhook({
            title: newPost.title, excerpt: newPost.excerpt, slug: newPost.slug,
            category: newPost.category, image_url: newPost.image_url || undefined, published: true,
          });
        }
        await fetchPosts();
        if (!opts?.silent) toast.success('🎉 Post publicado automaticamente!');
      } else if (!opts?.silent) {
        toast.success('Conteúdo gerado! Revise e salve.');
      }

      return { success: true, post: newPost };
    } catch (e: any) {
      console.error('Auto generate error:', e);
      addLog('IA', 'error', e.message || 'Falha desconhecida');
      if (!opts?.silent) toast.error(e.message || 'Erro na geração automática');
      return { success: false };
    } finally {
      setIsAutoGenerating(false);
    }
  };

  // 🔁 Modo lote: gera N posts em sequência
  const runBatchGeneration = async () => {
    if (batchCount < 1 || batchCount > 10) {
      toast.error('Escolha entre 1 e 10 posts');
      return;
    }
    setIsBatchRunning(true);
    setBatchProgress({ done: 0, total: batchCount, current: '' });
    let success = 0;
    for (let i = 0; i < batchCount; i++) {
      setBatchProgress(prev => ({ ...prev, current: `Gerando ${i + 1}/${batchCount}...` }));
      const r = await generateAutoPost({ topic: '', silent: true, autoSave: true });
      if (r.success) success++;
      setBatchProgress(prev => ({ ...prev, done: i + 1 }));
      // Pausa entre geração para evitar rate limit
      if (i < batchCount - 1) await new Promise(r => setTimeout(r, 3000));
    }
    setIsBatchRunning(false);
    toast.success(`Lote concluído: ${success}/${batchCount} posts publicados`);
    setBatchProgress({ done: 0, total: 0, current: '' });
    resetForm();
  };

  const publishToFacebook = async (title: string, excerpt: string, slug: string, imageUrl?: string, retryCount = 0): Promise<boolean> => {
    setIsPublishingToFacebook(true);
    addLog('Facebook', 'pending', 'Publicando...');
    try {
      const postUrl = `https://lost-and-found-stories.lovable.app/blog/${slug}`;
      const message = `📢 Novo artigo no blog!\n\n${title}\n\n${excerpt}`;
      const { data, error } = await supabase.functions.invoke('publish-to-facebook', {
        body: { message, link: postUrl, imageUrl: imageUrl || undefined }
      });
      if (error) throw error;
      if (data.success) {
        addLog('Facebook', 'success', `Publicado! Post ID: ${data.postId}`);
        toast.success('✅ Publicado no Facebook!');
        return true;
      }
      throw new Error(data.error || 'Falha desconhecida');
    } catch (error: any) {
      console.error('Facebook publish error:', error);
      if (retryCount < 2) {
        addLog('Facebook', 'pending', `Tentativa ${retryCount + 2}...`);
        await new Promise(r => setTimeout(r, 2000));
        return publishToFacebook(title, excerpt, slug, imageUrl, retryCount + 1);
      }
      addLog('Facebook', 'error', error.message || 'Falha após 3 tentativas');
      toast.error('Erro ao publicar no Facebook: ' + (error.message || 'Tente novamente'));
      return false;
    } finally {
      setIsPublishingToFacebook(false);
    }
  };

  const triggerZapierWebhook = async (postData: { title: string; excerpt: string; slug: string; category: string; image_url?: string; published: boolean }, retryCount = 0): Promise<boolean> => {
    if (!zapierWebhookUrl.trim()) return false;
    setIsTriggeringZapier(true);
    addLog('Zapier', 'pending', 'Disparando webhook...');
    try {
      const postUrl = `https://lost-and-found-stories.lovable.app/blog/${postData.slug}`;
      await fetch(zapierWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({
          title: postData.title,
          excerpt: postData.excerpt,
          url: postUrl,
          category: postData.category,
          image_url: postData.image_url,
          published: postData.published,
          timestamp: new Date().toISOString(),
          triggered_from: window.location.origin,
        }),
      });
      addLog('Zapier', 'success', 'Webhook disparado com sucesso');
      toast.success('✅ Webhook Zapier disparado!');
      return true;
    } catch (error: any) {
      console.error('Zapier webhook error:', error);
      if (retryCount < 2) {
        addLog('Zapier', 'pending', `Tentativa ${retryCount + 2}...`);
        await new Promise(r => setTimeout(r, 2000));
        return triggerZapierWebhook(postData, retryCount + 1);
      }
      addLog('Zapier', 'error', 'Falha após 3 tentativas');
      toast.error('Erro ao disparar webhook do Zapier');
      return false;
    } finally {
      setIsTriggeringZapier(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }
    if (!formData.slug.trim()) {
      toast.error('Slug é obrigatório');
      return;
    }
    if (!formData.content?.trim()) {
      toast.error('Conteúdo é obrigatório');
      return;
    }

    setIsSaving(true);
    setIntegrationLogs([]);
    
    try {
      if (editingPost) {
        const { error } = await supabase.from('blog_posts').update(formData).eq('id', editingPost.id);
        if (error) throw error;
        toast.success('Post atualizado!');

        // Trigger integrations on edit if published
        if (formData.published) {
          if (autoPublishFacebook) {
            await publishToFacebook(formData.title, formData.excerpt || 'Confira nosso artigo atualizado!', formData.slug, formData.image_url || undefined);
          }
          if (autoTriggerZapier && zapierWebhookUrl.trim()) {
            await triggerZapierWebhook({ title: formData.title, excerpt: formData.excerpt || '', slug: formData.slug, category: formData.category, image_url: formData.image_url || undefined, published: formData.published });
          }
        }
      } else {
        const { error } = await supabase.from('blog_posts').insert([formData]);
        if (error) throw error;
        toast.success('Post criado!');

        if (autoPublishFacebook && formData.published) {
          await publishToFacebook(formData.title, formData.excerpt || 'Confira nosso novo artigo!', formData.slug, formData.image_url || undefined);
        }
        if (autoTriggerZapier && zapierWebhookUrl.trim()) {
          await triggerZapierWebhook({ title: formData.title, excerpt: formData.excerpt || '', slug: formData.slug, category: formData.category, image_url: formData.image_url || undefined, published: formData.published });
        }
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
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
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
    setIntegrationLogs([]);
  };

  const resetForm = () => {
    setFormData({ title: '', slug: '', excerpt: '', content: '', image_url: '', category: 'Motion Design', author: 'Rorschach Motion', published: true });
    setEditingPost(null);
    setIsCreating(false);
    setAiTopic('');
    setIntegrationLogs([]);
  };

  const saveZapierConfig = (url: string, autoTrigger: boolean) => {
    localStorage.setItem('zapier_webhook_url', url);
    localStorage.setItem('zapier_auto_trigger', String(autoTrigger));
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publishedCount = posts.filter(p => p.published).length;
  const draftCount = posts.filter(p => !p.published).length;

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
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/leads')}>
              📥 Leads
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/configuracoes')}>
              ⚙️ Tracking
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Site
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!isCreating ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{posts.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-500">{publishedCount}</p>
                <p className="text-xs text-muted-foreground">Publicados</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-yellow-500">{draftCount}</p>
                <p className="text-xs text-muted-foreground">Rascunhos</p>
              </div>
            </div>

            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold">Posts do Blog</h2>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Button size="icon" variant="outline" onClick={fetchPosts} title="Recarregar">
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="w-4 h-4 mr-1" /> Novo
                </Button>
              </div>
            </div>

            {isLoadingPosts ? (
              <div className="text-center py-12 text-muted-foreground">Carregando...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 'Nenhum post encontrado para esta busca' : 'Nenhum post encontrado'}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsCreating(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Criar primeiro post
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredPosts.map(post => (
                  <div 
                    key={post.id} 
                    className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{post.title}</h3>
                        {post.published ? (
                          <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded flex items-center gap-1 flex-shrink-0">
                            <CheckCircle2 className="w-3 h-3" /> Publicado
                          </span>
                        ) : (
                          <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded flex items-center gap-1 flex-shrink-0">
                            <Clock className="w-3 h-3" /> Rascunho
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{post.excerpt}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {post.category} • {post.author} • {new Date(post.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(post)} title="Editar">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} title="Excluir">
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
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
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
                <Button variant="secondary" onClick={() => generateWithAI('title')} disabled={isGenerating}>
                  <Sparkles className="w-4 h-4 mr-2" /> Gerar Título
                </Button>
                <Button variant="secondary" onClick={() => generateWithAI('excerpt')} disabled={isGenerating}>
                  <Sparkles className="w-4 h-4 mr-2" /> Gerar Resumo
                </Button>
                <Button onClick={() => generateWithAI('full')} disabled={isGenerating}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Gerando...' : 'Gerar Artigo Completo'}
                </Button>
                <Button variant="outline" onClick={generateImage} disabled={isGeneratingImage}>
                  {isGeneratingImage ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Image className="w-4 h-4 mr-2" />}
                  {isGeneratingImage ? 'Gerando Imagem...' : 'Gerar Imagem'}
                </Button>
              </div>
              
              {formData.image_url && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Imagem gerada:</p>
                  <img src={formData.image_url} alt="Preview" className="max-w-md rounded-lg border border-border" loading="lazy" />
                </div>
              )}
            </div>

            {/* Post Form */}
            <div className="grid gap-6 max-w-4xl">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value, slug: generateSlug(e.target.value) }))}
                    placeholder="Título do artigo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL) *</Label>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Conteúdo (Markdown) *</Label>
                  <span className="text-xs text-muted-foreground">{formData.content.length} caracteres</span>
                </div>
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
                  <Select value={formData.author} onValueChange={(value) => setFormData(prev => ({ ...prev, author: value }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione o autor" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rorschach Motion">Rorschach Motion</SelectItem>
                      <SelectItem value="noface">noface</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch id="published" checked={formData.published} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))} />
                <Label htmlFor="published" className="flex items-center gap-2">
                  {formData.published ? (<><Eye className="w-4 h-4" /> Publicado</>) : (<><EyeOff className="w-4 h-4" /> Rascunho</>)}
                </Label>
              </div>

              {/* Integrations Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider text-muted-foreground">Integrações</h3>
                
                {/* Zapier */}
                <div className="p-4 bg-card border border-border rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="autoTriggerZapier"
                      checked={autoTriggerZapier}
                      onCheckedChange={(checked) => { setAutoTriggerZapier(checked); saveZapierConfig(zapierWebhookUrl, checked); }}
                    />
                    <Label htmlFor="autoTriggerZapier" className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-500" />
                      <span>Integração com Zapier</span>
                    </Label>
                    {isTriggeringZapier && <Loader2 className="w-4 h-4 animate-spin text-orange-500" />}
                  </div>
                  {autoTriggerZapier && (
                    <div className="space-y-2">
                      <Input
                        placeholder="Cole aqui a URL do seu Webhook Zapier (ex: https://hooks.zapier.com/...)"
                        value={zapierWebhookUrl}
                        onChange={(e) => { setZapierWebhookUrl(e.target.value); saveZapierConfig(e.target.value, autoTriggerZapier); }}
                        className="text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Ao salvar um post, os dados serão enviados para o Zapier automaticamente com retry automático (até 3 tentativas).
                      </p>
                    </div>
                  )}
                </div>

                {/* Facebook */}
                {formData.published && (
                  <div className="p-4 bg-card border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Switch id="autoPublishFacebook" checked={autoPublishFacebook} onCheckedChange={setAutoPublishFacebook} />
                      <Label htmlFor="autoPublishFacebook" className="flex items-center gap-2">
                        <Facebook className="w-4 h-4 text-blue-500" />
                        <span>Publicar automaticamente no Facebook</span>
                      </Label>
                      {isPublishingToFacebook && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Publica no feed da página com retry automático (até 3 tentativas).
                    </p>
                  </div>
                )}
              </div>

              {/* Integration Logs */}
              {integrationLogs.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Log de Integrações
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {integrationLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        {log.status === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />}
                        {log.status === 'error' && <AlertCircle className="w-3.5 h-3.5 text-destructive mt-0.5 flex-shrink-0" />}
                        {log.status === 'pending' && <Loader2 className="w-3.5 h-3.5 text-yellow-500 mt-0.5 animate-spin flex-shrink-0" />}
                        <span className="text-muted-foreground">
                          <span className="font-medium text-foreground">{log.service}:</span> {log.message}
                          <span className="ml-2 opacity-50">{log.timestamp.toLocaleTimeString('pt-BR')}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button onClick={handleSave} disabled={isSaving || isPublishingToFacebook || isTriggeringZapier}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {editingPost ? 'Atualizar Post' : 'Criar Post'}
                </Button>
                <Button variant="outline" onClick={resetForm}>Cancelar</Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
