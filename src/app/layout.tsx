import dynamic from "next/dynamic";
import './globals.css';
import Image from "next/image";
import FallbackLoading from "@/components/FallbackLoading";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";
import Layout from "./components/layout/page";
import { Toaster } from "react-hot-toast";
import logoDark from '@/assets/images/logo.svg';
import 'aos/dist/aos.css';
import '@/assets/scss/style.scss';
import Script from 'next/script';
import type { Metadata } from 'next';
import { saira, merienda } from './fonts';

export const metadata: Metadata = {
  title: {
    template: '%s | Busnet LMS',
    default: "Busnet LMS"
  },
  description: "Busnet Learning Management System"
};

const AppProvidersWrapper = dynamic(() => import('@/components/wrappers/AppProvidersWrapper'));

const splashScreenStyles = `
#splash-screen {
  position: fixed;
  top: 50%;
  left: 50%;
  background: white;
  display: flex;
  height: 100%;
  width: 100%;
  transform: translate(-50%, -50%);
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 1;
  transition: all 0.5s ease;
  overflow: hidden;
}

#splash-screen.remove {
  animation: fadeout 0.3s forwards;
  z-index: 0;
}

@keyframes fadeout {
  to {
    opacity: 0;
    visibility: hidden;
    display: none;
  }
}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${saira.className} ${merienda.variable}`}>
      <head>
        <style suppressHydrationWarning>{splashScreenStyles}</style>
      </head>
      <body>
        <div id="splash-screen">
          <Image alt="Logo" width={355} height={83} src={logoDark} style={{
            height: '10%',
            width: 'auto'
          }} priority />
        </div>

        <NextTopLoader color="#4697ce" showSpinner={false} />
        <div id="__next_splash">
          <Toaster position="top-center" toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#333',
              zIndex: 9999,
            },
            success: {
              style: {
                background: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #6EE7B7',
                zIndex: 9999,
              },
            },
            error: {
              style: {
                background: '#FEF2F2',
                color: '#B91C1C',
                border: '1px solid #FECACA',
                zIndex: 9999,
              },
            },
          }} />
          <AppProvidersWrapper>
            <Suspense fallback={<FallbackLoading />}>
              <Layout>
                {children}
              </Layout>
            </Suspense>
          </AppProvidersWrapper>
        </div>
        {/* Mock system initialization removed */}
      </body>
    </html>
  );
}
