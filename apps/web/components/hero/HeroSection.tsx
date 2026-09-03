'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/hero/Header';
import { NoodleSlide } from '@/components/hero/NoodleSlide';

interface HeroSlide {
  id: number;
  image: string;
  theme: 'red' | 'cream' | 'dark';
  title: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: '/hero/1.jpg', // Slide 1: GOOD FOOD (Hand-held burger on Red)
    theme: 'red',
    title: 'GOOD FOOD',
  },
  {
    id: 2,
    image: '/hero/3.jpg', // Slide 2: TAKE AWAY (Takeaway box on Cream)
    theme: 'cream',
    title: 'TAKE AWAY',
  },
  {
    id: 3,
    image: '/hero/noodle-bg.svg', // Slide 3: FIRED BOWLS (Noodle bowl on cream pedestal over textured red)
    theme: 'red',
    title: 'FIRED BOWLS',
  },
];

const AUTO_PLAY_INTERVAL = 6000; // 6s per slide
const SWIPE_THRESHOLD = 45; // Minimum px distance for touch swipe

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  // Touch swipe refs for mobile interaction
  const touchStartXRef = React.useRef<number | null>(null);
  const touchEndXRef = React.useRef<number | null>(null);

  // Auto-play timer with smooth cubic-bezier transitions
  React.useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [currentSlide, isPaused]);

  // Desktop Keyboard Navigation (ArrowLeft / ArrowRight)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;

    const distance = touchStartXRef.current - touchEndXRef.current;
    const isLeftSwipe = distance > SWIPE_THRESHOLD;
    const isRightSwipe = distance < -SWIPE_THRESHOLD;

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    } else if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const slide = HERO_SLIDES[currentSlide];

  // Dynamic canvas background color
  const getSectionBg = () => {
    if (slide.theme === 'red') return 'bg-[#f91814]';
    if (slide.theme === 'dark') return 'bg-[#121212]';
    return 'bg-[#f5e3cd]';
  };

  return (
    <section
      className={`relative w-full h-[100svh] min-h-[680px] overflow-hidden flex flex-col justify-between select-none transition-colors duration-500 ${getSectionBg()}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Global Header with Dynamic Nav Colors & [nBites] Brand */}
      <Header theme={slide.theme} />

      {/* Background Image Carousel Layer (Optimized Images, 500ms Smooth Transition) */}
      <div className="absolute inset-x-0 top-0 bottom-[44px] z-0 overflow-hidden pointer-events-none">
        {HERO_SLIDES.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={s.image}
              alt={`nBites Hero Slide ${s.title}`}
              fill
              priority={idx === 0}
              sizes="100vw"
              quality={88}
              className="object-cover object-center w-full h-full drop-shadow-2xl"
            />
          </div>
        ))}
      </div>

      {/* Dynamic Slide Content Layer */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between pointer-events-none pb-16 md:pb-20 px-6 md:px-12 lg:px-16 max-w-[1440px] mx-auto">
        
        {/* Top Space Spacer */}
        <div className="w-full" />

        {/* Center / Middle Content Area */}
        <div className="flex-1 flex items-center justify-center w-full my-auto">
          
          {/* SLIDE 1: GOOD FOOD (Bold & Minimalist Editorial Flanking Typography) */}
          {slide.id === 1 && (
            <div className="w-full h-full flex flex-col justify-between pt-28 pb-4 pointer-events-auto animate-fadeIn">
              {/* Flanking Words: GOOD on Left, FOOD on Right */}
              <div className="w-full grid grid-cols-2 items-center justify-between my-auto">
                <div className="text-left pl-2 md:pl-12">
                  <span
                    className="font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#f5e3cd] tracking-wider block drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                    style={{ fontFamily: 'var(--font-clubstone), "Inter Display", sans-serif' }}
                  >
                    GOOD
                  </span>
                </div>
                <div className="text-right pr-2 md:pr-12">
                  <span
                    className="font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#f5e3cd] tracking-wider block drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                    style={{ fontFamily: 'var(--font-clubstone), "Inter Display", sans-serif' }}
                  >
                    FOOD
                  </span>
                </div>
              </div>

              {/* Bottom Row Action Buttons */}
              <div className="w-full flex items-center justify-start gap-4 pt-4">
                <Link href="/discovery">
                  <button className="inline-flex items-center gap-2.5 bg-white text-[#18120e] border-2 border-[#18120e] px-7 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider rounded-none transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#18120e] active:translate-x-0 active:translate-y-0 active:shadow-none cursor-pointer shadow-lg">
                    <span>EXPLORE MENU</span>
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
          )}

          {/* SLIDE 2: TAKE AWAY (Clean Editorial Typography on Cream) */}
          {slide.id === 2 && (
            <div className="w-full h-full flex flex-col justify-between pt-28 md:pt-36 lg:pt-40 pb-4 pointer-events-auto animate-fadeIn">
              {/* Top Row: Headline + Clean Editorial Paragraph */}
              <div className="flex flex-col lg:flex-row items-start justify-between gap-8 max-w-5xl">
                <div className="text-left">
                  <span
                    className="font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#f91814] tracking-[-3px] uppercase block leading-none drop-shadow-sm"
                    style={{ fontFamily: 'var(--font-clubstone), "Inter Display", sans-serif' }}
                  >
                    TAKE AWAY
                  </span>
                </div>
                
                {/* Clean Editorial Paragraph Text with Red Hover Underlines */}
                <div className="max-w-lg text-left lg:text-right pt-2 lg:pt-3">
                  <p
                    className="text-[15px] sm:text-base md:text-[17px] text-[#18120e] font-bold leading-relaxed"
                    style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
                  >
                    <span className="hover:text-[#f91814] hover:underline hover:decoration-[#f91814] hover:decoration-2 hover:underline-offset-4 transition-all duration-200 cursor-pointer">
                      Thermal-insulated take-away packaging
                    </span>{' '}
                    and{' '}
                    <span className="hover:text-[#f91814] hover:underline hover:decoration-[#f91814] hover:decoration-2 hover:underline-offset-4 transition-all duration-200 cursor-pointer">
                      real-time radial dispatch
                    </span>{' '}
                    crafted to preserve{' '}
                    <span className="hover:text-[#f91814] hover:underline hover:decoration-[#f91814] hover:decoration-2 hover:underline-offset-4 transition-all duration-200 cursor-pointer">
                      kitchen-fresh temperature
                    </span>{' '}
                    and crunch from our burners to your door across Nepal.
                  </p>
                </div>
              </div>

              {/* Bottom Row Action Buttons */}
              <div className="w-full flex items-center justify-start gap-4 pt-4">
                <Link href="/discovery">
                  <button className="inline-flex items-center gap-2.5 bg-[#f91814] text-white px-7 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider rounded-none transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#18120e] active:translate-x-0 active:translate-y-0 active:shadow-none cursor-pointer shadow-lg">
                    <span>ORDER TAKE-AWAY</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </Link>

                <Link href="/order-tracking/ORD-KTM-8942">
                  <button className="inline-flex items-center gap-2 bg-[#18120e] text-white px-6 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider rounded-none transition-all duration-150 hover:bg-[#27272a] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#f91814] cursor-pointer shadow-lg">
                    <span>LIVE TRACKING</span>
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* SLIDE 3: FIRED BOWLS (Interactive Monumental Noodle Bowl on Pedestal) */}
          {slide.id === 3 && <NoodleSlide />}

        </div>

      </div>

      {/* Subtle Slide Navigation Dots (Center-Bottom, Just Above Baseline Ribbon) */}
      <div className="absolute bottom-[52px] left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 pointer-events-auto">
        {HERO_SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${s.title}`}
            className={`cursor-pointer transition-all duration-300 rounded-full ${
              idx === currentSlide
                ? s.theme === 'cream'
                  ? 'w-7 h-2 bg-[#f91814] shadow-md'
                  : 'w-7 h-2 bg-white shadow-md'
                : s.theme === 'cream'
                ? 'w-2 h-2 bg-[#18120e]/30 hover:bg-[#18120e]/70'
                : 'w-2 h-2 bg-white/40 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* Subtle Bottom Animated Red & White Checkered Ribbon (Max Height 44px) */}
      <div className="absolute bottom-0 left-0 right-0 z-30 w-full checkerboard-ribbon pointer-events-none" />
    </section>
  );
}
