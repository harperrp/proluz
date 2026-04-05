import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Eye, EyeOff, ArrowRight, Lightbulb } from 'lucide-react';
import radgovLogo from '@/assets/radgov-logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const loginSchema = z.object({ email: z.string().email('E-mail inválido'), password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres') });
type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const success = await login(data.email, data.password);
    setIsLoading(false);
    if (success) { toast.success('Login realizado com sucesso!'); navigate('/dashboard'); } else { toast.error('Credenciais inválidas.'); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center"><Link to="/" className="inline-flex items-center gap-3 mb-6"><img src={radgovLogo} alt="RAD GOV" className="h-16" /><span className="text-xl font-bold">IluminaCity</span></Link><h1 className="text-2xl font-bold">Entrar</h1></div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2"><Label>E-mail</Label><Input type="email" {...register('email')} />{errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}</div>
            <div className="space-y-2"><Label>Senha</Label><div className="relative"><Input type={showPassword ? 'text' : 'password'} {...register('password')} className="pr-10" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>{errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}</div>
            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Entrando...</> : <>Entrar <ArrowRight className="ml-2 h-4 w-4" /></>}</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">É cidadão? <Link to="/denuncia" className="text-primary hover:underline">Faça uma denúncia</Link></p>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center"><Lightbulb className="h-16 w-16 text-primary" /></div>
    </div>
  );
}
