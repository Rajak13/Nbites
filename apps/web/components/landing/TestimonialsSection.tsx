'use client';

import * as React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  dish: string;
  rating: number;
  quote: string;
  dispatchTime: string;
}

const ROW_ONE_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Aarav Shrestha',
    location: 'Jhamsikhel',
    dish: 'Double Smash Timur Burger',
    rating: 5,
    quote:
      'The timur pepper kick hit immediately. Arrived blistering hot in under 18 minutes with zero bun sogginess. nBites telemetry is scary accurate.',
    dispatchTime: '18 MINS',
  },
  {
    id: 't-2',
    name: 'Sneha Tuladhar',
    location: 'Lazimpat',
    dish: 'Artisan Pepperoni Sourdough',
    rating: 5,
    quote:
      'Wood-fired sourdough pizza that actually tastes straight from the brick oven. Blistered crust, stretchy mozzarella, delivered in 19 mins flat.',
    dispatchTime: '19 MINS',
  },
  {
    id: 't-3',
    name: 'Bikash Thapa',
    location: 'Baluwatar',
    dish: 'Himalayan Steamed Buff Momo',
    rating: 5,
    quote:
      'Thermal steam-vent containers kept the jhol achar separate and the momos piping hot. Fastest kitchen dispatch in Baluwatar hands down.',
    dispatchTime: '14 MINS',
  },
  {
    id: 't-4',
    name: 'Pooja Gurung',
    location: 'Sanepa',
    dish: 'Mountain Spiced Crunch',
    rating: 5,
    quote:
      'The crunch was so loud my entire studio turned around! The live telemetry map showed the rider crossing the bridge in real-time.',
    dispatchTime: '21 MINS',
  },
  {
    id: 't-5',
    name: 'Rohan Karmacharya',
    location: 'Thamel',
    dish: 'Pan-Seared Kothey Dumplings',
    rating: 5,
    quote:
      'Golden crispy bottoms, scalding hot filling. Most apps take 50 minutes to navigate Thamel alleys—nBites pulled up in 21 minutes.',
    dispatchTime: '21 MINS',
  },
  {
    id: 't-6',
    name: 'Dikshya Karki',
    location: 'Pokhara Lakeside',
    dish: 'Smoked Pork Sekuwa Bowl',
    rating: 5,
    quote:
      'Finally a delivery app that doesn’t let food sit around getting cold. Arrived in 22 mins sharp on Lakeside. Flawless presentation.',
    dispatchTime: '22 MINS',
  },
];

