import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface BrandLogoProps {
  className?: string;
  showSubtitle?: boolean;
}

export function BrandLogo({ className, showSubtitle = true }: BrandLogoProps) {
  return (
    <Link href="/" className={cn('inline-flex items-center gap-3 group select-none', className)}>
      <div className="flex h-10 w-10 items-center justify-center bg-[#F97316] text-black font-black text-xl border-2 border-black group-hover:scale-105 transition-transform shadow-[2px_2px_0px_0px_#000000]">
        n
      </div>
      <div>
        <span className="font-editorial text-2xl font-bold tracking-tight text-[#F5F5F0] block leading-none">
          NBITES
        </span>
        {showSubtitle && (
          <span className="text-[10px] tracking-[0.2em] font-mono text-[#F97316] uppercase block mt-0.5">
            Kathmandu Valley
          </span>
        )}
      </div>
    </Link>
  );
}
