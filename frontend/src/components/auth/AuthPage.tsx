import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4 relative'>
      {/* Theme Toggle in top right corner */}
      <div className='absolute top-4 right-4'>
        <ThemeToggle />
      </div>
      
      <div className='w-full max-w-md'>
        {isLogin ? (
          <LoginForm
            onSwitchToSignup={() => {
              setIsLogin(false);
            }}
          />
        ) : (
          <SignupForm
            onSwitchToLogin={() => {
              setIsLogin(true);
            }}
          />
        )}
      </div>
    </div>
  );
};
