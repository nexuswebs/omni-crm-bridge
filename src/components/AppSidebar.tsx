
import { Home, Users, Zap, Bot, CreditCard, MessageSquare, Settings, LogOut, Activity, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
    section: 'main'
  },
  {
    title: 'Clientes',
    url: '/customers',
    icon: Users,
    section: 'main'
  },
  {
    title: 'WhatsApp',
    url: '/whatsapp',
    icon: MessageSquare,
    section: 'communications',
    badge: '2'
  },
  {
    title: 'Workflows',
    url: '/workflows',
    icon: Zap,
    section: 'automation'
  },
  {
    title: 'Agentes',
    url: '/agents',
    icon: Bot,
    section: 'automation'
  },
  {
    title: 'Pagamentos',
    url: '/payments',
    icon: CreditCard,
    section: 'finance'
  },
  {
    title: 'Relatórios',
    url: '/reports',
    icon: BarChart3,
    section: 'analytics'
  },
  {
    title: 'Configurações',
    url: '/settings',
    icon: Settings,
    section: 'system'
  },
];

const sections = {
  main: 'Principal',
  communications: 'Comunicação',
  automation: 'Automação',
  finance: 'Financeiro',
  analytics: 'Análises',
  system: 'Sistema'
};

export const AppSidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <Sidebar className="border-r border-border/40 bg-card/50 backdrop-blur-sm">
      <SidebarHeader className="p-6 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              CRM Inteligente
            </h2>
            <p className="text-xs text-muted-foreground">Nexus Agents</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4">
        {Object.entries(groupedItems).map(([sectionKey, items]) => (
          <SidebarGroup key={sectionKey} className="mb-4">
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {sections[sectionKey as keyof typeof sections]}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      className="group relative"
                    >
                      <Link 
                        to={item.url} 
                        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent/50"
                      >
                        <item.icon className="w-5 h-5 transition-colors" />
                        <span className="font-medium">{item.title}</span>
                        {item.badge && (
                          <Badge 
                            variant="secondary" 
                            className="ml-auto h-5 px-2 text-xs bg-primary/10 text-primary border-primary/20"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-border/40">
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary-foreground">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="w-4 h-4" />
          Sair do Sistema
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
