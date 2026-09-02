import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:pointer-events-none disabled:opacity-50 select-none rounded-none',
  {
    variants: {
      variant: {
        primary:
          'bg-[#F97316] text-black border-2 border-black hover:bg-[#EA580C] hover:text-white shadow-[4px_4px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_#000000]',
        brutalistDark:
          'bg-[#141414] text-[#F5F5F0] border-2 border-[#27272A] hover:border-[#F97316] hover:text-[#F97316] shadow-[4px_4px_0px_0px_rgba(249,115,22,0.4)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_#000000]',
        outline:
          'bg-transparent text-[#F5F5F0] border-2 border-[#3F3F46] hover:bg-[#27272A] hover:border-white shadow-[3px_3px_0px_0px_#27272A]',
        secondary:
          'bg-[#F59E0B] text-black border-2 border-black hover:bg-[#D97706] shadow-[4px_4px_0px_0px_#000000]',
        ghost:
          'bg-transparent text-[#A1A1AA] hover:text-[#F5F5F0] hover:bg-[#18181B] border border-transparent',
        danger:
          'bg-red-600 text-white border-2 border-black hover:bg-red-700 shadow-[4px_4px_0px_0px_#000000]',
      },
      size: {
        default: 'h-11 px-6 py-2 text-sm',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-13 px-8 text-base tracking-widest',
        icon: 'h-11 w-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
