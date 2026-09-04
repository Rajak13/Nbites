'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ShoppingBag, User as UserIcon } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useTheme } from '@/components/common/ThemeProvider';

interface HeaderProps {
  theme?: 'red' | 'cream' | 'dark';
  className?: string;
  isHero?: boolean;
}

export function Header({ theme, className = '', isHero = false }: HeaderProps) {
  const { theme: activeContextTheme } = useTheme();
  // If explicitly passed (e.g. hero slide changes), use that; else follow active context theme
  const resolvedTheme = theme || activeContextTheme;
  const isLightText = resolvedTheme === 'red' || resolvedTheme === 'dark';

  const setIsOpen = useCartStore((state) => state.setIsOpen);
  const itemCount = useCartStore((state) => state.getItemCount());

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);

  const isAuthenticated = Boolean(token && user);

  const containerClass = isHero
    ? 'absolute top-0 left-0 right-0 w-full px-4 sm:px-6 md:px-12 pt-6 sm:pt-8 pb-4 z-50 flex items-center justify-between pointer-events-auto bg-transparent border-b border-transparent transition-colors duration-300'
    : 'sticky top-0 left-0 right-0 w-full px-4 sm:px-6 md:px-12 py-3.5 sm:py-4 z-50 flex items-center justify-between pointer-events-auto bg-theme-header backdrop-blur-md border-b border-theme-border/50 shadow-xs transition-colors duration-300';

  return (
    <header className={`${containerClass} ${className}`}>
      {/* Left: Brand Logo */}
      <Link href="/" className="group flex items-center gap-2 select-none shrink-0">
        <span
          className={`text-2xl sm:text-3xl font-bold tracking-[-1.5px] transition-colors duration-300 ${
            isLightText ? 'text-[#F5F5F0]' : 'text-[#18120e]'
          }`}
          style={{ fontFamily: 'var(--font-clubstone), "Inter Display", sans-serif' }}
        >
          [nBites]
        </span>
      </Link>

      {/* Center: Desktop Navigation Links */}
      <nav
        className="hidden md:flex items-center gap-6 lg:gap-10 text-[14px] lg:text-[15px] font-bold tracking-[0.06em] transition-colors duration-300"
        style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
      >
        <Link
          href="/discovery"
          className={`uppercase transition-colors duration-200 ${
            isLightText
              ? 'text-[#F5F5F0] hover:text-[#f91814]'
              : 'text-[#18120e] hover:text-[#f91814]'
          }`}
        >
          DISCOVERY
        </Link>
        <Link
          href="/kds"
          className={`uppercase transition-colors duration-200 ${
            isLightText
              ? 'text-[#F5F5F0] hover:text-[#f91814]'
              : 'text-[#18120e] hover:text-[#f91814]'
          }`}
        >
          KITCHEN KDS
        </Link>
        <Link
          href="/order-tracking/ORD-KTM-8942"
          className={`uppercase transition-colors duration-200 ${
            isLightText
              ? 'text-[#F5F5F0] hover:text-[#f91814]'
              : 'text-[#18120e] hover:text-[#f91814]'
          }`}
        >
          LIVE TRACKING
        </Link>
        <Link
          href="/checkout"
          className={`uppercase transition-colors duration-200 ${
            isLightText
              ? 'text-[#F5F5F0] hover:text-[#f91814]'
              : 'text-[#18120e] hover:text-[#f91814]'
          }`}
        >
          CHECKOUT
        </Link>
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Compact Theme Dropdown */}
        <ThemeToggle />

        {/* User Profile / Sign In */}
        {isAuthenticated ? (
          <Link
            href="/profile"
            aria-label="User Profile"
            className={`inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 h-9 border-2 font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-150 rounded-none cursor-pointer ${
              isLightText
                ? 'border-white text-[#F5F5F0] hover:bg-white hover:text-[#0B0B0B]'
                : 'border-[#18120e] text-[#18120e] hover:bg-[#18120e] hover:text-white'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5 text-[#f91814]" />
            <span className="hidden sm:inline max-w-[80px] truncate">
              {user?.name?.split(' ')[0] || 'ACCOUNT'}
            </span>
          </Link>
        ) : (
          <button
            onClick={() => openAuthModal()}
            className={`inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 h-9 border-2 font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-150 rounded-none cursor-pointer ${
              isLightText
                ? 'border-white text-[#F5F5F0] hover:bg-white hover:text-[#0B0B0B]'
                : 'border-[#18120e] text-[#18120e] hover:bg-[#18120e] hover:text-white'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SIGN IN</span>
          </button>
        )}

        {/* Cart Drawer Trigger */}
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open cart ticket"
          className={`relative inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 border-2 transition-all duration-150 rounded-none cursor-pointer ${
            isLightText
              ? 'border-white text-[#F5F5F0] hover:bg-white hover:text-[#0B0B0B]'
              : 'border-[#18120e] text-[#18120e] hover:bg-[#18120e] hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 bg-[#f91814] text-white border border-[#0B0B0B] font-mono text-[9px] sm:text-[10px] font-black flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>

        {/* CTA Button */}
        <Link href="/discovery" className="hidden xs:inline-block">
          <button
            className={`inline-flex items-center gap-1.5 px-3 sm:px-[16px] py-[8px] sm:py-[9px] text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-150 rounded-none cursor-pointer ${
              isLightText
                ? 'bg-[#f91814] text-white border-2 border-[#f91814] hover:bg-white hover:text-[#18120e] hover:shadow-[3px_3px_0px_0px_#ffffff]'
                : 'bg-[#f91814] text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_0px_#18120e]'
            } active:translate-x-0 active:translate-y-0 active:shadow-none`}
            style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
          >
            <span>ORDER</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>
    </header>
  );
}
