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
      {/* Branded Header for Citizen Portal */}
      <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-card/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-center">
          <div className="flex items-center gap-3">
            <img src={radgovLogo} alt="RAD GOV" className="h-10 w-auto object-contain" />
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-foreground">IluminaCity</span>
              <span className="block text-[11px] text-muted-foreground">Portal do Cidadão</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-12 lg:py-16">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_60%)]" />
          <div className="container relative">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm text-primary">
                <AlertTriangle className="h-3.5 w-3.5" />
                Portal de Denúncias
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Reporte um Problema de{' '}
                <span className="text-primary">Iluminação Pública</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Ajude a manter sua cidade iluminada. Informe postes com problemas 
                e acompanhe a resolução.
              </p>
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
        <section className="py-12 lg:py-16">
          <div className="container max-w-3xl">
            <div className="rounded-2xl border border-border/30 bg-card/80 backdrop-blur-sm p-6 lg:p-8 shadow-xl shadow-primary/5">
              <h2 className="text-xl font-semibold mb-6 text-foreground">Formulário de Denúncia</h2>
              <ComplaintForm />
            </div>
          </div>
        </section>
      </main>

      {/* Branded Footer */}
      <footer className="border-t border-border/30 bg-card/50 py-6">
        <div className="container flex flex-col items-center gap-3">
          <img src={radgovLogo} alt="RAD GOV" className="h-8 w-auto object-contain opacity-60" />
          <p className="text-xs text-muted-foreground text-center">
            Plataforma desenvolvida por <span className="text-primary font-medium">RAD Tecnologia</span> · Infraestrutura AWS
          </p>
        </div>
      </footer>
    </div>
  );
}
