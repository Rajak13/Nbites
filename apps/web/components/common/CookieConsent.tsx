'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShieldCheck, X } from 'lucide-react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // Check if user has already made a choice
    try {
      const storedConsent = localStorage.getItem('nbites_cookie_consent');
      if (!storedConsent) {
        // Small delay so it doesn't jarringly pop on initial render
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Fallback if localStorage is restricted
      setIsVisible(true);
    }
  }, []);

  const handleAccept = (choice: 'all' | 'essential') => {
    try {
      localStorage.setItem('nbites_cookie_consent', choice);
    } catch {
      // ignore
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie and telemetry consent"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] bg-[#0B0B0B] text-[#F5F5F0] border-2 border-[#27272A] shadow-[6px_6px_0px_0px_#f91814] p-5 sm:p-6 animate-fadeIn select-none"
    >
      {/* Top Header Tag */}
      <div className="flex items-center justify-between pb-3 border-b border-[#27272A] mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#f91814] font-bold">
            TELEMETRY // COOKIE NOTICE
          </span>
        </div>
        <button
          onClick={() => handleAccept('essential')}
          aria-label="Close cookie banner"
          className="text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Copy */}
      <p
        className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-4"
        style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
      >
        nBites stores essential session cookies to preserve your cart, maintain kitchen KDS telemetry, and calculate Valley delivery radii. We do not sell your personal data.
      </p>

      {/* Links & Sub-info */}
      <div className="flex items-center gap-3 font-mono text-[11px] text-[#71717A] mb-5">
        <Link href="/privacy" className="hover:text-[#f91814] underline underline-offset-2 transition-colors">
          Privacy Policy
        </Link>
        <span>&bull;</span>
        <Link href="/terms" className="hover:text-[#f91814] underline underline-offset-2 transition-colors">
          Terms of Service
        </Link>
      </div>

      {/* Brutalist Button Pair */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <button
          onClick={() => handleAccept('all')}
          className="flex-1 bg-[#f91814] text-white border-2 border-[#f91814] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider rounded-none hover:bg-[#d81410] hover:shadow-[3px_3px_0px_0px_#ffffff] transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 text-center"
        >
          ACCEPT ALL COOKIES
        </button>

        <button
          onClick={() => handleAccept('essential')}
          className="bg-transparent text-[#F5F5F0] border-2 border-[#27272A] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider rounded-none hover:bg-white hover:text-[#0B0B0B] hover:border-white transition-all cursor-pointer text-center"
        >
          ESSENTIAL ONLY
        </button>
      </div>

      {/* Trust Seal */}
      <div className="flex items-center gap-1.5 pt-3 mt-3 border-t border-[#1a1a1a] text-[10px] font-mono text-[#52525B]">
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        <span>Compliant with Nepal Digital Privacy Guidelines</span>
      </div>
    </aside>
  );
}
