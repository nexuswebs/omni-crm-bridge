
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Default imports
import Login from '@/pages/Login';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Customers from '@/pages/Customers';
import WhatsApp from '@/pages/WhatsApp';
import Workflows from '@/pages/Workflows';
import Agents from '@/pages/Agents';
import Payments from '@/pages/Payments';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import AdminVerify from '@/pages/AdminVerify';
import Reports from '@/pages/Reports';

// Create a query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="crm-theme">
            <Toaster />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-verify" element={<AdminVerify />} />
              
              {/* Protected routes with layout */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/customers" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Layout>
                      <Customers />
                    </Layout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/whatsapp" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Layout>
                      <WhatsApp />
                    </Layout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/workflows" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Layout>
                      <Workflows />
                    </Layout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/agents" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Layout>
                      <Agents />
                    </Layout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/payments" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Layout>
                      <Payments />
                    </Layout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/reports" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Layout>
                      <Reports />
                    </Layout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Layout>
                      <Settings />
                    </Layout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
