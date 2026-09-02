import * as React from 'react';
import { Header } from '@/components/hero/Header';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t-2 border-[#27272A] bg-[#0B0B0B] py-12 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="font-editorial text-xl font-bold tracking-tight text-[#F5F5F0]">
              NBITES
            </span>
            <p className="text-xs text-[#71717A] font-mono mt-1">
              Real-time culinary dispatch &bull; Kathmandu &bull; Lalitpur &bull; Bhaktapur
            </p>
          </div>
          <div className="flex items-center gap-6 font-mono text-xs text-[#A1A1AA] uppercase">
            <span>Kathmandu HQ: Lazimpat</span>
            <span>Support: +977 1 4420000</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
