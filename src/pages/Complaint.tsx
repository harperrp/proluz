import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ComplaintForm } from '@/components/forms/ComplaintForm';
import { AlertTriangle, Shield, Clock, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: <AlertTriangle className="h-5 w-5" />,
    title: 'Identifique o problema',
    description: 'Localize o poste com defeito e tire uma foto se possível.',
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
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-primary text-primary-foreground py-12 lg:py-16">
          <div className="container">
            <div className="max-w-2xl">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                Reporte um Problema de Iluminação
              </h1>
              <p className="text-lg text-white/80">
                Ajude a manter sua cidade iluminada. Informe postes com problemas 
                e acompanhe a resolução.
              </p>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-8 border-b bg-muted/30">
          <div className="container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {step.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="py-12 lg:py-16">
          <div className="container max-w-2xl">
            <div className="rounded-xl border bg-card p-6 lg:p-8 shadow-lg">
              <h2 className="text-xl font-semibold mb-6">Formulário de Denúncia</h2>
              <ComplaintForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
