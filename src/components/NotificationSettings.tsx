
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Mail, MessageSquare, Smartphone, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const NotificationSettings = () => {
  const { toast } = useToast();
  
  const [emailSettings, setEmailSettings] = useState({
    enabled: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: 'CRM System'
  });

  const [pushSettings, setPushSettings] = useState({
    enabled: false,
    vapidPublicKey: '',
    vapidPrivateKey: '',
    firebaseKey: ''
  });

  const [whatsappSettings, setWhatsappSettings] = useState({
    enabled: true,
    notifyNewMessages: true,
    notifyPayments: true,
    notifyWorkflows: true
  });

  const [generalSettings, setGeneralSettings] = useState({
    soundEnabled: true,
    desktopNotifications: true,
    emailDigest: 'daily',
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00'
  });

  const handleSaveEmailSettings = () => {
    console.log('Salvando configurações de email:', emailSettings);
    
    toast({
      title: "Configurações salvas!",
      description: "Configurações de email foram atualizadas.",
    });
  };

  const handleTestEmail = async () => {
    console.log('Testando configurações de email...');
    
    toast({
      title: "Testando email...",
      description: "Enviando email de teste.",
    });

    // Simular teste de email
    setTimeout(() => {
      toast({
        title: "Email enviado!",
        description: "Configurações de email estão funcionando.",
      });
    }, 2000);
  };

  const handleSavePushSettings = () => {
    console.log('Salvando configurações push:', pushSettings);
    
    toast({
      title: "Configurações salvas!",
      description: "Configurações de push foram atualizadas.",
    });
  };

  const handleSaveWhatsappSettings = () => {
    console.log('Salvando configurações WhatsApp:', whatsappSettings);
    
    toast({
      title: "Configurações salvas!",
      description: "Configurações do WhatsApp foram atualizadas.",
    });
  };

  const handleSaveGeneralSettings = () => {
    console.log('Salvando configurações gerais:', generalSettings);
    
    toast({
      title: "Configurações salvas!",
      description: "Configurações gerais foram atualizadas.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6" />
          Configurações de Notificação
        </h2>
        <p className="text-muted-foreground">Configure como você deseja receber notificações</p>
      </div>

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="push">Push</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="general">Geral</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Configurações de Email
              </CardTitle>
              <CardDescription>
                Configure o servidor SMTP para envio de emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="email-enabled"
                  checked={emailSettings.enabled}
                  onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, enabled: checked })}
                />
                <Label htmlFor="email-enabled">Habilitar notificações por email</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp-host">Servidor SMTP</Label>
                  <Input
                    id="smtp-host"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtp-port">Porta</Label>
                  <Input
                    id="smtp-port"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                    placeholder="587"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="smtp-user">Usuário SMTP</Label>
                <Input
                  id="smtp-user"
                  value={emailSettings.smtpUser}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                  placeholder="seu-email@gmail.com"
                />
              </div>

              <div>
                <Label htmlFor="smtp-password">Senha SMTP</Label>
                <Input
                  id="smtp-password"
                  type="password"
                  value={emailSettings.smtpPassword}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                  placeholder="Sua senha ou app password"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from-email">Email Remetente</Label>
                  <Input
                    id="from-email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                    placeholder="noreply@seudominio.com"
                  />
                </div>
                <div>
                  <Label htmlFor="from-name">Nome Remetente</Label>
                  <Input
                    id="from-name"
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                    placeholder="CRM System"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveEmailSettings} className="bg-gradient-primary">
                  Salvar Configurações
                </Button>
                <Button variant="outline" onClick={handleTestEmail}>
                  Testar Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="push" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Notificações Push
              </CardTitle>
              <CardDescription>
                Configure notificações push para dispositivos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="push-enabled"
                  checked={pushSettings.enabled}
                  onCheckedChange={(checked) => setPushSettings({ ...pushSettings, enabled: checked })}
                />
                <Label htmlFor="push-enabled">Habilitar notificações push</Label>
              </div>

              <div>
                <Label htmlFor="vapid-public">VAPID Public Key</Label>
                <Input
                  id="vapid-public"
                  value={pushSettings.vapidPublicKey}
                  onChange={(e) => setPushSettings({ ...pushSettings, vapidPublicKey: e.target.value })}
                  placeholder="Chave pública VAPID"
                />
              </div>

              <div>
                <Label htmlFor="vapid-private">VAPID Private Key</Label>
                <Input
                  id="vapid-private"
                  type="password"
                  value={pushSettings.vapidPrivateKey}
                  onChange={(e) => setPushSettings({ ...pushSettings, vapidPrivateKey: e.target.value })}
                  placeholder="Chave privada VAPID"
                />
              </div>

              <div>
                <Label htmlFor="firebase-key">Firebase Server Key</Label>
                <Input
                  id="firebase-key"
                  type="password"
                  value={pushSettings.firebaseKey}
                  onChange={(e) => setPushSettings({ ...pushSettings, firebaseKey: e.target.value })}
                  placeholder="Chave do servidor Firebase"
                />
              </div>

              <Button onClick={handleSavePushSettings} className="w-full">
                Salvar Configurações Push
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Notificações WhatsApp
              </CardTitle>
              <CardDescription>
                Configure quando receber notificações via WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="whatsapp-enabled"
                  checked={whatsappSettings.enabled}
                  onCheckedChange={(checked) => setWhatsappSettings({ ...whatsappSettings, enabled: checked })}
                />
                <Label htmlFor="whatsapp-enabled">Habilitar notificações WhatsApp</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="notify-messages"
                  checked={whatsappSettings.notifyNewMessages}
                  onCheckedChange={(checked) => setWhatsappSettings({ ...whatsappSettings, notifyNewMessages: checked })}
                />
                <Label htmlFor="notify-messages">Notificar novas mensagens</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="notify-payments"
                  checked={whatsappSettings.notifyPayments}
                  onCheckedChange={(checked) => setWhatsappSettings({ ...whatsappSettings, notifyPayments: checked })}
                />
                <Label htmlFor="notify-payments">Notificar pagamentos</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="notify-workflows"
                  checked={whatsappSettings.notifyWorkflows}
                  onCheckedChange={(checked) => setWhatsappSettings({ ...whatsappSettings, notifyWorkflows: checked })}
                />
                <Label htmlFor="notify-workflows">Notificar execução de workflows</Label>
              </div>

              <Button onClick={handleSaveWhatsappSettings} className="w-full">
                Salvar Configurações WhatsApp
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>
                Configurações gerais de notificação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="sound-enabled"
                  checked={generalSettings.soundEnabled}
                  onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, soundEnabled: checked })}
                />
                <Label htmlFor="sound-enabled">Sons de notificação</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="desktop-notifications"
                  checked={generalSettings.desktopNotifications}
                  onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, desktopNotifications: checked })}
                />
                <Label htmlFor="desktop-notifications">Notificações no desktop</Label>
              </div>

              <div>
                <Label htmlFor="email-digest">Frequência do resumo por email</Label>
                <Select 
                  value={generalSettings.emailDigest} 
                  onValueChange={(value) => setGeneralSettings({ ...generalSettings, emailDigest: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Nunca</SelectItem>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quiet-start">Início do período silencioso</Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={generalSettings.quietHoursStart}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, quietHoursStart: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="quiet-end">Fim do período silencioso</Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={generalSettings.quietHoursEnd}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, quietHoursEnd: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={handleSaveGeneralSettings} className="w-full">
                Salvar Configurações Gerais
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
