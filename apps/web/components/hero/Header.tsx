'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  theme?: 'red' | 'cream' | 'dark';
}

export function Header({ theme = 'cream' }: HeaderProps) {
  const isLightText = theme === 'red' || theme === 'dark';

  return (
    <header className="absolute top-0 left-0 right-0 w-full px-6 md:px-12 pt-8 pb-4 z-50 flex items-center justify-between pointer-events-auto transition-colors duration-500">
      {/* Left: Brand Logo */}
      <Link href="/" className="group flex items-center gap-2 select-none">
        <span
          className={`text-2xl sm:text-3xl font-bold tracking-[-1.5px] transition-colors duration-500 ${
            isLightText ? 'text-white' : 'text-[#18120e]'
          }`}
          style={{ fontFamily: 'var(--font-clubstone), "Inter Display", sans-serif' }}
        >
          [nBites]
        </span>
      </Link>

      {/* Center: Desktop Navigation Links (Dynamic Text Color) */}
      <nav
        className="hidden md:flex items-center gap-8 lg:gap-12 text-[15px] font-bold tracking-[0.06em] transition-colors duration-500"
        style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
      >
        <Link
          href="#discovery"
          className={`uppercase transition-colors duration-300 ${
            isLightText
              ? 'text-white hover:text-zinc-200'
              : 'text-[#18120e] hover:text-[#f91814]'
          }`}
        >
          DISCOVERY
        </Link>
        <Link
          href="#kds"
          className={`uppercase transition-colors duration-300 ${
            isLightText
              ? 'text-white hover:text-zinc-200'
              : 'text-[#18120e] hover:text-[#f91814]'
          }`}
        >
          KITCHEN KDS
        </Link>
        <Link
          href="#dispatch-api"
          className={`uppercase transition-colors duration-300 ${
            isLightText
              ? 'text-white hover:text-zinc-200'
              : 'text-[#18120e] hover:text-[#f91814]'
          }`}
        >
          DISPATCH API
        </Link>
        <Link
          href="#about"
          className={`uppercase transition-colors duration-300 ${
            isLightText
              ? 'text-white hover:text-zinc-200'
              : 'text-[#18120e] hover:text-[#f91814]'
          }`}
        >
          ABOUT
        </Link>
      </nav>

      {/* Right: CTA Button */}
      <Link href="#order">
        <button
          className={`inline-flex items-center gap-2 px-[18px] py-[10px] text-sm font-bold uppercase tracking-wider transition-all duration-150 rounded-none cursor-pointer ${
            isLightText
              ? 'bg-[#f91814] text-white border-2 border-[#f91814] hover:bg-white hover:text-[#18120e] hover:shadow-[4px_4px_0px_0px_#ffffff]'
              : 'bg-[#f91814] text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#18120e]'
          } active:translate-x-0 active:translate-y-0 active:shadow-none`}
          style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
        >
          <span>ORDER NOW</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </Link>
    </header>
  );
}
