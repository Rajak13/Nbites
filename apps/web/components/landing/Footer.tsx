'use client';

import * as React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-[#0B0B0B] text-[#F5F5F0] relative overflow-hidden">
      {/* 1. Animated Checkered Ribbon at the very top */}
      <div className="checkerboard-ribbon" />

      {/* 2. Main Footer Body */}
      <div className="py-16 md:py-20 px-6 md:px-12 max-w-[1440px] mx-auto">
        {/* Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block group select-none"
            >
              <span
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F0] group-hover:text-[#f91814] transition-colors duration-200"
                style={{ fontFamily: 'var(--font-clubstone), "Inter Display", sans-serif' }}
              >
                [nBites]
              </span>
            </Link>
            <p className="font-mono text-sm text-[#A1A1AA] leading-relaxed max-w-xs">
              Hyper-local culinary logistics engine with synchronized kitchen telemetry.
            </p>
            <div className="font-mono text-xs text-[#71717A] tracking-wider uppercase pt-2">
              Nepal
            </div>
          </div>

          {/* Column 2: Navigate */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#f91814]">
              NAVIGATE
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/discovery"
                  className="text-base text-[#F5F5F0] hover:text-[#f91814] transition-colors duration-200 block"
                  style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
                >
                  Discovery Index
                </Link>
              </li>
              <li>
                <Link
                  href="/kds"
                  className="text-base text-[#F5F5F0] hover:text-[#f91814] transition-colors duration-200 block"
                  style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
                >
                  Kitchen KDS Board
                </Link>
              </li>
              <li>
                <Link
                  href="/order-tracking/ORD-NP-8942"
                  className="text-base text-[#F5F5F0] hover:text-[#f91814] transition-colors duration-200 block"
                  style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
                >
                  Live Order Tracking
                </Link>
              </li>
              <li>
                <Link
                  href="/checkout"
                  className="text-base text-[#F5F5F0] hover:text-[#f91814] transition-colors duration-200 block"
                  style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
                >
                  Editorial Checkout
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-base text-[#F5F5F0] hover:text-[#f91814] transition-colors duration-200 block"
                  style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
                >
                  Merchant & Rider Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Policies */}
          <div className="space-y-4" id="policies">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#f91814]">
              LEGAL & POLICIES
            </h4>
            <ul className="space-y-2.5 font-mono text-sm text-[#A1A1AA]">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[#F5F5F0] hover:text-[#f91814] transition-colors duration-200 block"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#F5F5F0] hover:text-[#f91814] transition-colors duration-200 block"
                >
                  Privacy & Data Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-[#F5F5F0] hover:text-[#f91814] transition-colors duration-200 block"
                >
                  Cookie & Telemetry Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refunds"
                  className="hover:text-[#F5F5F0] hover:text-[#f91814] transition-colors duration-200 block"
                >
                  Cancellation & Refund Rules
                </Link>
              </li>
              <li>
                <Link
                  href="/terms#merchant-agreement"
                  className="hover:text-[#F5F5F0] hover:text-[#f91814] transition-colors duration-200 block"
                >
                  Merchant Service Agreement
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Developed by <nantio> */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#f91814]">
                DEVELOPED BY
              </span>
              <span className="px-1.5 py-0.5 bg-[#18120e] border border-[#27272A] font-mono text-[10px] text-[#f91814] font-bold">
                &lt;nantio&gt;
              </span>
            </div>
            
            <p className="font-mono text-xs text-[#A1A1AA] leading-relaxed">
              Software engineering & design laboratory based in <span className="text-[#F5F5F0] font-semibold">Dharan, Nepal</span>.
            </p>

            <ul className="space-y-2 font-mono text-xs text-[#A1A1AA]">
              <li>
                <span className="text-[#71717A]">Web: </span>
                <a
                  href="https://nantio.it.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F5F5F0] hover:text-[#f91814] underline underline-offset-2 transition-colors duration-200"
                >
                  nantio.it.com
                </a>
              </li>
              <li>
                <span className="text-[#71717A]">Email: </span>
                <a
                  href="mailto:nantio.official@gmail.com"
                  className="hover:text-[#f91814] transition-colors duration-200"
                >
                  nantio.official@gmail.com
                </a>
              </li>
            </ul>

            {/* Nantio Social Handles */}
            <div className="pt-2">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#71717A] mb-2">
                Nantio Channels
              </div>
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                <a
                  href="https://instagram.com/nantio.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-[#141414] border border-[#27272A] text-[#F5F5F0] hover:border-[#f91814] hover:text-[#f91814] transition-all duration-150 rounded-none"
                >
                  IG @nantio.official
                </a>
                <a
                  href="https://tiktok.com/@nantio.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-[#141414] border border-[#27272A] text-[#F5F5F0] hover:border-[#f91814] hover:text-[#f91814] transition-all duration-150 rounded-none"
                >
                  TikTok @nantio.official
                </a>
                <a
                  href="https://x.com/NantioSoftwares"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-[#141414] border border-[#27272A] text-[#F5F5F0] hover:border-[#f91814] hover:text-[#f91814] transition-all duration-150 rounded-none"
                >
                  X @NantioSoftwares
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* 3. Bottom Bar */}
        <div className="mt-16 md:mt-20 pt-6 border-t border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="font-mono text-xs text-[#71717A]">
            &copy; {new Date().getFullYear()} nBites. Engineered with craft by{' '}
            <a
              href="https://nantio.it.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F5F5F0] hover:text-[#f91814] underline underline-offset-2 transition-colors"
            >
              &lt;nantio&gt;
            </a>{' '}
            (Dharan, Nepal).
          </div>
          <div className="flex items-center gap-4 font-mono text-xs text-[#71717A]">
            <span>Nepal Standard Time (UTC+5:45)</span>
            <span>&bull;</span>
            <span className="text-emerald-400 font-bold">KDS LIVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
