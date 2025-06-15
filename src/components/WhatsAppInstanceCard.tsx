import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  Settings, 
  Trash2, 
  Power,
  PowerOff,
  Wifi,
  WifiOff,
  RefreshCw,
  Send
} from 'lucide-react';
import { WhatsAppInstance } from '@/hooks/useWhatsAppInstances';

interface WhatsAppInstanceCardProps {
  instance: WhatsAppInstance;
  onConnect: (instanceId: string) => void;
  onDisconnect: (instanceId: string) => void;
  onDelete: (instanceId: string) => void;
  onConfigure: (instance: WhatsAppInstance) => void;
  onSendTestMessage: (instanceId: string, phone: string, message: string) => Promise<boolean>;
  isLoading: boolean;
}

export const WhatsAppInstanceCard = ({
  instance,
  onConnect,
  onDisconnect,
  onDelete,
  onConfigure,
  onSendTestMessage,
  isLoading
}: WhatsAppInstanceCardProps) => {
  const [testMessage, setTestMessage] = useState('');
  const [testPhone, setTestPhone] = useState('');

  const handleSendTest = async () => {
    try {
      const success = await onSendTestMessage(instance.id, testPhone, testMessage);
      if (success) {
        setTestMessage('');
        setTestPhone('');
      }
    } catch (error) {
      console.error('Error sending test message:', error);
    }
  };

  function getStatusBadge(status: WhatsAppInstance['status']) {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500">Conectado</Badge>;
      case 'connecting':
        return <Badge variant="secondary">Conectando...</Badge>;
      case 'qr_ready':
        return <Badge variant="outline">QR Code Pronto</Badge>;
      default:
        return <Badge variant="destructive">Desconectado</Badge>;
    }
  }

  function getStatusIcon(status: WhatsAppInstance['status']) {
    switch (status) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'connecting':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'qr_ready':
        return <QrCode className="w-4 h-4 text-orange-500" />;
      default:
        return <WifiOff className="w-4 h-4 text-red-500" />;
    }
  }

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(instance.status)}
            <CardTitle className="text-lg">{instance.name}</CardTitle>
          </div>
          {getStatusBadge(instance.status)}
        </div>
        <CardDescription>
          {instance.phone || 'Aguardando conexão'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Code Display */}
        {instance.status === 'qr_ready' && instance.qrCode && (
          <div className="text-center space-y-2">
            <div className="bg-white p-4 rounded-lg inline-block border">
              {instance.qrCode.startsWith('data:image') ? (
                <img src={instance.qrCode} alt="QR Code" className="w-32 h-32" />
              ) : (
                <QrCode className="w-32 h-32 mx-auto text-gray-400" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Escaneie o QR Code com seu WhatsApp
            </p>
          </div>
        )}

        {instance.status === 'disconnected' && (
          <div className="text-center space-y-2">
            <div className="bg-white p-4 rounded-lg inline-block border">
              <QrCode className="w-32 h-32 mx-auto text-gray-400" />
            </div>
            <p className="text-sm text-muted-foreground">
              Clique em "Conectar" para gerar o QR Code
            </p>
          </div>
        )}

        {/* Instance Controls */}
        <div className="flex gap-2">
          {instance.status === 'disconnected' ? (
            <Button 
              onClick={() => onConnect(instance.id)}
              disabled={isLoading}
              size="sm"
              className="flex-1"
            >
              <Power className="w-4 h-4 mr-2" />
              {isLoading ? 'Conectando...' : 'Conectar'}
            </Button>
          ) : (
            <Button 
              onClick={() => onDisconnect(instance.id)}
              disabled={isLoading}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              <PowerOff className="w-4 h-4 mr-2" />
              Desconectar
            </Button>
          )}
          
          <Button 
            onClick={() => onConfigure(instance)}
            size="sm"
            variant="outline"
          >
            <Settings className="w-4 h-4" />
          </Button>
          
          <Button 
            onClick={() => onDelete(instance.id)}
            size="sm"
            variant="outline"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Test Message Section */}
        {instance.status === 'connected' && (
          <div className="space-y-2 pt-2 border-t">
            <Label className="text-sm font-medium">Teste Rápido</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Número (ex: +5511999999999)"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="text-xs"
              />
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Mensagem de teste"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="text-xs"
              />
              <Button 
                onClick={handleSendTest}
                size="sm"
                disabled={!testMessage.trim() || !testPhone.trim() || isLoading}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
