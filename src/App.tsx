
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Layout } from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Customers from '@/pages/Customers';
import WhatsApp from '@/pages/WhatsApp';
import Workflows from '@/pages/Workflows';
import Agents from '@/pages/Agents';
import Payments from '@/pages/Payments';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import NotFound from '@/pages/NotFound';
import { Toaster } from "@/components/ui/toaster"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import AdminVerify from '@/pages/AdminVerify';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/admin-verify" element={<AdminVerify />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route index element={<Dashboard />} />
                      <Route path="customers" element={<Customers />} />
                      <Route path="whatsapp" element={<WhatsApp />} />
                      <Route path="workflows" element={<Workflows />} />
                      <Route path="agents" element={<Agents />} />
                      <Route path="payments" element={<Payments />} />
                      <Route path="settings" element={<Settings />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
