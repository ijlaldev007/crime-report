'use client';

import { Toaster } from 'sonner';
import { useTheme } from 'next-themes';

export function ToastProvider() {
  const { theme } = useTheme();
  
  return (
    <Toaster
      position="top-right"
      expand={true}
      richColors
      theme={theme as 'light' | 'dark'}
    />
  );
}