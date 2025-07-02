
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Smartphone, 
  QrCode, 
  Trash2, 
  Power,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { WhatsAppInstance } from '@/hooks/useWhatsAppInstances';

interface WhatsAppInstanceCardProps {
  instance: WhatsAppInstance;
  isLoading: boolean;
  onConnect: (instanceId: string) => void;
  onDisconnect: (instanceId: string) => void;
  onDelete: (instanceId: string) => void;
  onConfigure: (instance: WhatsAppInstance) => void;
}

export const WhatsAppInstanceCard = ({
  instance,
  isLoading,
  onConnect,
  onDisconnect,
  onDelete,
  onConfigure
}: WhatsAppInstanceCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'connecting':
      case 'qr_ready':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500">Conectado</Badge>;
      case 'connecting':
        return <Badge className="bg-blue-500">Conectando</Badge>;
      case 'qr_ready':
        return <Badge className="bg-yellow-500">QR Code Pronto</Badge>;
      default:
        return <Badge variant="outline">Desconectado</Badge>;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'connecting': return 'Conectando';
      case 'qr_ready': return 'QR Code Pronto';
      default: return 'Desconectado';
    }
  };

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{instance.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                {instance.phone || 'Não conectado'}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(instance.status)}
            {getStatusBadge(instance.status)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {instance.status === 'qr_ready' && instance.qrCode && (
          <Alert>
            <QrCode className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>Escaneie o QR Code com seu WhatsApp:</p>
                <div className="flex justify-center">
                  <img 
                    src={`data:image/png;base64,${instance.qrCode}`} 
                    alt="QR Code WhatsApp"
                    className="w-32 h-32 border rounded"
                  />
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          {instance.status === 'disconnected' ? (
            <Button 
              onClick={() => onConnect(instance.id)}
              disabled={isLoading}
              className="flex-1"
            >
              <Power className="w-4 h-4 mr-2" />
              Conectar
            </Button>
          ) : instance.status === 'connected' ? (
            <Button 
              onClick={() => onDisconnect(instance.id)}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              <Power className="w-4 h-4 mr-2" />
              Desconectar
            </Button>
          ) : (
            <Button disabled className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              {getStatusLabel(instance.status)}
            </Button>
          )}
          
          <Button 
            onClick={() => onConfigure(instance)}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <Settings className="w-4 h-4" />
          </Button>
          
          <Button 
            onClick={() => onDelete(instance.id)}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
