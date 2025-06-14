
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: '📊',
    badge: null
  },
  {
    title: 'Clientes',
    url: '/customers',
    icon: '👥',
    badge: '1.2k'
  },
  {
    title: 'Workflows',
    url: '/workflows',
    icon: '⚡',
    badge: 'n8n'
  },
  {
    title: 'Agentes',
    url: '/agents',
    icon: '🤖',
    badge: 'IA'
  },
  {
    title: 'WhatsApp',
    url: '/whatsapp',
    icon: '💬',
    badge: 'API'
  },
  {
    title: 'Pagamentos',
    url: '/payments',
    icon: '💳',
    badge: null
  },
  {
    title: 'Configurações',
    url: '/settings',
    icon: '⚙️',
    badge: null
  }
];

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar className={`${collapsed ? 'w-16' : 'w-64'} border-r border-sidebar-border bg-sidebar`} collapsible>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
            CRM
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">SmartCRM</h1>
              <p className="text-xs text-sidebar-foreground/70">Sistema Inteligente</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">
            {!collapsed && 'Menu Principal'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive(item.url)
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm'
                          : 'hover:bg-sidebar-accent/50 text-sidebar-foreground hover:text-sidebar-accent-foreground'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="p-2">
        <SidebarTrigger className="w-full" />
      </div>
    </Sidebar>
  );
}
