'use client';

import * as React from 'react';
import { Sun, Moon, ChevronDown } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  variant?: 'header' | 'standalone';
}

export function ThemeToggle({ variant = 'header' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme preference"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 border-2 text-[10px] font-mono uppercase tracking-wider font-bold transition-all duration-150 rounded-none cursor-pointer ${
          theme === 'dark'
            ? 'bg-[#141414] text-[#F5F5F0] border-[#27272A] hover:border-white'
            : 'bg-[#EDECEA] text-[#0B0B0B] border-[#C8C6C1] hover:border-[#0B0B0B]'
        }`}
      >
        {theme === 'dark' ? (
          <Moon className="w-3 h-3 text-amber-400 shrink-0" />
        ) : (
          <Sun className="w-3 h-3 text-[#f91814] shrink-0" />
        )}
        <span className="hidden sm:inline">
          {theme === 'dark' ? 'DARK' : 'CANVAS'}
        </span>
        <ChevronDown className="w-2.5 h-2.5 opacity-60 shrink-0" />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-1 w-32 border-2 z-50 p-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] ${
            theme === 'dark'
              ? 'bg-[#141414] border-[#27272A] text-[#F5F5F0]'
              : 'bg-[#F5F5F0] border-[#0B0B0B] text-[#0B0B0B]'
          }`}
        >
          <button
            onClick={() => {
              setTheme('cream');
              setIsOpen(false);
            }}
            className={`w-full text-left flex items-center justify-between px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider cursor-pointer transition-colors ${
              theme === 'cream'
                ? 'bg-[#f91814] text-white font-bold'
                : 'hover:bg-zinc-500/20'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Sun className="w-3 h-3" />
              CANVAS
            </span>
            {theme === 'cream' && <span>&bull;</span>}
          </button>

          <button
            onClick={() => {
              setTheme('dark');
              setIsOpen(false);
            }}
            className={`w-full text-left flex items-center justify-between px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider cursor-pointer transition-colors mt-0.5 ${
              theme === 'dark'
                ? 'bg-[#f91814] text-white font-bold'
                : 'hover:bg-zinc-500/20'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Moon className="w-3 h-3" />
              DARK
            </span>
            {theme === 'dark' && <span>&bull;</span>}
          </button>
        </div>
      )}
    </div>
  );
}
