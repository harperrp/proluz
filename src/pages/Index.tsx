import { Link } from 'react-router-dom';
import { 
  Cpu, 
  MapPin, 
  AlertTriangle, 
  Users, 
  ArrowRight, 
  CheckCircle,
  Building2,
  Clock,
  BarChart3,
  Shield,
  Phone,
  Mail,
  Star,
  TrendingDown,
  Timer,
  Target,
  DollarSign,
  Cloud,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const features = [
  { icon: <MapPin className="h-6 w-6" />, title: 'Mapa Interativo', description: 'Visualize todos os postes com status em tempo real e geolocalização precisa.' },
  { icon: <AlertTriangle className="h-6 w-6" />, title: 'Denúncias Simplificadas', description: 'Cidadãos reportam problemas com apenas alguns cliques, direto do celular.' },
  { icon: <Users className="h-6 w-6" />, title: 'Gestão de Equipes', description: 'Controle técnicos, secretários e administradores com níveis de acesso hierárquico.' },
  { icon: <Clock className="h-6 w-6" />, title: 'Resposta Rápida', description: 'Fluxo otimizado para aprovação e manutenção de postes defeituosos.' },
  { icon: <BarChart3 className="h-6 w-6" />, title: 'Relatórios Completos', description: 'Dashboard com métricas detalhadas e exportação em PDF e Excel.' },
  { icon: <DollarSign className="h-6 w-6" />, title: 'Economia Real', description: 'Economia estimada com manutenção preventiva visível no dashboard.' },
];

const stats = [
  { value: '60%', label: 'Redução no tempo', icon: <Timer className="h-5 w-5" /> },
  { value: '95%', label: 'Taxa de resolução', icon: <Target className="h-5 w-5" /> },
  { value: '40%', label: 'Economia operacional', icon: <TrendingDown className="h-5 w-5" /> },
  { value: '18h', label: 'Tempo médio', icon: <Zap className="h-5 w-5" /> },
];

const steps = [
  { number: '01', title: 'Cidadão Reporta', description: 'Denúncia pelo app com foto e localização automática.' },
  { number: '02', title: 'Secretário Valida', description: 'Análise e aprovação ou rejeição com justificativa.' },
  { number: '03', title: 'Técnico Executa', description: 'Rota otimizada no mapa e atualização do status.' },
  { number: '04', title: 'Dados Consolidados', description: 'Métricas em tempo real e relatórios automáticos.' },
];

const testimonials = [
  { quote: 'Com o IluminaCity, reduzimos o tempo de resposta de 5 dias para 18 horas.', author: 'Maria Silva', role: 'Secretária de Infraestrutura', city: 'São José dos Campos' },
  { quote: 'O sistema nos deu visibilidade total. Decisões baseadas em dados reais.', author: 'Carlos Santos', role: 'Prefeito Municipal', city: 'Ribeirão Preto' },
  { quote: 'Nossos técnicos adoraram. O mapa interativo facilita o trabalho diário.', author: 'Ana Costa', role: 'Coordenadora de Manutenção', city: 'Campinas' },
];

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
              <Cpu className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-sm block leading-tight">RAD TECNOLOGIA</span>
              <span className="text-[10px] text-muted-foreground tracking-wider uppercase">Plataforma GovTech</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/denuncia">
              <Button variant="ghost" size="sm" className="text-xs">Denúncia</Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="text-xs gap-1.5">
                Acessar Sistema
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="container relative py-24 lg:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Cpu className="h-3 w-3 mr-1" />
              RAD Tecnologia · Plataforma GovTech
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              <span className="text-sm font-semibold tracking-widest uppercase text-muted-foreground block mb-3">IluminaCity</span>
              Centro de Controle<br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Urbano Inteligente</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Plataforma completa para prefeituras gerenciarem postes, atenderem denúncias e coordenarem equipes com eficiência.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20">
                  Acessar Demonstração
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/denuncia">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-border/50">
                  Ver como Cidadão
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground/60">
              ✓ Teste gratuito &nbsp; ✓ Sem cartão de crédito &nbsp; ✓ Suporte dedicado
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 relative z-10">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card p-6 text-center"
              >
                <div className="flex justify-center mb-3 text-primary">{stat.icon}</div>
                <div className="text-3xl font-bold text-primary font-mono mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 border-border/50">Funcionalidades</Badge>
            <h2 className="text-3xl font-bold mb-4">Tudo que sua prefeitura precisa</h2>
            <p className="text-muted-foreground">Solução completa para gerenciar iluminação pública de forma eficiente e transparente.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="premium-card p-6 group hover:border-primary/30 transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Economy Highlight */}
      <section className="py-20 bg-muted/10">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="premium-card p-8 lg:p-12 glow-gold text-center max-w-3xl mx-auto"
          >
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 mb-6">
              <DollarSign className="h-8 w-8 text-accent" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Economia real para prefeituras
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Com manutenção preventiva baseada em dados, prefeitos visualizam no dashboard a economia estimada do mês.
            </p>
            <div className="inline-flex items-baseline gap-2 p-4 rounded-xl bg-accent/5 border border-accent/20">
              <span className="text-muted-foreground text-lg">R$</span>
              <span className="text-5xl font-bold text-accent font-mono">18.000</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <p className="text-xs text-muted-foreground mt-4">Média de economia estimada com manutenção preventiva</p>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 border-border/50">Como Funciona</Badge>
            <h2 className="text-3xl font-bold mb-4">Fluxo simples e eficiente</h2>
            <p className="text-muted-foreground">Do registro da denúncia à conclusão do reparo.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="text-5xl font-bold text-primary/10 mb-4 font-mono">{step.number}</div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2">
                    <ArrowRight className="h-5 w-5 text-primary/20" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/10">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 border-border/50">Depoimentos</Badge>
            <h2 className="text-3xl font-bold mb-4">O que dizem nossos clientes</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="text-sm text-muted-foreground mb-5">"{t.quote}"</blockquote>
                <div className="border-t border-border/50 pt-4">
                  <p className="text-sm font-semibold">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role} — {t.city}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Shield className="h-6 w-6 text-primary" />, title: 'LGPD Compliance', desc: 'Lei Geral de Proteção de Dados' },
                { icon: <Building2 className="h-6 w-6 text-primary" />, title: 'Multi-tenant', desc: 'Isolamento total de dados' },
                { icon: <Users className="h-6 w-6 text-primary" />, title: 'Controle de Acesso', desc: '5 níveis hierárquicos' },
                { icon: <BarChart3 className="h-6 w-6 text-primary" />, title: 'Auditoria', desc: 'Logs de todas as ações' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="premium-card p-5"
                >
                  {item.icon}
                  <h4 className="font-semibold text-sm mt-3 mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
            <div>
              <Badge variant="outline" className="mb-4 border-border/50">Segurança</Badge>
              <h2 className="text-3xl font-bold mb-4">Seus dados protegidos</h2>
              <p className="text-muted-foreground mb-6">
                Desenvolvido com foco em segurança. Cada prefeitura tem seus dados completamente isolados.
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {['Criptografia de ponta a ponta', 'Backups automáticos diários', 'Auditoria completa de logs', 'Conformidade com normas governamentais'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/10">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto space-y-6"
          >
            <h2 className="text-3xl font-bold">Pronto para transformar a gestão da sua cidade?</h2>
            <p className="text-muted-foreground">
              Agende uma demonstração e descubra como o IluminaCity pode modernizar a sua prefeitura.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Acessar Demonstração
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2 border-border/50">
                <Mail className="h-4 w-4" />
                Falar com Vendas
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            <span><strong className="text-foreground/70">RAD Tecnologia</strong> · IluminaCity</span>
          </div>
          <p className="flex items-center gap-1">
            © 2026 RAD Tecnologia. Todos os direitos reservados. <Cloud className="h-3 w-3 ml-1" /> AWS
          </p>
        </div>
      </footer>
    </div>
  );
}
