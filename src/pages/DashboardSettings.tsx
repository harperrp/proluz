import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  Save,
  Building2,
} from 'lucide-react';

export default function DashboardSettings() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie as configurações do sistema
          </p>
        </div>

        {/* General */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="premium-card border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium">Dados do Município</CardTitle>
              </div>
              <CardDescription className="text-xs">Informações básicas da prefeitura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs">Nome do Município</Label>
                  <Input defaultValue="Vargem Grande do Rio Pardo" className="bg-muted/30 border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Estado</Label>
                  <Input defaultValue="MG" className="bg-muted/30 border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">CNPJ</Label>
                  <Input defaultValue="12.345.678/0001-01" className="bg-muted/30 border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">E-mail de Contato</Label>
                  <Input defaultValue="contato@vgrp.mg.gov.br" className="bg-muted/30 border-border/50" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="premium-card border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium">Notificações</CardTitle>
              </div>
              <CardDescription className="text-xs">Configure alertas e notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Notificar novas denúncias', desc: 'Receba alertas de denúncias dos cidadãos', defaultOn: true },
                { label: 'Alertas de postes críticos', desc: 'Postes com queima recorrente', defaultOn: true },
                { label: 'Relatório semanal por e-mail', desc: 'Resumo das atividades da semana', defaultOn: false },
                { label: 'Notificações push', desc: 'Alertas no navegador em tempo real', defaultOn: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.defaultOn} />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="premium-card border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium">Segurança</CardTitle>
              </div>
              <CardDescription className="text-xs">Configurações de segurança do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Autenticação em dois fatores', desc: 'Adicione uma camada extra de segurança', defaultOn: false },
                { label: 'Sessão expira em 24h', desc: 'Desconectar após período de inatividade', defaultOn: true },
                { label: 'Log de atividades', desc: 'Registrar todas as ações dos usuários', defaultOn: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.defaultOn} />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex justify-end">
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
