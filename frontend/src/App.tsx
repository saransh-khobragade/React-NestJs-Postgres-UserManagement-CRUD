import './App.css';
import type { ReactElement } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthPage } from '@/components/auth/AuthPage';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Toaster } from '@/components/ui/sonner';

function AppContent(): ReactElement {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-lg'>Loading...</div>
      </div>
    );
  }

  return user !== null ? <Dashboard /> : <AuthPage />;
}

function App(): ReactElement {
  return (
    <AuthProvider>
      <div className='min-h-screen bg-background'>
        <AppContent />
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;
