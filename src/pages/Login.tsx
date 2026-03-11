import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Eye, EyeOff, ArrowRight, CheckCircle, Globe, Shield, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const demoAccounts = [
  { email: 'admin@sistema.gov.br', password: 'admin123', role: 'Administrador', description: 'Acesso total', color: 'from-primary/20 to-primary/5 border-primary/20 text-primary' },
  { email: 'prefeitura@cidade.gov.br', password: 'prefeitura123', role: 'Admin. Municipal', description: 'Gestão municipal', color: 'from-primary/20 to-primary/5 border-primary/20 text-primary' },
  { email: 'secretario@cidade.gov.br', password: 'secretario123', role: 'Secretário', description: 'Validar denúncias', color: 'from-accent/20 to-accent/5 border-accent/20 text-accent' },
  { email: 'tecnico@cidade.gov.br', password: 'tecnico123', role: 'Técnico', description: 'Manutenção', color: 'from-success/20 to-success/5 border-success/20 text-success' },
];

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const success = await login(data.email, data.password);
    setIsLoading(false);
    
    if (success) {
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } else {
      toast.error('Credenciais inválidas');
    }
  };

  const handleDemoSelect = (account: typeof demoAccounts[0]) => {
    setSelectedDemo(account.email);
    setValue('email', account.email);
    setValue('password', account.password);
  };

  return (
    <div className="min-h-screen flex gradient-hero">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-8"
        >
          {/* RAD Tecnologia Branding */}
          <div className="text-center space-y-5">
            <Link to="/" className="inline-block">
              <div className="flex flex-col items-center gap-3">
                {/* RAD Logo mark */}
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 glow-blue shadow-lg shadow-primary/20">
                    <Cpu className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-accent border-2 border-background" />
                </div>
                {/* Company name */}
                <div>
                  <h2 className="text-xl font-bold tracking-tight">RAD TECNOLOGIA</h2>
                  <p className="text-[11px] text-muted-foreground tracking-widest uppercase">Plataforma GovTech</p>
                </div>
              </div>
            </Link>

            {/* System identifier */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-8 bg-border" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Módulo</span>
                <div className="h-px w-8 bg-border" />
              </div>
              <h1 className="text-2xl font-bold">IluminaCity</h1>
              <p className="text-sm text-muted-foreground">
                Sistema de gestão inteligente de iluminação pública para cidades
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.gov.br"
                {...register('email')}
                className={`bg-muted/30 border-border/50 ${errors.email ? 'border-destructive' : ''}`}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`bg-muted/30 border-border/50 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar no Sistema
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">
                Demonstração
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => handleDemoSelect(account)}
                className={`relative text-left p-3 rounded-xl border transition-all duration-200 ${
                  selectedDemo === account.email 
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/50' 
                    : 'border-border/50 bg-card/30 hover:border-primary/30'
                }`}
              >
                {selectedDemo === account.email && (
                  <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-primary" />
                )}
                <p className="text-sm font-medium">{account.role}</p>
                <p className="text-[11px] text-muted-foreground">{account.description}</p>
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            É cidadão?{' '}
            <Link to="/denuncia" className="text-primary hover:underline font-medium">
              Faça uma denúncia
            </Link>
          </p>

          {/* Institutional footer */}
          <p className="text-center text-[10px] text-muted-foreground/50 pt-2">
            IluminaCity © 2026 · Plataforma RAD Tecnologia · Infraestrutura em nuvem AWS
          </p>
        </motion.div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative overflow-hidden border-l border-border/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-lg text-center space-y-8"
        >
          {/* RAD logo large */}
          <div className="space-y-4">
            <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 backdrop-blur-sm flex items-center justify-center glow-blue">
              <Cpu className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">RAD Tecnologia</h2>
              <p className="text-[11px] text-muted-foreground/60 tracking-wider uppercase">Plataforma GovTech</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Gestão Municipal<br />
              <span className="text-primary">Inteligente</span>
            </h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Plataforma integrada de soluções tecnológicas para prefeituras. 
              Iluminação pública, gestão urbana e muito mais.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: <Globe className="h-5 w-5 text-primary" />, value: '60%', label: 'Mais rápido' },
              { icon: <Shield className="h-5 w-5 text-accent" />, value: '95%', label: 'Resolução' },
              { icon: <Cpu className="h-5 w-5 text-success" />, value: '40%', label: 'Economia' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="p-4 rounded-xl bg-card/30 border border-border/30 backdrop-blur-sm"
              >
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <p className="text-2xl font-bold text-foreground font-mono">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-xs text-muted-foreground/60 space-x-4">
            <span>✓ LGPD</span>
            <span>✓ Multi-tenant</span>
            <span>✓ Suporte 24/7</span>
          </div>

          <p className="text-[10px] text-muted-foreground/40">
            Infraestrutura em nuvem AWS · Segurança de dados certificada
          </p>
        </motion.div>
      </div>
    </div>
  );
}
