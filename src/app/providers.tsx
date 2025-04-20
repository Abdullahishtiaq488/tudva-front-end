'use client';

import { Suspense, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/useNotificationContext';
import FallbackLoading from '@/components/FallbackLoading';
import Aos from 'aos';
import 'aos/dist/aos.css';

// Dynamically import LayoutProvider to avoid SSR issues
const LayoutProvider = dynamic(
  () => import('@/context/useLayoutContext').then(mod => mod.LayoutProvider),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    Aos.init();

    // Force remove splash screen after a short delay
    const timer = setTimeout(() => {
      const splashScreen = document.querySelector('#splash-screen');
      if (splashScreen) {
        splashScreen.classList.add('remove');

        // As a fallback, completely hide it after animation
        setTimeout(() => {
          if (splashScreen) {
            splashScreen.style.display = 'none';
          }
        }, 1000);
      }
    }, 500);

    // Original logic
    if (document) {
      const e = document.querySelector('#__next_splash');
      if (e?.hasChildNodes()) {
        document.querySelector('#splash-screen')?.classList.add('remove');
      }
      e?.addEventListener('DOMNodeInserted', () => {
        document.querySelector('#splash-screen')?.classList.add('remove');
      });
    }

    return () => clearTimeout(timer);
  }, []);

  return (
    <LayoutProvider>
      <AuthProvider>
        <NotificationProvider>
          <Suspense fallback={<FallbackLoading />}>
            {children}
            <Toaster position="top-right" />
          </Suspense>
        </NotificationProvider>
      </AuthProvider>
    </LayoutProvider>
  );
}
