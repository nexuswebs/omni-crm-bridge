import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Login } from '@/pages/Login';
import { Index } from '@/pages/Index';
import { Dashboard } from '@/pages/Dashboard';
import { Customers } from '@/pages/Customers';
import { WhatsApp } from '@/pages/WhatsApp';
import { Workflows } from '@/pages/Workflows';
import { Agents } from '@/pages/Agents';
import { Payments } from '@/pages/Payments';
import { Settings } from '@/pages/Settings';
import { NotFound } from '@/pages/NotFound';
import { AdminVerify } from '@/pages/AdminVerify';
import { ErrorBoundary } from 'react-error-boundary';

import Reports from '@/pages/Reports';

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="crm-theme">
            <Toaster />
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin-verify" element={<AdminVerify />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <Layout>
                          <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/customers" element={<Customers />} />
                            <Route path="/whatsapp" element={<WhatsApp />} />
                            <Route path="/workflows" element={<Workflows />} />
                            <Route path="/agents" element={<Agents />} />
                            <Route path="/payments" element={<Payments />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </Layout>
                      </SidebarProvider>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </ErrorBoundary>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
