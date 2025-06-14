
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

export const Header = () => {
  const { user, logout } = useAuth();

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
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-secondary">
            3
          </Badge>
        </Button>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="rounded-full"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
