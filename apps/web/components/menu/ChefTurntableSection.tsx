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
  ArrowRight,
} from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';

interface DishItem {
  id: number;
  category: string;
  name: string;
  price: string;
  image: string;
  prepTime: string;
  restaurant: string;
}

const CATEGORIES = [
  'ALL',
  'MOMOS & DUMPLINGS',
  'SMASH BURGERS',
  'WOOD-FIRED PIZZA',
  'CRISPY BITES',
];

const DISHES: DishItem[] = [
  {
    id: 1,
    category: 'MOMOS & DUMPLINGS',
    name: 'Himalayan Steamed Buff Momo',
    price: 'Rs. 320',
    image: '/foods/main.jpg',
    prepTime: '12 MINS',
    restaurant: 'Everest Kitchen • Lazimpat',
  },
  {
    id: 2,
    category: 'MOMOS & DUMPLINGS',
    name: 'Crispy Pan-Seared Kothey',
    price: 'Rs. 360',
    image: '/foods/1.jpg',
    prepTime: '14 MINS',
    restaurant: 'Kathmandu Dumpling Co. • Patan',
  },
  {
    id: 3,
    category: 'SMASH BURGERS',
    name: 'Double Smash Timur Burger',
    price: 'Rs. 480',
    image: '/foods/2.jpg',
    prepTime: '15 MINS',
    restaurant: 'The Sizzle House • Jhamsikhel',
  },
  {
    id: 4,
    category: 'WOOD-FIRED PIZZA',
    name: 'Artisan Pepperoni Sourdough',
    price: 'Rs. 750',
    image: '/foods/3.jpg',
    prepTime: '18 MINS',
    restaurant: 'Fire & Dough • Baluwatar',
  },
  {
    id: 5,
    category: 'CRISPY BITES',
    name: 'Mountain Spiced Fried Crunch',
    price: 'Rs. 420',
    image: '/foods/4.jpg',
    prepTime: '11 MINS',
    restaurant: 'Golden Bird Kitchen • Thamel',
  },
];

