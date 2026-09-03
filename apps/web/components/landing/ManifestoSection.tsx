'use client';

import * as React from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ManifestoSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const line1Ref = React.useRef<HTMLDivElement>(null);
  const line2Ref = React.useRef<HTMLDivElement>(null);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const statsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Line 1: slides in from right, parallax slower
      if (line1Ref.current) {
        gsap.fromTo(line1Ref.current,
          { xPercent: 8, opacity: 0 },
          {
            xPercent: 0, opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Parallax drift on scroll
        gsap.to(line1Ref.current, {
          xPercent: -3,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      // Line 2: slides in from left, parallax faster
      if (line2Ref.current) {
        gsap.fromTo(line2Ref.current,
          { xPercent: -8, opacity: 0 },
          {
            xPercent: 0, opacity: 1,
            duration: 1.2,
            delay: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Parallax drift on scroll — opposite direction, faster
        gsap.to(line2Ref.current, {
          xPercent: 5,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      // Body text fades up
      if (bodyRef.current) {
        gsap.fromTo(bodyRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.9,
            delay: 0.3,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Stats line fades in
      if (statsRef.current) {
        gsap.fromTo(statsRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.7,
            delay: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 65%',
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
      className="relative w-full bg-[#f5e3cd] overflow-hidden py-28 md:py-36 lg:py-44 px-6 md:px-12"
    >
      {/* The manifesto headline — typography IS the design */}
      <div className="max-w-[1440px] mx-auto">
        
        {/* Line 1 */}
        <div ref={line1Ref} className="overflow-hidden">
          <h2
            className="text-[11vw] md:text-[10vw] lg:text-[9vw] font-black tracking-tight leading-[0.9] text-[#18120e] whitespace-nowrap"
            style={{ fontFamily: 'var(--font-clubstone), serif' }}
          >
            WE DON&apos;T DELIVER FOOD.
          </h2>
        </div>

        {/* Line 2 — outlined / red */}
        <div ref={line2Ref} className="overflow-hidden mt-2 md:mt-4">
          <h2
            className="text-[11vw] md:text-[10vw] lg:text-[9vw] font-black tracking-tight leading-[0.9] whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-clubstone), serif',
              color: 'transparent',
              WebkitTextStroke: '2px #f91814',
            }}
          >
            WE DELIVER CRAFT.
          </h2>
        </div>

        {/* Horizontal rule */}
        <div className="mt-12 md:mt-16 mb-10 md:mb-14 flex items-center gap-4">
          <div className="flex-1 h-[2px] bg-[#18120e]/15" />
          <span className="w-2 h-2 bg-[#f91814]" />
          <div className="w-16 h-[2px] bg-[#f91814]" />
        </div>

        {/* Editorial Content Grid: Framed Image on Left + Copy on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left: Framed Editorial Image */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div
              className="relative border-2 border-[#18120e] bg-[#18120e] shadow-[6px_6px_0px_0px_#18120e] md:shadow-[10px_10px_0px_0px_#18120e] overflow-hidden group transition-all duration-300"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/hero/2.jpg"
                  alt="Artisan wood-fired pizza craft"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Archival Corner Stamp */}
                <div className="absolute top-3 left-3 bg-[#18120e]/90 backdrop-blur-sm text-white px-2.5 py-1 border border-white/20 font-mono text-[10px] tracking-widest uppercase">
                  FIG. 01 — CRAFT SECTOR
                </div>

                {/* Subtitle Badge */}
                <div className="absolute bottom-3 right-3 bg-[#f91814] text-white px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider uppercase shadow-[2px_2px_0px_0px_#18120e]">
                  WOOD-FIRED &bull; 450°C
                </div>
              </div>

              {/* Bottom Caption Bar */}
              <div className="px-4 py-2.5 bg-[#18120e] flex items-center justify-between border-t-2 border-[#18120e] text-[11px] font-mono text-[#A1A1AA]">
                <span className="tracking-widest uppercase text-white/80">KTM-VALLEY ARCHIVE</span>
                <span className="tracking-widest text-[#f91814]">27.7172° N, 85.3240° E</span>
              </div>
            </div>
          </div>

          {/* Right: Editorial Copy & Pull Quote */}
          <div ref={bodyRef} className="lg:col-span-6 xl:col-span-7 space-y-6">
            <p
              className="text-[#18120e] text-lg sm:text-xl md:text-2xl font-bold leading-snug tracking-tight"
              style={{ fontFamily: 'var(--font-clubstone), serif' }}
            >
              Every plate that leaves a kitchen on nBites was cooked by someone who gives a damn.
            </p>

            {/* Editorial Pull Quote */}
            <div className="border-l-3 border-[#f91814] pl-5 py-1 my-4">
              <p
                className="text-[#18120e]/90 text-base md:text-lg italic font-medium leading-relaxed"
                style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
              >
                &ldquo;Not a cloud kitchen. Not a franchise assembly line. Real cooks in real kitchens &mdash; where the recipe came from their grandmother and the spice ratios are memorized, not measured.&rdquo;
              </p>
            </div>

            <p
              className="text-[#18120e]/70 text-sm sm:text-base leading-relaxed"
              style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
            >
              We built the logistics to match the craft. Real-time telemetry tracks every order 
              from flame to door. Spatial routing cuts through the valley&apos;s chaos. And every 
              rupee flows straight back to the people who cook.
            </p>

            {/* Editorial Seal / Signature */}
            <div className="pt-2 flex items-center gap-4">
              <div className="w-8 h-[2px] bg-[#f91814]" />
              <span className="font-mono text-xs tracking-[0.2em] text-[#18120e]/60 uppercase font-semibold">
                VERIFIED CULINARY STANDARD // NBITES
              </span>
            </div>
          </div>

        </div>

        {/* Stats — inline, not in cards */}
        <div ref={statsRef} className="mt-14 md:mt-20 flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-[#18120e]/10" />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
          <span
            className="font-mono text-xs tracking-[0.15em] text-[#18120e]/50 uppercase"
          >
            86 kitchens
          </span>
          <span className="text-[#18120e]/20">·</span>
          <span
            className="font-mono text-xs tracking-[0.15em] text-[#18120e]/50 uppercase"
          >
            3 cities
          </span>
          <span className="text-[#18120e]/20">·</span>
          <span
            className="font-mono text-xs tracking-[0.15em] text-[#18120e]/50 uppercase"
          >
            24 min avg delivery
          </span>
          <span className="text-[#18120e]/20">·</span>
          <span
            className="font-mono text-xs tracking-[0.15em] text-[#18120e]/50 uppercase"
          >
            Kathmandu · Lalitpur · Bhaktapur
          </span>
        </div>
      </div>
    </section>
  );
}
