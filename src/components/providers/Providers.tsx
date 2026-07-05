'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        theme="dark"
        richColors
        offset={{ bottom: '96px', right: '16px' }}
        toastOptions={{
          style: {
            background: '#101014',
            border: '1px solid #2E2E37',
            color: '#fff',
          },
        }}
      />
    </SessionProvider>
  );
}
