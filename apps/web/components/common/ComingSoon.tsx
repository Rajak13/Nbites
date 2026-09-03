'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';

interface ComingSoonProps {
  moduleCode: string;
  moduleName: string;
  description?: string;
}

export function ComingSoon({
  moduleCode,
  moduleName,
  description = 'This module is currently being handcrafted to match our editorial brutalist standard. Firing soon across Nepal.',
}: ComingSoonProps) {
  return (
    <div className="min-h-[80vh] bg-[#0B0B0B] text-[#F5F5F0] flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden">
      
      {/* Background Decorative Grid Lines */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #27272A 1px, transparent 1px), linear-gradient(to bottom, #27272A 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 max-w-xl mx-auto space-y-6">
        
        {/* Module Code Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#18120e] border border-[#27272A]">
          <Clock className="w-3.5 h-3.5 text-[#f91814] animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#f91814]">
            {moduleCode} // IN THE WORKS
          </span>
        </div>

        {/* Big Clubstone Headline */}
        <h1
          className="text-5xl sm:text-7xl font-black tracking-tight text-white uppercase leading-[0.9]"
          style={{ fontFamily: 'var(--font-clubstone), serif' }}
        >
          {moduleName}
          <br />
          <span className="text-[#f91814]">COMING SOON.</span>
        </h1>

        {/* Body Description */}
        <p
          className="font-mono text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto leading-relaxed"
          style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
        >
          {description}
        </p>

        {/* Action Button */}
        <div className="pt-4">
          <Link href="/">
            <button className="inline-flex items-center gap-2.5 bg-[#f91814] text-white border-2 border-[#f91814] px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider rounded-none hover:bg-white hover:text-[#0B0B0B] hover:shadow-[4px_4px_0px_0px_#ffffff] transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5">
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO HOMEPAGE</span>
            </button>
          </Link>
        </div>

        {/* Footer Credit */}
        <div className="pt-8 text-[11px] font-mono text-[#52525B]">
          Engineered with craft by &lt;nantio&gt; &bull; Dharan, Nepal
        </div>

      </div>
    </div>
  );
}