const ROW_TWO_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-7',
    name: 'Anish Maharjan',
    location: 'Patan Durbar',
    dish: 'Choila & Newari Khaja Set',
    rating: 5,
    quote:
      'Authentic mustard oil pungency and smoky charcoal heat preserved in rigid brutalist boxes. Pristine packaging with zero spills.',
    dispatchTime: '17 MINS',
  },
  {
    id: 't-8',
    name: 'Sujata Basnet',
    location: 'New Road',
    dish: 'Wood-Fired Margherita D.O.P',
    rating: 5,
    quote:
      'Zero box sag, fresh basil aroma intact, and the rider handled the pizza completely level. Easily the highest standard delivery in Kathmandu.',
    dispatchTime: '24 MINS',
  },
  {
    id: 't-9',
    name: 'Manish Rajbhandari',
    location: 'Baneshwor',
    dish: 'Spicy Timur Hot Wings',
    rating: 5,
    quote:
      'The telemetry feed showed the kitchen packing my order at 8:12 PM and the courier rang my bell at 8:29 PM. Mind-blowing efficiency.',
    dispatchTime: '17 MINS',
  },
  {
    id: 't-10',
    name: 'Kriti Sharma',
    location: 'Maharajgunj',
    dish: 'Kathmandu Jhol Momo Bowl',
    rating: 5,
    quote:
      'The spicy sesame broth was still simmering in its separate insulated chamber. The ultimate rainy evening comfort food without leaving home.',
    dispatchTime: '16 MINS',
  },
  {
    id: 't-11',
    name: 'Pradeep Bhattarai',
    location: 'Jhamsikhel',
    dish: 'Double Truffle Smash Burger',
    rating: 5,
    quote:
      'Lacy crisp patty edges, melted cheese, and toasted brioche. Best smash burger experience in the valley, delivered under 23 minutes.',
    dispatchTime: '23 MINS',
  },
  {
    id: 't-12',
    name: 'Ayushma KC',
    location: 'Kupondole',
    dish: 'Crispy Fried Lotus Bites',
    rating: 5,
    quote:
      'Uncompromising crispiness! The brutalist insulated packaging isn’t just for looks—it legitimately protects food physics during transit.',
    dispatchTime: '15 MINS',
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="w-[320px] sm:w-[350px] md:w-[380px] h-[230px] sm:h-[240px] shrink-0 bg-[#f5e3cd] text-[#18120e] border-2 border-[#18120e] rounded-none shadow-[4px_4px_0px_0px_#18120e] p-5 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#f91814] cursor-pointer select-none">
      {/* Card Header: Stars + Dispatch Time Badge */}
      <div className="flex items-center justify-between gap-2 border-b border-[#18120e]/15 pb-2.5">
        <div className="flex items-center gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-500" />
          ))}
        </div>
        <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-widest text-[#18120e] uppercase bg-white/70 px-2 py-0.5 border border-[#18120e]/20">
          ⏱ {testimonial.dispatchTime}
        </span>
      </div>

      {/* Card Body: Quote Text */}
      <div className="relative my-auto py-2">
        <Quote className="w-4 h-4 text-[#f91814] opacity-40 absolute -top-1 -left-1 pointer-events-none" />
        <p
          className="text-xs sm:text-[13.5px] leading-relaxed text-[#18120e] italic line-clamp-3 pl-3"
          style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
        >
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>

      {/* Card Footer: Customer Meta */}
      <div className="flex items-center justify-between border-t border-[#18120e]/15 pt-2.5">
        <div className="space-y-0.5 truncate pr-2">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs sm:text-sm text-[#18120e] truncate">
              {testimonial.name}
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#f91814] shrink-0" />
          </div>
          <p className="font-mono text-[10px] text-[#7a6e65] uppercase tracking-wider truncate">
            {testimonial.location} &bull; {testimonial.dish}
          </p>
        </div>
        <div className="w-6 h-6 rounded-none border border-[#18120e] bg-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
          {testimonial.name[0]}
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  // Duplicating lists creates an unbroken, mathematically seamless loop with translateX(-50%)
  const doubleRowOne = [...ROW_ONE_TESTIMONIALS, ...ROW_ONE_TESTIMONIALS];
  const doubleRowTwo = [...ROW_TWO_TESTIMONIALS, ...ROW_TWO_TESTIMONIALS];

  return (
    <section className="relative w-full bg-[#0B0B0B] text-[#F5F5F0] py-20 md:py-28 overflow-hidden border-b-2 border-[#18120e]">
      {/* Injected CSS keyframes for silky smooth infinite scrolling marquee */}
      <style>{`
        @keyframes nbitesMarqueeLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @keyframes nbitesMarqueeRight {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        .nbites-marquee-left {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: nbitesMarqueeLeft 42s linear infinite;
        }

        .nbites-marquee-right {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: nbitesMarqueeRight 46s linear infinite;
        }

        .nbites-marquee-left:hover,
        .nbites-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Edge Gradient Masks for cinematic infinite portal effect */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 md:w-44 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/80 to-transparent z-20" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 md:w-44 bg-gradient-to-l from-[#0B0B0B] via-[#0B0B0B]/80 to-transparent z-20" />

      {/* Section Header */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 text-center space-y-3 mb-12 sm:mb-16">
        <div className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-[#A1A1AA] inline-flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-[#f91814]" />
          WHAT FOODIES SAY
          <span className="inline-block w-2 h-2 bg-[#f91814]" />
        </div>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F5F5F0] tracking-tight leading-tight"
          style={{ fontFamily: 'var(--font-clubstone), "Inter Display", sans-serif' }}
        >
          Unfiltered Logs from the Valley
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-[#A1A1AA] max-w-xl mx-auto font-mono tracking-tight">
          Verified eater reviews, instant heat preservation, and sub-30 minute telemetry logs across Kathmandu, Patan, and Pokhara.
        </p>
      </div>

      {/* Marquee Rows Container */}
      <div className="space-y-5 sm:space-y-6 overflow-hidden">
        {/* Row 1: Scrolls Left */}
        <div className="relative w-full overflow-hidden flex">
          <div className="nbites-marquee-left flex gap-5 sm:gap-6">
            {doubleRowOne.map((item, idx) => (
              <TestimonialCard key={`row1-${item.id}-${idx}`} testimonial={item} />
            ))}
          </div>
        </div>

        {/* Row 2: Scrolls Right */}
        <div className="relative w-full overflow-hidden flex">
          <div className="nbites-marquee-right flex gap-5 sm:gap-6">
            {doubleRowTwo.map((item, idx) => (
              <TestimonialCard key={`row2-${item.id}-${idx}`} testimonial={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Section Bottom Trust Bar */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 mt-12 sm:mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left font-mono text-xs text-[#A1A1AA] uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>100% UNEDITED VERIFIED REVIEWS</span>
        </div>
        <div>DATA SOURCE: nBites ORDER TELEMETRY STREAM</div>
      </div>
    </section>
  );
}
