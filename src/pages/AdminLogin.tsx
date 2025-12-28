import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`
          }
        });

        if (error) throw error;
        toast.success('Conta criada! Faça login para continuar.');
        setIsSignUp(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        // Check if user is admin
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (roleError) throw roleError;

        if (!roleData) {
          await supabase.auth.signOut();
          toast.error('Acesso negado. Você não é administrador.');
          return;
        }

        toast.success('Login realizado com sucesso!');
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      if (error.message === 'Invalid login credentials') {
        toast.error('Email ou senha incorretos.');
      } else if (error.message === 'User already registered') {
        toast.error('Este email já está cadastrado.');
      } else {
        toast.error(error.message || 'Erro na autenticação.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">
              {isSignUp ? 'Crie sua conta de administrador' : 'Faça login para acessar o painel'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Carregando...' : isSignUp ? 'Criar Conta' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isSignUp ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate('/')}
            >
              ← Voltar ao site
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
