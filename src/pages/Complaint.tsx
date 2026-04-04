import { ComplaintForm } from '@/components/forms/ComplaintForm';
import { AlertTriangle, Shield, Clock, CheckCircle } from 'lucide-react';
import radgovLogo from '@/assets/radgov-logo.png';

const steps = [
  {
    icon: <AlertTriangle className="h-5 w-5" />,
    title: 'Selecione o poste',
    description: 'Escolha sua cidade e clique no poste com problema no mapa.',
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: 'Preencha seus dados',
    description: 'Informe seus dados para validação da denúncia.',
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: 'Aguarde análise',
    description: 'A secretaria irá analisar sua denúncia em até 48 horas.',
  },
  {
    icon: <CheckCircle className="h-5 w-5" />,
    title: 'Manutenção realizada',
    description: 'Técnicos serão enviados para resolver o problema.',
  },
];

export default function Complaint() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Combined Header + Hero */}
      <section className="relative overflow-hidden border-b border-border/20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.12),transparent_70%)]" />
        
        <div className="container relative py-10 lg:py-14">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Logo + Brand */}
            <div className="flex flex-col items-center gap-2">
              <img src={radgovLogo} alt="RAD GOV" className="h-20 lg:h-24 w-auto object-contain drop-shadow-[0_0_30px_hsl(var(--primary)/0.3)]" />
              <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.3em] uppercase text-primary/70">
                <span className="h-px w-6 bg-primary/30" />
                IluminaCity
                <span className="h-px w-6 bg-primary/30" />
              </div>
            </div>

            {/* Title */}
            <div className="max-w-xl space-y-3">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                Reporte um Problema de{' '}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Iluminação Pública
                </span>
              </h1>
              <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
                Ajude a manter sua cidade iluminada. Informe postes com problemas 
                e acompanhe a resolução.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-8 border-b border-border/30 bg-card/30">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-card/50 border border-border/30">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  {step.icon}
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="flex-1 py-12 lg:py-16">
        <div className="container max-w-3xl">
          <div className="rounded-2xl border border-border/30 bg-card/80 backdrop-blur-sm p-6 lg:p-8 shadow-xl shadow-primary/5">
            <h2 className="text-xl font-semibold mb-6 text-foreground">Formulário de Denúncia</h2>
            <ComplaintForm />
          </div>
        </div>
      </section>

      {/* Footer profissional com logo grande */}
      <footer className="border-t border-border/30 bg-card/60 backdrop-blur-sm py-10">
        <div className="container flex flex-col items-center gap-5">
          <img src={radgovLogo} alt="RAD GOV" className="h-20 lg:h-24 w-auto object-contain drop-shadow-[0_4px_20px_hsl(var(--primary)/0.25)]" />
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="text-center space-y-1.5">
            <p className="text-sm text-muted-foreground">
              Plataforma desenvolvida por <span className="text-primary font-semibold">RAD Tecnologia</span>
            </p>
            <p className="text-[11px] text-muted-foreground/50">
              Infraestrutura AWS · Todos os direitos reservados · {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
