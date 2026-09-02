'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  Star,
  Clock,
  ArrowUpRight,
  User,
} from 'lucide-react';

interface DishItem {
  id: number;
  name: string;
  price: string;
  image: string;
  prepTime: string;
}

const DISHES: DishItem[] = [
  {
    id: 1,
    name: 'Himalayan Steamed Buff Momo',
    price: 'Rs. 320',
    image: '/foods/main.jpg',
    prepTime: '12 Mins',
  },
  {
    id: 2,
    name: 'Crispy Pan-Seared Kothey',
    price: 'Rs. 360',
    image: '/foods/1.jpg',
    prepTime: '14 Mins',
  },
  {
    id: 3,
    name: 'Double Smash Timur Burger',
    price: 'Rs. 480',
    image: '/foods/2.jpg',
    prepTime: '15 Mins',
  },
  {
    id: 4,
    name: 'Wood-Fired Sourdough Pizza',
    price: 'Rs. 750',
    image: '/foods/3.jpg',
    prepTime: '18 Mins',
  },
  {
    id: 5,
    name: 'Mountain Spiced Fried Crunch',
    price: 'Rs. 420',
    image: '/foods/4.jpg',
    prepTime: '11 Mins',
  },
];

export function ChefTurntableSection() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [addedDishId, setAddedDishId] = React.useState<number | null>(null);

  const activeDish = DISHES[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % DISHES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + DISHES.length) % DISHES.length);
  };

  const handleAddToOrder = (id: number) => {
    setAddedDishId(id);
    setTimeout(() => {
      setAddedDishId(null);
    }, 1500);
  };

  // Get next 3 upcoming items for perspective trail
  const getUpcomingDish = (offset: number) => {
    return DISHES[(activeIndex + offset) % DISHES.length];
  };

  return (
    <section className="relative w-full bg-[#080808] text-[#f5f5f0] py-24 lg:py-32 px-6 md:px-12 lg:px-16 overflow-hidden select-none">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[560px]">
        
        {/* LEFT COLUMN: Clean Minimal Headline & CTA */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-8 text-left z-20">
          
          <div className="space-y-4">
            <h2
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.02]"
              style={{ fontFamily: 'var(--font-clubstone), "Inter Display", sans-serif' }}
            >
              Order Your <span className="text-[#f91814]">Favorite</span> Foods
            </h2>

            <p
              className="text-base sm:text-lg text-[#8c8c8c] font-medium leading-relaxed max-w-sm pt-1"
              style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
            >
              Enjoy fresh, delicious meals delivered to you in minutes, all through our easy-to-use platform across Nepal.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <Link href="/discovery">
                <button className="px-8 py-3.5 bg-[#f91814] text-white text-sm sm:text-base font-bold uppercase tracking-wider rounded-full hover:bg-white hover:text-[#18120e] hover:shadow-[0_0_20px_rgba(249,24,20,0.4)] transition-all duration-200 cursor-pointer">
                  View Menu
                </button>
              </Link>

              <Link href="#order">
                <button className="px-8 py-3.5 bg-transparent border border-zinc-700 text-white text-sm sm:text-base font-bold uppercase tracking-wider rounded-full hover:border-white hover:bg-white/10 transition-all duration-200 cursor-pointer">
                  Order Now
                </button>
              </Link>
            </div>
          </div>

          {/* Swirl Doodle Arrow */}
          <div className="hidden sm:block py-2">
            <svg
              width="80"
              height="80"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white/80"
            >
              <path
                d="M20 70 C 35 85, 45 40, 60 65 C 70 75, 78 45, 82 25"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M68 24 L 84 24 L 84 40"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Bottom Review Counter */}
          <div className="flex items-center gap-4 pt-2">
            <div>
              <div className="font-mono text-xs text-[#a3a3a3] uppercase tracking-wider font-bold">
                4.95 / 5.0 ★
              </div>
              <div className="text-2xl font-black text-white font-mono mt-0.5">
                12,400+
              </div>
              <div className="text-xs font-mono text-[#737373] uppercase tracking-widest">
                Happy Foodies
              </div>
            </div>

            {/* Avatar Stack */}
            <div className="flex -space-x-2.5 overflow-hidden pl-2">
              <div className="w-9 h-9 rounded-full bg-zinc-800 border-2 border-[#080808] flex items-center justify-center text-zinc-300">
                <User className="w-4 h-4" />
              </div>
              <div className="w-9 h-9 rounded-full bg-zinc-700 border-2 border-[#080808] flex items-center justify-center text-zinc-200">
                <User className="w-4 h-4" />
              </div>
              <div className="w-9 h-9 rounded-full bg-[#f91814] border-2 border-[#080808] flex items-center justify-center text-white font-bold text-xs">
                +9K
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: The Floating Dish Spotlight & Perspective Trail */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full relative">
          
          <div className="relative w-full flex items-center justify-center min-h-[420px] sm:min-h-[460px]">
            
            {/* Left Chevron */}
            <button
              onClick={handlePrev}
              aria-label="Previous dish"
              className="absolute left-0 sm:left-4 z-30 w-12 h-12 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Active Focal Dish (Center Spotlight) */}
            <div className="flex flex-col items-center justify-center z-20 transition-all duration-500 ease-out">
              
              {/* Floating Speed Pill */}
              <div className="mb-4 bg-black/60 border border-white/20 px-4 py-1.5 rounded-full font-mono text-xs font-bold text-white tracking-wider flex items-center gap-2 backdrop-blur shadow-xl">
                <Clock className="w-3.5 h-3.5 text-[#f91814]" />
                <span>Fastest Delivery • {activeDish.prepTime}</span>
              </div>

              {/* Dish Photo */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-92 md:h-92 rounded-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.95)] border-4 border-white/10 transition-transform duration-500 hover:scale-105">
                <Image
                  src={activeDish.image}
                  alt={activeDish.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 320px, 400px"
                  className="object-cover object-center"
                />
              </div>

              {/* Title & Price Below Dish */}
              <div className="mt-6 text-center space-y-1.5">
                <h3
                  className="text-lg sm:text-xl font-bold text-zinc-300"
                  style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
                >
                  {activeDish.name}
                </h3>
                <div
                  className="text-2xl sm:text-3xl font-black text-white"
                  style={{ fontFamily: 'var(--font-clubstone), "Inter Display", sans-serif' }}
                >
                  {activeDish.price}
                </div>
              </div>

              {/* Floating Circular Plus / Check Button */}
              <div className="mt-4">
                <button
                  onClick={() => handleAddToOrder(activeDish.id)}
                  aria-label="Add to order"
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-[0_0_24px_rgba(249,24,20,0.5)] ${
                    addedDishId === activeDish.id
                      ? 'bg-emerald-600 scale-110'
                      : 'bg-[#f91814] hover:scale-115 text-white'
                  }`}
                >
                  {addedDishId === activeDish.id ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <Plus className="w-6 h-6 text-white" />
                  )}
                </button>
              </div>

            </div>

            {/* Right Perspective Trail (Queued Dishes Getting Smaller) */}
            <div className="hidden md:flex items-center gap-4 absolute right-4 lg:-right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-auto">
              
              {/* Upcoming Dish 1 (Scale 75%) */}
              <div
                onClick={handleNext}
                className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-2xl border-2 border-white/10 opacity-70 hover:opacity-100 hover:scale-85 transition-all duration-300 cursor-pointer shrink-0"
              >
                <Image
                  src={getUpcomingDish(1).image}
                  alt={getUpcomingDish(1).name}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>

              {/* Upcoming Dish 2 (Scale 50%) */}
              <div
                onClick={() => setActiveIndex((prev) => (prev + 2) % DISHES.length)}
                className="hidden lg:block relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-xl border border-white/10 opacity-40 hover:opacity-80 hover:scale-60 transition-all duration-300 cursor-pointer shrink-0"
              >
                <Image
                  src={getUpcomingDish(2).image}
                  alt={getUpcomingDish(2).name}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </div>

              {/* Upcoming Dish 3 (Scale 30%) */}
              <div
                onClick={() => setActiveIndex((prev) => (prev + 3) % DISHES.length)}
                className="hidden xl:block relative w-14 h-14 rounded-full overflow-hidden shadow-lg border border-white/5 opacity-20 hover:opacity-60 transition-all duration-300 cursor-pointer shrink-0"
              >
                <Image
                  src={getUpcomingDish(3).image}
                  alt={getUpcomingDish(3).name}
                  fill
                  sizes="60px"
                  className="object-cover"
                />
              </div>

            </div>

            {/* Right Chevron */}
            <button
              onClick={handleNext}
              aria-label="Next dish"
              className="absolute right-0 sm:right-2 z-30 w-12 h-12 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

          </div>

          {/* Bottom Right Minimal Tag */}
          <div className="mt-8 text-right max-w-xs ml-auto pt-4 border-t border-zinc-900">
            <p
              className="text-sm sm:text-base text-zinc-300 font-semibold leading-snug"
              style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
            >
              Enjoy our fast delivery service for your favorite meal.
            </p>
            <Link
              href="/discovery"
              className="text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-white mt-1.5 inline-block underline underline-offset-4"
            >
              Learn More ↗
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
