
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">CRM</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">CRM Inteligente</h2>
            <p className="text-xs text-muted-foreground">n8n + IA</p>
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
