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
  Flame,
  ArrowUpRight,
  ShieldCheck,
  Users,
} from 'lucide-react';

interface DishItem {
  id: number;
  category: string;
  name: string;
  restaurant: string;
  price: string;
  image: string;
  prepTime: string;
  rating: string;
  reviews: string;
  tag: string;
  description: string;
}

const DISHES: DishItem[] = [
  {
    id: 1,
    category: 'MOMO VAULT',
    name: 'Himalayan Steamed Buff Momo',
    restaurant: 'Everest Kitchen • Lazimpat',
    price: 'Rs. 320',
    image: '/foods/main.jpg',
    prepTime: '12 Mins',
    rating: '4.96',
    reviews: '1,420',
    tag: 'CHEF SELECTION',
    description:
      'Hand-folded momos stuffed with spiced mountain buffalo, scallions, fresh cilantro, and served with roasted sesame-timur tomato jhol.',
  },
  {
    id: 2,
    category: 'KOTHEY & DUMPLINGS',
    name: 'Crispy Pan-Seared Kothey',
    restaurant: 'Kathmandu Dumpling Co. • Patan',
    price: 'Rs. 360',
    image: '/foods/1.jpg',
    prepTime: '14 Mins',
    rating: '4.92',
    reviews: '980',
    tag: 'CRISPY SEAR',
    description:
      'Golden pan-fried dumplings with a deeply caramelized crispy bottom, juicy savory filling, and fiery red chili garlic sauce.',
  },
  {
    id: 3,
    category: 'SMASH CRAFT',
    name: 'Double Smash Timur Beast',
    restaurant: 'The Sizzle House • Jhamsikhel',
    price: 'Rs. 480',
    image: '/foods/2.jpg',
    prepTime: '15 Mins',
    rating: '4.98',
    reviews: '2,150',
    tag: 'TOP RATED',
    description:
      'Double grass-fed patties seared with melted cheddar, crispy bacon, pickles, and roasted Sichuan timur aioli on a toasted brioche.',
  },
  {
    id: 4,
    category: 'WOOD-FIRED PIZZA',
    name: 'Artisan Pepperoni Sourdough',
    restaurant: 'Fire & Dough • Baluwatar',
    price: 'Rs. 750',
    image: '/foods/3.jpg',
    prepTime: '18 Mins',
    rating: '4.94',
    reviews: '890',
    tag: 'WOOD-OVEN',
    description:
      'Slow-fermented sourdough blistered in a 450°C wood oven, melted buffalo mozzarella, pepperoni, and garlic-infused butter crust.',
  },
  {
    id: 5,
    category: 'CRISPY CRUNCH',
    name: 'Mountain Spiced Fried Tenders',
    restaurant: 'Golden Bird Kitchen • Thamel',
    price: 'Rs. 420',
    image: '/foods/4.jpg',
    prepTime: '11 Mins',
    rating: '4.89',
    reviews: '740',
    tag: 'QUICK BITE',
    description:
      'Double-dredged golden chicken tenders seasoned with Himalayan rock salt, roasted chili flakes, and house-made mustard dip.',
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
    }, 1800);
  };

  return (
    <section className="relative w-full bg-[#0d0d0d] text-[#f5f5f0] py-20 lg:py-28 px-6 md:px-12 lg:px-16 overflow-hidden border-t-2 border-[#262626]">
      
      {/* Background Subtle Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, #0d0d0d 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto space-y-12">
        
        {/* Category Filter Tabs (No Emojis, Clean Industrial Badges) */}
        <div className="w-full flex items-center justify-start lg:justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
          {DISHES.map((dish, idx) => (
            <button
              key={dish.id}
              onClick={() => setActiveIndex(idx)}
              className={`px-4 py-2 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer border ${
                idx === activeIndex
                  ? 'bg-[#f91814] text-white border-[#f91814] shadow-[3px_3px_0px_0px_#ffffff]'
                  : 'bg-[#181818] text-[#a3a3a3] border-[#2c2c2c] hover:border-zinc-500 hover:text-white'
              }`}
            >
              {dish.category}
            </button>
          ))}
        </div>

        {/* Main 2-Column Turntable Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline, Pitch, Rating & Doodle Arrow */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            {/* Live Operational Status Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a1a1a] border border-[#2f2f2f] text-xs font-mono font-bold tracking-widest text-[#f91814] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#f91814] animate-pulse" />
              <span>THE DAILY DISPATCH REEL</span>
            </div>

            {/* Display Headline */}
            <h2
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] text-white"
              style={{ fontFamily: 'var(--font-clubstone), "Inter Display", sans-serif' }}
            >
              ORDER YOUR <br />
              <span className="text-[#f91814]">FAVORITE</span> BITES
            </h2>

            {/* Editorial Copy */}
            <p
              className="text-sm sm:text-base text-[#a3a3a3] font-medium leading-relaxed max-w-md"
              style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
            >
              Hand-prepared by top artisan kitchens across Nepal. Dispatched with
              thermal-locked insulation to keep your food steaming hot and crispy in under 20 minutes.
            </p>

            {/* Action Buttons & Doodle Arrow */}
            <div className="relative pt-2">
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/discovery">
                  <button className="inline-flex items-center gap-2 bg-[#f91814] text-white border-2 border-[#f91814] px-7 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider rounded-none transition-all duration-150 hover:bg-white hover:text-[#18120e] hover:border-white hover:shadow-[4px_4px_0px_0px_#f91814] cursor-pointer">
                    <span>EXPLORE ALL MENUS</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </Link>

                <Link href="/order-tracking/ORD-KTM-8942">
                  <button className="inline-flex items-center gap-2 bg-[#181818] text-[#f5f5f0] border-2 border-[#333333] px-6 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider rounded-none transition-all duration-150 hover:border-white hover:text-white cursor-pointer">
                    <span>LIVE DISPATCH</span>
                  </button>
                </Link>
              </div>

              {/* Hand-Drawn SVG Doodle Arrow (Pointing towards the food turntable) */}
              <div className="hidden sm:block absolute -right-6 md:right-8 -bottom-16 pointer-events-none opacity-80">
                <svg
                  width="110"
                  height="70"
                  viewBox="0 0 110 70"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 50 C 30 65, 50 15, 75 40 C 85 50, 95 30, 102 18"
                    stroke="#f91814"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M90 16 L 105 16 L 104 31"
                    stroke="#f91814"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Social Proof Stats Bar */}
            <div className="pt-6 border-t border-[#222222] flex flex-wrap items-center gap-6 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#222222] border border-[#3a3a3a] flex items-center justify-center text-amber-400">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <div className="font-mono text-base font-black text-white leading-none">
                    4.95 / 5.0
                  </div>
                  <div className="font-mono text-[11px] text-[#737373] uppercase tracking-wider mt-1">
                    12,400+ REVIEWS
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#222222] border border-[#3a3a3a] flex items-center justify-center text-[#f91814]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-mono text-base font-black text-white leading-none">
                    18 MINS
                  </div>
                  <div className="font-mono text-[11px] text-[#737373] uppercase tracking-wider mt-1">
                    AVG RADIAL DISPATCH
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Turntable Dish Stage & Queued Carousel */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
            
            {/* Carousel Navigation Chevrons */}
            <div className="w-full flex items-center justify-between z-30 mb-4 px-2">
              <button
                onClick={handlePrev}
                aria-label="Previous dish"
                className="w-12 h-12 bg-[#1c1c1c] border-2 border-[#333333] hover:border-[#f91814] hover:bg-[#f91814] text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="font-mono text-xs font-bold text-[#888888] uppercase tracking-widest">
                DISPATCH {activeIndex + 1} OF {DISHES.length}
              </div>

              <button
                onClick={handleNext}
                aria-label="Next dish"
                className="w-12 h-12 bg-[#1c1c1c] border-2 border-[#333333] hover:border-[#f91814] hover:bg-[#f91814] text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Turntable Focal Stage */}
            <div className="relative w-full flex items-center justify-center">
              
              {/* Active Focal Dish Card */}
              <div className="relative w-full max-w-md bg-[#141414] border-2 border-[#2c2c2c] p-5 sm:p-6 shadow-[8px_8px_0px_0px_#f91814] transition-all duration-300">
                
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f91814] text-white font-mono text-[10px] font-black uppercase tracking-wider">
                    <Flame className="w-3 h-3 text-amber-300" />
                    <span>{activeDish.tag}</span>
                  </span>

                  <span className="font-mono text-xs font-bold text-zinc-400">
                    {activeDish.restaurant}
                  </span>
                </div>

                {/* Focal Dish Image Container */}
                <div className="relative w-full h-64 sm:h-72 overflow-hidden border border-[#2a2a2a] bg-[#080808]">
                  <Image
                    src={activeDish.image}
                    alt={activeDish.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover object-center transition-transform duration-500 hover:scale-105"
                  />
                  
                  {/* Floating Prep Time Pill */}
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur border border-white/20 px-2.5 py-1 font-mono text-[11px] font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#f91814]" />
                    <span>{activeDish.prepTime} PREP</span>
                  </div>
                </div>

                {/* Dish Details */}
                <div className="mt-5 space-y-3 text-left">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3
                      className="text-2xl sm:text-3xl font-black text-white leading-tight"
                      style={{ fontFamily: 'var(--font-clubstone), "Inter Display", sans-serif' }}
                    >
                      {activeDish.name}
                    </h3>
                    <span
                      className="text-2xl sm:text-3xl font-black text-[#f91814] shrink-0"
                      style={{ fontFamily: 'var(--font-clubstone), "Inter Display", sans-serif' }}
                    >
                      {activeDish.price}
                    </span>
                  </div>

                  <p
                    className="text-xs sm:text-sm text-[#a3a3a3] font-medium leading-relaxed"
                    style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
                  >
                    {activeDish.description}
                  </p>

                  {/* Add to Order Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleAddToOrder(activeDish.id)}
                      className={`w-full py-3.5 px-6 font-bold uppercase tracking-wider text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-150 rounded-none cursor-pointer ${
                        addedDishId === activeDish.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#f91814] text-white hover:bg-white hover:text-[#18120e] hover:shadow-[4px_4px_0px_0px_#ffffff]'
                      }`}
                      style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
                    >
                      {addedDishId === activeDish.id ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>ADDED TO TICKET!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>ADD TO ORDER • {activeDish.price}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>

              {/* Side Queued Preview Dish (Right Thumbnail for Depth) */}
              <div
                onClick={handleNext}
                className="hidden xl:block absolute -right-20 top-1/2 -translate-y-1/2 w-48 h-64 bg-[#141414] border border-[#2c2c2c] p-3 opacity-40 hover:opacity-90 transition-all duration-300 cursor-pointer scale-90 -z-0"
              >
                <div className="relative w-full h-36 overflow-hidden bg-black mb-2">
                  <Image
                    src={DISHES[(activeIndex + 1) % DISHES.length].image}
                    alt="Next dish"
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
                <div className="font-mono text-[11px] font-bold text-zinc-300 truncate">
                  {DISHES[(activeIndex + 1) % DISHES.length].name}
                </div>
                <div className="font-mono text-xs font-black text-[#f91814] mt-1">
                  {DISHES[(activeIndex + 1) % DISHES.length].price}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
