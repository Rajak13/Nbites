import type { Metadata } from 'next';
import { clubstoneFont, nokieFont } from '@/lib/fonts';
import { SmoothScrollProvider } from '@/components/common/SmoothScrollProvider';
import { CookieConsent } from '@/components/common/CookieConsent';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { OtpModal } from '@/components/auth/OtpModal';
import './globals.css';

export const metadata: Metadata = {
  title: 'nBites | Hyper-Local Culinary Logistics Engine',
  description:
    'Ultra-fast food dispatch powered by real-time kitchen telemetry, automated order routing, and instant Nepal wallet payouts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${clubstoneFont.variable} ${nokieFont.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#f5e3cd] text-[#18120e] antialiased selection:bg-[#f91814] selection:text-white">
        <ThemeProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
          <CookieConsent />
          <CartDrawer />
          <OtpModal />
        </ThemeProvider>
      </body>
    </html>
  );
}


