
import { Home, Users, Zap, Bot, CreditCard, MessageSquare, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
  },
  {
    title: 'Clientes',
    url: '/customers',
    icon: Users,
  },
  {
    title: 'Workflows',
    url: '/workflows',
    icon: Zap,
  },
  {
    title: 'Agentes',
    url: '/agents',
    icon: Bot,
  },
  {
    title: 'WhatsApp',
    url: '/whatsapp',
    icon: MessageSquare,
  },
  {
    title: 'Pagamentos',
    url: '/payments',
    icon: CreditCard,
  },
  {
    title: 'Configurações',
    url: '/settings',
    icon: Settings,
  },
];

export const AppSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center">
            <img 
              src="/lovable-uploads/c6d44030-5c90-4b0a-a929-4224d423ff2a.png" 
              alt="Nexus Agents Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="font-bold text-lg">Nexus Agents</h2>
            <p className="text-xs text-muted-foreground">Automating Tomorrow</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.url}
              >
                <Link to={item.url} className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start gap-3"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
