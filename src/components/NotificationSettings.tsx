
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export const NotificationSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newTickets: true,
    statusUpdates: true,
    systemAlerts: true,
    dailyReports: false,
    weeklyReports: true,
    notificationEmail: 'admin@empresa.com',
    smsNumber: '+55 11 99999-9999'
  });

  const handleToggle = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast({
      title: "Configurações salvas!",
      description: "As configurações de notificação foram atualizadas.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Notificação</CardTitle>
        <CardDescription>Configure como você deseja receber notificações</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">Canais de Notificação</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Notificações por Email</Label>
              <Switch 
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(value) => handleToggle('emailNotifications', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Notificações Push</Label>
              <Switch 
                id="push-notifications"
                checked={settings.pushNotifications}
                onCheckedChange={(value) => handleToggle('pushNotifications', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notifications">Notificações SMS</Label>
              <Switch 
                id="sms-notifications"
                checked={settings.smsNotifications}
                onCheckedChange={(value) => handleToggle('smsNotifications', value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Tipos de Notificação</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="new-tickets">Novos Tickets</Label>
              <Switch 
                id="new-tickets"
                checked={settings.newTickets}
                onCheckedChange={(value) => handleToggle('newTickets', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="status-updates">Atualizações de Status</Label>
              <Switch 
                id="status-updates"
                checked={settings.statusUpdates}
                onCheckedChange={(value) => handleToggle('statusUpdates', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="system-alerts">Alertas do Sistema</Label>
              <Switch 
                id="system-alerts"
                checked={settings.systemAlerts}
                onCheckedChange={(value) => handleToggle('systemAlerts', value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Relatórios</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-reports">Relatórios Diários</Label>
              <Switch 
                id="daily-reports"
                checked={settings.dailyReports}
                onCheckedChange={(value) => handleToggle('dailyReports', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="weekly-reports">Relatórios Semanais</Label>
              <Switch 
                id="weekly-reports"
                checked={settings.weeklyReports}
                onCheckedChange={(value) => handleToggle('weeklyReports', value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Contatos</h4>
          <div className="space-y-3">
            <div>
              <Label htmlFor="notification-email">Email para Notificações</Label>
              <Input
                id="notification-email"
                type="email"
                value={settings.notificationEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, notificationEmail: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="sms-number">Número para SMS</Label>
              <Input
                id="sms-number"
                value={settings.smsNumber}
                onChange={(e) => setSettings(prev => ({ ...prev, smsNumber: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="bg-gradient-primary text-white">
          Salvar Configurações
        </Button>
      </CardContent>
    </Card>
  );
};