export function ChefTurntableSection() {
  const [activeCategory, setActiveCategory] = React.useState('ALL');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [addedDishId, setAddedDishId] = React.useState<number | null>(null);

  // Filtered list based on active category
  const filteredDishes = React.useMemo(() => {
    if (activeCategory === 'ALL') return DISHES;
    return DISHES.filter((d) => d.category === activeCategory);
  }, [activeCategory]);

  // Reset activeIndex if it exceeds filtered length
  React.useEffect(() => {
    setActiveIndex(0);
  }, [activeCategory]);

  const activeDish = filteredDishes[activeIndex % filteredDishes.length] || DISHES[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % filteredDishes.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + filteredDishes.length) % filteredDishes.length);
  };

  const addItem = useCartStore((state) => state.addItem);

  const handleQuickAdd = (dish: (typeof DISHES)[0]) => {
    setAddedDishId(dish.id);
    const numericPrice = parseInt(dish.price.replace(/\D/g, ''), 10) || 350;
    addItem({
      menuItemId: `dish-${dish.id}`,
      name: dish.name,
      basePrice: numericPrice,
      price: numericPrice,
      quantity: 1,
      restaurantId: 'rest-ktm-1',
      restaurantName: dish.restaurant.split('•')[0].trim(),
      selectedModifiers: [],
      image: dish.image,
    });
    setTimeout(() => {
      setAddedDishId(null);
    }, 1500);
  };

  // Helper for upcoming trail items
  const getUpcomingDish = (offset: number) => {
    return filteredDishes[(activeIndex + offset) % filteredDishes.length];
  };

  return (
    <section className="relative w-full bg-[#f5e3cd] text-[#18120e] border-t-[3px] border-[#18120e] pt-14 pb-12 px-6 md:px-12 lg:px-16 select-none overflow-hidden">
      <div className="max-w-[1440px] mx-auto space-y-10">
        
        {/* 1. SECTION HEADER (Top-aligned, full-width baseline) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b-[2px] border-[#18120e]">
          
          {/* Left Title & Label */}
          <div className="space-y-1.5 text-left">
            <div className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-[#7a6e65]">
              SECTION 02 // LIVE DISPATCH SELECTIONS
            </div>
            <h2
              className="text-2xl sm:text-3xl lg:text-[32px] font-black text-[#18120e] tracking-tight leading-tight"
              style={{ fontFamily: 'var(--font-clubstone), "Inter Display", sans-serif' }}
            >
              Explore Today&apos;s Top Kitchen Deliveries
            </h2>
          </div>

          {/* Right Filter Chips Row */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer rounded-none border-2 border-[#18120e] shrink-0 ${
                  activeCategory === cat
                    ? 'bg-[#f91814] text-white shadow-[3px_3px_0px_0px_#18120e]'
                    : 'bg-white text-[#18120e] hover:bg-[#f5e3cd] hover:shadow-[2px_2px_0px_0px_#18120e]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* 2. INTERACTIVE DEPTH CAROUSEL DECK (Central Interactive Area) */}
        <div className="relative w-full py-6 sm:py-10 flex items-center justify-center min-h-[460px]">
          
          {/* Main Stage Grid: Chevrons flanking the Dish + Depth Trail */}
          <div className="w-full flex items-center justify-between gap-4 md:gap-8 max-w-5xl mx-auto">
            
            {/* Left Chevron Button */}
            <button
              onClick={handlePrev}
              aria-label="Previous dish"
              className="w-12 h-12 sm:w-14 sm:h-14 bg-[#18120e] text-white border-2 border-[#18120e] rounded-none shadow-[4px_4px_0px_0px_#18120e] flex items-center justify-center hover:bg-[#f91814] transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 shrink-0 z-30"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>

            {/* Active Center Dish + Receding Right Trail Container */}
            <div className="relative flex-1 flex items-center justify-center lg:justify-start lg:pl-12">
              
              {/* Active Focal Dish Stage (Scale 1.0) */}
              <div className="relative z-20 flex flex-col items-center">
                
                {/* Floating Pill Tag (Top-Right) */}
                <div className="absolute -top-3 sm:-top-4 right-0 sm:right-2 z-30 bg-[#FFFFFF] border-[1.5px] border-[#18120e] text-[#18120e] px-3 sm:px-4 py-1 rounded-full font-mono text-xs font-bold shadow-[2px_2px_0px_0px_#18120e] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f91814]" />
                  <span>{activeDish.category}</span>
                </div>

                {/* Pedestal / Circular High-Res Dish Base */}
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-88 md:h-88 rounded-full border-4 border-[#18120e] shadow-[8px_8px_0px_0px_#18120e] overflow-hidden bg-white">
                  <Image
                    src={activeDish.image}
                    alt={activeDish.name}
                    fill
                    priority
                    sizes="(max-width: 640px) 260px, 360px"
                    className="object-cover object-center transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* Floating Espresso Card Anchored to Dish Base */}
                <div className="w-full max-w-sm bg-[#18120e] text-white rounded-none border-2 border-[#18120e] shadow-[4px_4px_0px_0px_#f91814] p-4 sm:p-5 flex items-center justify-between gap-4 -mt-6 sm:-mt-8 relative z-20">
                  
                  {/* Left: Dish Name & Price */}
                  <div className="space-y-0.5 text-left truncate pr-2">
                    <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest truncate">
                      {activeDish.restaurant}
                    </div>
                    <h3
                      className="text-base sm:text-lg font-bold text-white leading-tight truncate"
                      style={{ fontFamily: 'var(--font-clubstone), "Inter Display", sans-serif' }}
                    >
                      {activeDish.name}
                    </h3>
                    <div className="text-lg sm:text-xl font-black text-[#f91814] tracking-tight">
                      {activeDish.price}
                    </div>
                  </div>

                  {/* Right: Square Vibrant Red "+" Button */}
                  <button
                    onClick={() => handleQuickAdd(activeDish)}
                    aria-label="Add to order"
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-none border border-[#18120e] flex items-center justify-center transition-all cursor-pointer shrink-0 active:translate-x-0.5 active:translate-y-0.5 ${
                      addedDishId === activeDish.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#f91814] text-white hover:bg-white hover:text-[#18120e]'
                    }`}
                  >
                    {addedDishId === activeDish.id ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <Plus className="w-6 h-6" />
                    )}
                  </button>

                </div>

              </div>

              {/* Receding Right Perspective Trail (Scale: 0.75, 0.5) */}
              {filteredDishes.length > 1 && (
                <div className="hidden md:flex items-center gap-6 absolute left-[62%] lg:left-[58%] top-1/2 -translate-y-1/2 z-10 pointer-events-auto">
                  
                  {/* Trail Item 1 (Scale 0.75, Opacity 80%) */}
                  <div
                    onClick={handleNext}
                    className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full border-3 border-[#18120e] shadow-[4px_4px_0px_0px_#18120e] overflow-hidden bg-white opacity-80 hover:opacity-100 hover:scale-95 transition-all duration-300 cursor-pointer shrink-0 scale-90"
                  >
                    <Image
                      src={getUpcomingDish(1).image}
                      alt={getUpcomingDish(1).name}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  </div>

                  {/* Trail Item 2 (Scale 0.5, Opacity 50%) */}
                  {filteredDishes.length > 2 && (
                    <div
                      onClick={() => setActiveIndex((prev) => (prev + 2) % filteredDishes.length)}
                      className="hidden lg:block relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-[#18120e] shadow-[3px_3px_0px_0px_#18120e] overflow-hidden bg-white opacity-50 hover:opacity-80 hover:scale-80 transition-all duration-300 cursor-pointer shrink-0 scale-75"
                    >
                      <Image
                        src={getUpcomingDish(2).image}
                        alt={getUpcomingDish(2).name}
                        fill
                        sizes="130px"
                        className="object-cover"
                      />
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Right Chevron Button */}
            <button
              onClick={handleNext}
              aria-label="Next dish"
              className="w-12 h-12 sm:w-14 sm:h-14 bg-[#18120e] text-white border-2 border-[#18120e] rounded-none shadow-[4px_4px_0px_0px_#18120e] flex items-center justify-center hover:bg-[#f91814] transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 shrink-0 z-30"
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>

          </div>

        </div>

        {/* 3. BOTTOM INFO BAR (Minimal Footer Strip) */}
        <div className="border-t-2 border-[#18120e] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          {/* Left: Monospace Rating & Dispatches Stat */}
          <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold text-[#18120e] uppercase tracking-wider">
            <Star className="w-4 h-4 text-[#f91814] fill-[#f91814]" />
            <span>4.9/5 RATING &bull; 1,000+ DISPATCHES THIS WEEK</span>
          </div>

          {/* Right: Clean Inline Link */}
          <Link
            href="/discovery"
            className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#18120e] hover:text-[#f91814] underline decoration-[#18120e] hover:decoration-[#f91814] decoration-2 underline-offset-4 transition-colors group"
            style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
          >
            <span>View Complete Menu Catalog</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

        </div>

      </div>
    </section>
  );
}
