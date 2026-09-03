'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function CTABandSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const headlineRef = React.useRef<HTMLHeadingElement>(null);
  const subtitleRef = React.useRef<HTMLParagraphElement>(null);
  const buttonsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Headline: scales from 0.9 to 1.0 and fades in
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { opacity: 0, scale: 0.9, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headlineRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Subtitle: soft fade-in and slide
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: subtitleRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Buttons: stagger in from below
      if (buttonsRef.current && buttonsRef.current.children.length > 0) {
        gsap.fromTo(
          buttonsRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: buttonsRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#f5e3cd] text-[#18120e] border-t-[3px] border-b-[3px] border-[#18120e] overflow-hidden"
    >
      {/* 1. Subtle Animated Checkered Ribbon */}
      <div className="checkerboard-ribbon" />

      {/* 2. Main Content Strip with Heavy Brutalist Framing */}
      <div className="py-24 md:py-32 px-6 md:px-12 lg:px-16">
        <div className="max-w-5xl mx-auto">
          {/* Heavy Brutalist Frame Box */}
          <div className="relative border-[3px] border-[#18120e] bg-[#f5e3cd] p-8 sm:p-12 md:p-16 lg:p-20 shadow-[8px_8px_0px_0px_#18120e] md:shadow-[12px_12px_0px_0px_#18120e]">
            {/* Corner Editorial Crosshairs */}
            <div className="absolute top-3 left-3 font-mono text-[10px] sm:text-xs font-bold text-[#7a6e65] uppercase select-none tracking-widest">
              + 27.7172° N
            </div>
            <div className="absolute top-3 right-3 font-mono text-[10px] sm:text-xs font-bold text-[#7a6e65] uppercase select-none tracking-widest">
              85.3240° E +
            </div>
            <div className="absolute bottom-3 left-3 font-mono text-[10px] sm:text-xs font-bold text-[#7a6e65] uppercase select-none tracking-widest">
              + KTM DISPATCH
            </div>
            <div className="absolute bottom-3 right-3 font-mono text-[10px] sm:text-xs font-bold text-[#7a6e65] uppercase select-none tracking-widest">
              NBITES ENGINE +
            </div>

            {/* Centered Content */}
            <div className="flex flex-col items-center justify-center text-center space-y-6 pt-4 pb-2">
              {/* Mono Section Kicker */}
              <div className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f91814] flex items-center gap-2">
                <span>//</span>
                <span>SECTION 07 • INSTANT ORDER DISPATCH</span>
                <span>//</span>
              </div>

              {/* Bold Clubstone Headline */}
              <h2
                ref={headlineRef}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-[#18120e] tracking-tight leading-none select-none"
                style={{ fontFamily: 'var(--font-clubstone), "Inter Display", sans-serif' }}
              >
                HUNGRY YET?
              </h2>

              {/* Muted Nokie Subtitle */}
              <p
                ref={subtitleRef}
                className="text-lg sm:text-xl md:text-2xl text-[#7a6e65] max-w-xl mx-auto font-medium"
                style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
              >
                Your next favorite meal is one tap away.
              </p>

              {/* CTA Action Buttons */}
              <div
                ref={buttonsRef}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-6 w-full sm:w-auto"
              >
                {/* Primary CTA: Explore Menu */}
                <Link
                  href="/discovery"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-4.5 bg-[#f91814] text-white font-bold text-base sm:text-lg uppercase tracking-wider rounded-none border-2 border-[#f91814] hover:shadow-[4px_4px_0px_0px_#18120e] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-150 cursor-pointer"
                  style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
                >
                  <span>EXPLORE MENU</span>
                  <ArrowUpRight className="w-5 h-5 shrink-0" />
                </Link>

                {/* Secondary CTA: Become a Partner */}
                <Link
                  href="/merchant/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-4.5 bg-transparent text-[#18120e] font-bold text-base sm:text-lg uppercase tracking-wider rounded-none border-2 border-[#18120e] hover:bg-[#18120e] hover:text-white hover:shadow-[4px_4px_0px_0px_#18120e] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-150 cursor-pointer"
                  style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
                >
                  <span>BECOME A PARTNER</span>
                  <ArrowUpRight className="w-5 h-5 shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
