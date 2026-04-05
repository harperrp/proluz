import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Eye, EyeOff, ArrowRight, Lightbulb, CheckCircle } from 'lucide-react';
import radgovLogo from '@/assets/radgov-logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LocationState {
  from?: string;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    const success = await login(data.email, data.password);
    setIsSubmitting(false);

    if (success) {
      toast.success('Login realizado com sucesso!');
      const state = location.state as LocationState | null;
      const target = state?.from && state.from.startsWith('/dashboard') ? state.from : '/dashboard';
      navigate(target, { replace: true });
      return;
    }

    toast.error('Credenciais inválidas.');
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <img src={radgovLogo} alt="RAD GOV" className="h-12" />
              <span className="text-xl font-bold">IluminaCity</span>
            </Link>
            <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
            <p className="text-muted-foreground mt-1">Acesse o sistema de gestão de iluminação pública</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input type="email" placeholder="seu@email.gov.br" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Senha</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar no Sistema <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            É cidadão?{' '}
            <Link to="/denuncia" className="text-primary hover:underline font-medium">
              Faça uma denúncia
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-card via-background to-card items-center justify-center p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 text-center max-w-lg space-y-8">
          <img src={radgovLogo} alt="RAD GOV" className="h-16 mx-auto" />

          <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-primary/10 ring-2 ring-primary/20 mx-auto">
            <Lightbulb className="h-10 w-10 text-primary" />
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-3">
              Gestão Inteligente de
              <br />
              Iluminação Pública
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Transforme a forma como sua prefeitura gerencia a iluminação pública. Reduza custos, melhore o tempo de
              resposta e aumente a satisfação dos cidadãos.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '60%', label: 'Mais rápido' },
              { value: '95%', label: 'Resolução' },
              { value: '40%', label: 'Economia' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4">
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            {['LGPD Compliance', 'Multi-tenant', 'Suporte 24/7'].map((feat) => (
              <span key={feat} className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-success" />
                {feat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
