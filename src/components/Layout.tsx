
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';

export const Layout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-primary/5">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
