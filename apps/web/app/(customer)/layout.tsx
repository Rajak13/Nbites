'use client';

import * as React from 'react';
import { Header } from '@/components/hero/Header';
import { useTheme } from '@/components/common/ThemeProvider';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex flex-col transition-colors duration-200">
      <Header theme={theme} />
      <main className="flex-1">{children}</main>
      <footer className="border-t-2 border-theme-border bg-theme-surface py-12 px-6 transition-colors duration-200">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span
              className="text-2xl font-bold tracking-tight text-theme-text"
              style={{ fontFamily: 'var(--font-clubstone)' }}
            >
              [nBites]
            </span>
            <p className="text-xs text-theme-muted font-mono mt-1">
              Direct artisan kitchen dispatch &bull; Across Nepal
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-theme-muted uppercase">
            <span>Kathmandu &bull; Pokhara &bull; Chitwan &bull; Across Nepal</span>
            <span>Support: +977 1 4420000</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
