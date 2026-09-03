'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, FileText, ArrowLeft, ExternalLink } from 'lucide-react';

const LEGAL_TABS = [
  { href: '/terms', label: 'Terms of Service' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/cookies', label: 'Cookie & Telemetry' },
  { href: '/refunds', label: 'Refunds & Cancellation' },
];

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function LegalLayout({
  title,
  subtitle,
  lastUpdated = 'September 2026',
  children,
}: LegalLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F0] py-12 px-6 sm:px-12 select-none">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Top Back Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#A1A1AA] hover:text-[#f91814] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </Link>
          <div className="flex items-center gap-2 font-mono text-xs text-[#71717A]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Legal Document // Nepal Jurisdiction</span>
          </div>
        </div>

        {/* Page Title & Meta */}
        <div className="space-y-3">
          <div className="inline-block px-3 py-1 bg-[#18120e] border border-[#27272A] text-[#f91814] font-mono text-xs font-bold uppercase tracking-widest">
            LEGAL ARCHIVE // REVISION 2026.09
          </div>
          <h1
            className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight"
            style={{ fontFamily: 'var(--font-clubstone), serif' }}
          >
            {title}
          </h1>
          <p
            className="text-sm sm:text-base text-[#A1A1AA] font-mono leading-relaxed max-w-2xl"
            style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
          >
            {subtitle}
          </p>
          <div className="font-mono text-xs text-[#71717A] pt-1">
            Last Reviewed: {lastUpdated} &bull; Governed under the Laws of Nepal
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 border-b-2 border-[#27272A] scrollbar-none">
          {LEGAL_TABS.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all rounded-none border-2 shrink-0 ${
                  isActive
                    ? 'bg-[#f91814] text-white border-[#f91814] shadow-[3px_3px_0px_0px_#ffffff]'
                    : 'bg-[#141414] text-[#A1A1AA] border-[#27272A] hover:text-white hover:border-zinc-500'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Legal Text Content Body */}
        <article className="prose prose-invert max-w-none space-y-8 font-mono text-xs sm:text-sm leading-relaxed text-[#D4D4D8]">
          {children}
        </article>

        {/* Developer & Jurisdiction Footer Stamp */}
        <div className="mt-16 pt-8 border-t-2 border-[#27272A] bg-[#141414] p-6 space-y-3 font-mono text-xs text-[#A1A1AA]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272A] pb-3">
            <span className="text-white font-bold uppercase tracking-wider">
              Platform Engineering &amp; Legal Attribution
            </span>
            <span className="text-[#f91814]">Dharan &bull; Kathmandu Valley</span>
          </div>
          <p className="leading-relaxed">
            The nBites platform, culinary dispatch engine, and telemetry systems are designed, engineered, and maintained by{' '}
            <strong className="text-white">&lt;nantio&gt;</strong>, a software engineering laboratory based in{' '}
            <strong className="text-white">Dharan, Nepal</strong>.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#71717A] pt-1">
            <a
              href="https://nantio.it.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#f91814] underline underline-offset-2 flex items-center gap-1"
            >
              <span>nantio.it.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>&bull;</span>
            <a
              href="mailto:nantio.official@gmail.com"
              className="hover:text-[#f91814] underline underline-offset-2"
            >
              nantio.official@gmail.com
            </a>
            <span>&bull;</span>
            <span>Instagram &amp; TikTok: @nantio.official</span>
            <span>&bull;</span>
            <span>X: @NantioSoftwares</span>
          </div>
        </div>

      </div>
    </div>
  );
}
