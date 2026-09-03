'use client';

import * as React from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Scene {
  word: string;
  image: string;
  imageAlt: string;
  headline: string;
  body: string;
  detail: string;
}

const SCENES: Scene[] = [
  {
    word: 'CRAVE',
    image: '/foods/main.jpg',
    imageAlt: 'Steaming Himalayan momos in a bamboo steamer',
    headline: 'Every kitchen, hand-picked.',
    body: 'We don\'t onboard restaurants. We scout kitchens — the tandoor in Bhaktapur that\'s been firing since 1987, the momo steamer in Mangalbazar that queues wrap around the corner, the home kitchen in Kirtipur where daal is still ground on stone.',
    detail: '86 KITCHENS ACROSS 3 CITIES',
  },
  {
    word: 'FIRE',
    image: '/foods/2.jpg',
    imageAlt: 'Chef firing a wok with open flame',
    headline: 'Tracked from flame to box.',
    body: 'Every order is a live telemetry event. When the sekuwa hits the grill, we know. When the momo steamer opens, we know. Real-time kitchen instrumentation means your food is never sitting — it\'s moving the second it\'s plated.',
    detail: 'REAL-TIME KITCHEN TELEMETRY',
  },
  {
    word: 'RIDE',
    image: '/foods/4.jpg',
    imageAlt: 'Rider navigating through the valley streets',
    headline: 'Thirty minutes. Valley-wide.',
    body: 'Turf.js spatial routing calculates the fastest path through the valley\'s arteries — not Google Maps generic, but hyper-local pathing that knows the one-ways of Ason, the shortcuts through Patan Durbar, the bridge timings across Bagmati.',
    detail: '24 MIN AVERAGE · DOOR TO DOOR',
  },
];

export function KitchenJourneySection() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const scenesRef = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const ctx = gsap.context(() => {
      // Pin the container and scroll the track horizontally
      const totalScroll = track.scrollWidth - container.offsetWidth;

      gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          end: () => `+=${totalScroll}`,
          invalidateOnRefresh: true,
        },
      });

      // Animate each scene's elements as they come into view
      scenesRef.current.forEach((scene) => {
        if (!scene) return;

        const word = scene.querySelector('.scene-word');
        const img = scene.querySelector('.scene-image');
        const text = scene.querySelector('.scene-text');

        if (word) {
          gsap.fromTo(word,
            { xPercent: 10, opacity: 0.02 },
            {
              xPercent: -5, opacity: 0.07,
              ease: 'none',
              scrollTrigger: {
                trigger: scene,
                containerAnimation: gsap.getById?.('journey-scroll') || undefined,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          );
        }

        if (img) {
          gsap.fromTo(img,
            { scale: 1.15, opacity: 0 },
            {
              scale: 1, opacity: 1,
              duration: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: scene,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            }
          );
        }

        if (text) {
          gsap.fromTo(text,
            { y: 40, opacity: 0 },
            {
              y: 0, opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: scene,
                start: 'top 75%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-[#0B0B0B] overflow-hidden select-none"
    >
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#27272A]" />

      {/* Horizontal track */}
      <div
        ref={trackRef}
        className="flex h-full"
        style={{ width: `${SCENES.length * 100}vw` }}
      >
        {SCENES.map((scene, idx) => (
          <div
            key={idx}
            ref={(el) => { scenesRef.current[idx] = el; }}
            className="relative w-screen h-full flex-shrink-0 flex items-center"
          >
            {/* Giant background word */}
            <div
              className="scene-word absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
              aria-hidden="true"
            >
              <span
                className="text-[28vw] font-black tracking-tighter text-white whitespace-nowrap leading-none"
                style={{
                  fontFamily: 'var(--font-clubstone), serif',
                  opacity: 0.05,
                  WebkitTextStroke: '1px rgba(255,255,255,0.03)',
                }}
              >
                {scene.word}
              </span>
            </div>

            {/* Scene content */}
            <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center px-8 md:px-16 lg:px-24 gap-8 lg:gap-16">
              
              {/* Image — positioned asymmetrically */}
              <div
                className={`scene-image relative flex-shrink-0 w-full lg:w-[45%] h-[40vh] lg:h-[65vh] overflow-hidden ${
                  idx % 2 === 0 ? 'lg:order-1' : 'lg:order-2'
                }`}
                style={{
                  marginTop: idx === 1 ? '-8vh' : idx === 2 ? '4vh' : '0',
                }}
              >
                <Image
                  src={scene.image}
                  alt={scene.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                  priority={idx === 0}
                />
                {/* Film grain overlay */}
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
                  style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
                  }}
                />
                {/* Scene number */}
                <div className="absolute bottom-4 left-4 font-mono text-xs tracking-widest text-white/50 uppercase">
                  {String(idx + 1).padStart(2, '0')} / {String(SCENES.length).padStart(2, '0')}
                </div>
              </div>

              {/* Text block — editorial, not in a card */}
              <div
                className={`scene-text flex-1 max-w-lg ${
                  idx % 2 === 0 ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                {/* Small scene label */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-[2px] bg-[#f91814]" />
                  <span className="font-mono text-[11px] tracking-[0.2em] text-[#f91814] uppercase font-bold">
                    {scene.word}
                  </span>
                </div>

                {/* Headline */}
                <h3
                  className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F5F5F0] tracking-tight leading-[1.05] mb-6"
                  style={{ fontFamily: 'var(--font-clubstone), serif' }}
                >
                  {scene.headline}
                </h3>

                {/* Body */}
                <p
                  className="text-[#A1A1AA] text-base lg:text-lg leading-relaxed mb-8"
                  style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
                >
                  {scene.body}
                </p>

                {/* Detail line */}
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#f91814]" />
                  <span className="font-mono text-[11px] tracking-[0.15em] text-[#A1A1AA]/70 uppercase">
                    {scene.detail}
                  </span>
                </div>
              </div>
            </div>

            {/* Vertical divider between scenes */}
            {idx < SCENES.length - 1 && (
              <div className="absolute right-0 top-[15%] bottom-[15%] w-[1px] bg-[#27272A]" />
            )}
          </div>
        ))}
      </div>

      {/* Scroll hint at bottom */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        <span className="w-6 h-[1px] bg-[#A1A1AA]/40" />
        <span className="font-mono text-[10px] tracking-[0.2em] text-[#A1A1AA]/40 uppercase">
          Scroll to explore
        </span>
        <span className="w-6 h-[1px] bg-[#A1A1AA]/40" />
      </div>
    </section>
  );
}
