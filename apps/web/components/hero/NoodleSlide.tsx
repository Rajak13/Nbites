'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function NoodleSlide() {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className="w-full h-full flex flex-col justify-between pt-24 md:pt-28 pb-4 pointer-events-auto relative select-none animate-fadeIn">
      
      {/* Monumental Headline — Clean Editorial Title, Zero Badges (Matching Slide 1 DNA) */}
      <div className="w-full max-w-5xl mx-auto text-center z-20 mt-2 md:mt-4">
        <h2
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-[#f5e3cd] tracking-tight uppercase leading-[0.9] drop-shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
          style={{ fontFamily: 'var(--font-clubstone), "Inter Display", sans-serif' }}
        >
          FIRED BOWLS
        </h2>
      </div>

      {/* Center Hero Stage: Pure Monumental Visual Asset on Pedestal */}
      <div className="relative w-full max-w-4xl mx-auto my-auto flex items-center justify-center z-20">
        <div
          className="relative w-[340px] sm:w-[480px] md:w-[620px] lg:w-[740px] aspect-[1600/1253] group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Subtle Steam Rising Naturally on Hover */}
          {isHovered && (
            <div className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-none z-30">
              <span className="w-2 sm:w-2.5 h-12 sm:h-16 bg-white/50 rounded-full animate-steam blur-[1px]" />
              <span
                className="w-2 sm:w-2.5 h-16 sm:h-20 bg-white/50 rounded-full animate-steam blur-[1px]"
                style={{ animationDelay: '0.35s' }}
              />
              <span
                className="w-2 sm:w-2.5 h-12 sm:h-16 bg-white/50 rounded-full animate-steam blur-[1px]"
                style={{ animationDelay: '0.7s' }}
              />
            </div>
          )}

          {/* Hero Noodle Bowl Image Asset */}
          <div
            className={`relative w-full h-full transition-all duration-300 ease-out origin-center ${
              isHovered
                ? '-translate-y-2 scale-101 drop-shadow-[0_24px_36px_rgba(0,0,0,0.55)]'
                : 'translate-y-0 scale-100 drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)]'
            }`}
          >
            <Image
              src="/hero/noodle-bowl.webp"
              alt="Handcrafted artisan noodle bowl"
              fill
              priority
              sizes="(max-width: 768px) 90vw, 740px"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Bottom Row Action Buttons — Exact Match to Slide 1 Editorial Standards */}
      <div className="w-full flex items-center justify-start gap-4 pt-4 px-2 z-30">
        <Link href="/discovery?category=noodles">
          <button className="inline-flex items-center gap-2.5 bg-white text-[#18120e] border-2 border-[#18120e] px-7 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider rounded-none transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#18120e] active:translate-x-0 active:translate-y-0 active:shadow-none cursor-pointer shadow-lg">
            <span>EXPLORE NOODLE BAR</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </Link>

        <Link href="#about">
          <button className="inline-flex items-center gap-2 bg-[#18120e] text-white border-2 border-[#18120e] px-6 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider rounded-none transition-all duration-150 hover:bg-[#27272a] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#ffffff] cursor-pointer shadow-lg">
            <span>OUR STORY</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
