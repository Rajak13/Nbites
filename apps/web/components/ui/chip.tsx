import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const chipVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors border select-none',
  {
    variants: {
      variant: {
        live: 'bg-emerald-950/70 text-emerald-400 border-emerald-500/40',
        active: 'bg-orange-950/70 text-orange-400 border-orange-500/40',
        warning: 'bg-amber-950/70 text-amber-400 border-amber-500/40',
        neutral: 'bg-zinc-900 text-zinc-300 border-zinc-700',
        outline: 'bg-transparent text-zinc-400 border-zinc-700',
        brand: 'bg-[#F97316]/15 text-[#F97316] border-[#F97316]/50',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {
  pulse?: boolean;
}

export function Chip({
  className,
  variant,
  pulse = false,
  children,
  ...props
}: ChipProps) {
  return (
    <span className={cn(chipVariants({ variant, className }))} {...props}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              variant === 'live' && 'bg-emerald-400',
              variant === 'active' && 'bg-orange-400',
              variant === 'warning' && 'bg-amber-400',
              variant === 'brand' && 'bg-[#F97316]',
              variant === 'neutral' && 'bg-zinc-400'
            )}
          />
          <span
            className={cn(
              'relative inline-flex h-2 w-2 rounded-full',
              variant === 'live' && 'bg-emerald-500',
              variant === 'active' && 'bg-orange-500',
              variant === 'warning' && 'bg-amber-500',
              variant === 'brand' && 'bg-[#F97316]',
              variant === 'neutral' && 'bg-zinc-500'
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
}
