import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import StartPage from './pages/StartPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import BankInfo from './pages/BankInfo';
import ChallanUpload from './pages/ChallanUpload';
import Scholarship from './pages/Scholarship';
import Transactions from './pages/Transactions';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/start" replace />} />
          <Route path="/start" element={<StartPage />} />
          <Route path="/dashboard" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          <Route path="/profile" element={
            <Layout>
              <Profile />
            </Layout>
          } />
          <Route path="/bank-info" element={
            <Layout>
              <BankInfo />
            </Layout>
          } />
          <Route path="/upload" element={
            <Layout>
              <ChallanUpload />
            </Layout>
          } />
          <Route path="/scholarship" element={
            <Layout>
              <Scholarship />
            </Layout>
          } />
          <Route path="/transactions" element={
            <Layout>
              <Transactions />
            </Layout>
          } />
          <Route path="/notifications" element={
            <Layout>
              <Notifications />
            </Layout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;