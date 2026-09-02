import type { Metadata } from 'next';
import { clubstoneFont, nokieFont } from '@/lib/fonts';
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
    >
      <body className="min-h-screen bg-[#f5e3cd] text-[#18120e] antialiased selection:bg-[#f91814] selection:text-white">
        {children}
      </body>
    </html>
  );
}
