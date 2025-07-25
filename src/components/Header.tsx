
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { UserProfileModal } from '@/components/UserProfileModal';
import { useState } from 'react';

const NotificationsPanel = ({ onClose }: { onClose: () => void }) => {
  const notifications = [
    {
      id: 1,
      title: 'Novo cliente cadastrado',
      description: 'João Silva se cadastrou no sistema',
      time: '2 min atrás',
      type: 'info'
    },
    {
      id: 2,
      title: 'Workflow executado',
      description: 'Onboarding Automático foi executado com sucesso',
      time: '5 min atrás',
      type: 'success'
    },
    {
      id: 3,
      title: 'Pagamento recebido',
      description: 'R$ 299,90 recebido de Maria Santos',
      time: '10 min atrás',
      type: 'success'
    }
  ];

  return (
    <div className="w-80 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Notificações</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Fechar
        </Button>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div key={notification.id} className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium text-sm">{notification.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {notification.time}
                </p>
              </div>
              <div className={`w-2 h-2 rounded-full mt-1 ${
                notification.type === 'success' ? 'bg-green-500' : 
                notification.type === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
              }`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Header = () => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes, tickets, workflows..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-secondary">
                3
              </Badge>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <NotificationsPanel onClose={() => setShowNotifications(false)} />
          </DialogContent>
        </Dialog>

        <div 
          className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
          onClick={() => setShowProfile(true)}
        >
          <div className="text-right">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
        </div>

        <UserProfileModal 
          open={showProfile} 
          onClose={() => setShowProfile(false)} 
        />
      </div>
    </header>
  );
};
