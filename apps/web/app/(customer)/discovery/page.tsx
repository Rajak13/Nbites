'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Search, MapPin, Star, Flame } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/api-config';
import { useAuthStore } from '@/lib/auth';

interface KitchenItem {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  coverImage: string;
  address: string;
  zone: string;
  city: string;
  isOpen: boolean;
  rating: number;
  reviewCount: number;
  estimatedPrepTimeMins: number;
  deliveryFee: number;
  specialties: string[];
}

const FALLBACK_KITCHENS: KitchenItem[] = [
  {
    id: 'rest-dh-1',
    name: 'Dharan Bhanuchowk Sekuwa Corner',
    slug: 'dharan-bhanuchowk-sekuwa',
    tagline: 'Legendary charcoal-smoked pork sekuwa, sukuti fry & Eastern mountain herbs.',
    coverImage: '/foods/2.jpg',
    address: 'Bhanuchowk Commercial Sector, Ward 1',
    zone: 'Bhanuchowk',
    city: 'Dharan',
    isOpen: true,
    rating: 4.9,
    reviewCount: 620,
    estimatedPrepTimeMins: 16,
    deliveryFee: 40,
    specialties: ['CHARCOAL PORK SEKUWA', 'BUFF SUKUTI SADEKO', 'TIMUR ACHAR'],
  },
  {
    id: 'rest-dh-2',
    name: 'Dharan BPKIHS Artisan Food Guild',
    slug: 'dharan-bpkihs-food-guild',
    tagline: 'Handcrafted momo crafts, slow-braised thukpa & Eastern street delicacies.',
    coverImage: '/foods/main.jpg',
    address: 'Hospital Road, BPKIHS Gate 2',
    zone: 'BPKIHS',
    city: 'Dharan',
    isOpen: true,
    rating: 4.8,
    reviewCount: 440,
    estimatedPrepTimeMins: 15,
    deliveryFee: 40,
    specialties: ['BUFF JHOL MOMO', 'CHICKEN THUKPA', 'CHILI WONTONS'],
  },
  {
    id: 'rest-ktm-1',
    name: 'Kathmandu Himalayan Grill',
    slug: 'himalayan-grill-jhamsikhel',
    tagline: 'Wood-fired sekuwa, Himalayan timur marinades & artisan momo crafts.',
    coverImage: '/foods/1.jpg',
    address: 'Restaurant Lane, Ward 3, Jhamsikhel',
    zone: 'Jhamsikhel',
    city: 'Lalitpur',
    isOpen: true,
    rating: 4.9,
    reviewCount: 482,
    estimatedPrepTimeMins: 18,
    deliveryFee: 50,
    specialties: ['BUFF JHOL MOMO', 'TIMUR PORK SEKUWA', 'CHILI THUKPA'],
  },
  {
    id: 'rest-ktm-2',
    name: 'Old Town Newari Kitchen',
    slug: 'old-town-newari-kitchen',
    tagline: 'Centuries-old heritage Newari recipes from the historic alleys of Patan.',
    coverImage: '/foods/main.jpg',
    address: 'Mangalbazar Durbar Square, Patan',
    zone: 'Patan Durbar',
    city: 'Lalitpur',
    isOpen: true,
    rating: 4.8,
    reviewCount: 340,
    estimatedPrepTimeMins: 20,
    deliveryFee: 50,
    specialties: ['SAMAY BAJI SET', 'BUFF CHOILA', 'STONE-GROUND ACHAR'],
  },
  {
    id: 'rest-ktm-3',
    name: 'Artisan Wood Fired Co.',
    slug: 'artisan-wood-fired-baluwatar',
    tagline: 'Slow-fermented 72-hour sourdough pizzas baked at 450°C.',
    coverImage: '/foods/3.jpg',
    address: 'Speaker Marg, Baluwatar',
    zone: 'Baluwatar',
    city: 'Kathmandu',
    isOpen: true,
    rating: 4.9,
    reviewCount: 512,
    estimatedPrepTimeMins: 22,
    deliveryFee: 50,
    specialties: ['TIMUR PEPPERONI', 'SMOKED MOZZARELLA', 'TRUFFLE FRIES'],
  },
  {
    id: 'rest-pkr-1',
    name: 'Phewa Lakeside Smokehouse',
    slug: 'phewa-lakeside-smokehouse',
    tagline: 'Fresh mountain trout grill, wild herbs & Himalayan firewood skewers.',
    coverImage: '/hero/1.jpg',
    address: 'Baidam, Center Point, Lakeside',
    zone: 'Lakeside',
    city: 'Pokhara',
    isOpen: true,
    rating: 4.9,
    reviewCount: 390,
    estimatedPrepTimeMins: 20,
    deliveryFee: 50,
    specialties: ['GRILLED PHEWA TROUT', 'MUSTANG CHILI POTATO', 'SMOKED DUCK'],
  },
];

const CITIES = ['DHARAN', 'KATHMANDU', 'LALITPUR', 'POKHARA', 'CHITWAN', 'BIRATNAGAR'];

export default function DiscoveryPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);
  const selectedCity = useAuthStore((state) => state.selectedCity) || 'Dharan';
  const setSelectedCity = useAuthStore((state) => state.setSelectedCity);

  const [kitchens, setKitchens] = React.useState<KitchenItem[]>(FALLBACK_KITCHENS);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  const handleEnterKitchen = (slug: string) => {
    if (!token || !user) {
      openAuthModal(() => {
        router.push(`/restaurant/${slug}`);
      });
      return;
    }
    router.push(`/restaurant/${slug}`);
  };

  React.useEffect(() => {
    async function loadKitchens() {
      try {
        const apiUrl = getApiBaseUrl();
        const res = await fetch(`${apiUrl}/restaurants`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const mapped: KitchenItem[] = json.data.map((k: any) => ({
              id: k.id,
              name: k.name,
              slug: k.slug,
              tagline: k.tagline || 'Artisan kitchen.',
              coverImage: k.coverImage || '/foods/1.jpg',
              address: k.address,
              zone: k.zone,
              city: k.city || 'Kathmandu',
              isOpen: k.isOpen ?? true,
              rating: k.rating || 4.8,
              reviewCount: k.reviewCount || 120,
              estimatedPrepTimeMins: k.estimatedPrepTimeMins || 20,
              deliveryFee: k.deliveryFeeBase || 50,
              specialties:
                k.slug.includes('sekuwa')
                  ? ['CHARCOAL PORK SEKUWA', 'BUFF SUKUTI SADEKO', 'TIMUR ACHAR']
                  : k.slug.includes('newari')
                  ? ['SAMAY BAJI SET', 'BUFF CHOILA', 'STONE-GROUND ACHAR']
                  : k.slug.includes('wood-fired')
                  ? ['SOURDOUGH PIZZA', 'TIMUR CRUST', 'TRUFFLE FRIES']
                  : ['BUFF JHOL MOMO', 'TIMUR SEKUWA', 'CHILI THUKPA'],
            }));

            // Merge with fallback kitchens to ensure Dharan and all cities have data
            const existingSlugs = new Set(mapped.map((m) => m.slug));
            const missingFallbacks = FALLBACK_KITCHENS.filter((f) => !existingSlugs.has(f.slug));
            setKitchens([...mapped, ...missingFallbacks]);
          }
        }
      } catch {
        // Fallback already initialized
      } finally {
        setIsLoading(false);
      }
    }
    loadKitchens();
  }, []);

  const filteredKitchens = kitchens.filter((k) => {
    const matchesCity = k.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === '' ||
      k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text pt-24 sm:pt-28 md:pt-32 pb-24 select-none transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">

        {/* ── Masthead ──────────────────────────────────────────────────────── */}
        <div className="border-b-2 border-theme-border pb-8 sm:pb-10 mb-10 sm:mb-12 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#f91814]" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#f91814] font-bold">
              NEPAL NATIONWIDE // ACTIVE KITCHEN HUBS
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6">
            <div>
              <h1
                className="text-5xl sm:text-7xl lg:text-8xl text-theme-text tracking-tight uppercase leading-[0.88]"
                style={{ fontFamily: 'var(--font-clubstone), serif' }}
              >
                KITCHEN INDEX.
              </h1>
              <p
                className="font-mono text-xs sm:text-sm text-theme-muted max-w-xl pt-3 sm:pt-4 leading-relaxed"
                style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
              >
                Independent wood-fired smokehouses, centuries-old Newari culinary guilds, and slow-fermented ovens across the valley.
              </p>
            </div>

            {/* Search */}
            <div className="w-full lg:w-96">
              <div className="relative border-2 border-theme-border bg-theme-surface focus-within:border-[#f91814] transition-colors">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH KITCHENS, DISHES, SECTORS..."
                  className="w-full bg-transparent pl-10 pr-4 py-3 font-mono text-xs text-theme-text placeholder:text-theme-muted/60 focus:outline-none uppercase tracking-wider"
                />
              </div>
            </div>
          </div>

          {/* City Selection Tabs */}
          <div className="space-y-2 pt-4 sm:pt-6">
            <div className="flex items-center justify-between text-xs font-mono text-theme-muted">
              <span className="uppercase tracking-widest font-bold text-theme-text flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#f91814]" />
                ACTIVE DELIVERY MARKET: <strong className="text-[#f91814]">{selectedCity.toUpperCase()}</strong>
              </span>
              <span className="text-[11px] hidden sm:inline">Hyper-Local Dispatch Only</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              {CITIES.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 sm:px-4 py-2 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider border-2 transition-all shrink-0 cursor-pointer rounded-none ${
                    selectedCity.toUpperCase() === city
                      ? 'bg-[#f91814] text-white border-[#f91814] shadow-[3px_3px_0px_0px_#f91814]'
                      : 'bg-transparent text-theme-muted border-theme-border hover:border-theme-text hover:text-theme-text'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Kitchen Cards Grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
          {filteredKitchens.map((kitchen, idx) => (
            <article
              key={kitchen.id}
              className="group border-2 border-theme-border bg-theme-surface hover:border-[#f91814] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Cover Image */}
                <div className="relative w-full aspect-[16/9] border-b-2 border-theme-border overflow-hidden bg-black/20">
                  <Image
                    src={kitchen.coverImage}
                    alt={kitchen.name}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Top Corner Meta Tag */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-theme-bg border border-theme-border font-mono text-[10px] font-bold uppercase tracking-widest text-theme-text">
                      SECTOR {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 md:p-8 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-theme-muted">
                      <span className="flex items-center gap-1 text-theme-text">
                        <MapPin className="w-3.5 h-3.5 text-[#f91814] shrink-0" />
                        {kitchen.zone}, {kitchen.city}
                      </span>
                      <span className="flex items-center gap-1 shrink-0 text-[#f91814] font-bold text-[11px]">
                        <Flame className="w-3.5 h-3.5 text-[#f91814]" />
                        LIVE KITCHEN
                      </span>
                    </div>

                    <h2
                      className="text-2xl sm:text-3xl md:text-4xl text-theme-text tracking-tight leading-tight group-hover:text-[#f91814] transition-colors"
                      style={{ fontFamily: 'var(--font-clubstone), serif' }}
                    >
                      {kitchen.name}
                    </h2>

                    <p
                      className="font-mono text-xs sm:text-sm text-theme-muted leading-relaxed line-clamp-2"
                      style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
                    >
                      {kitchen.tagline}
                    </p>
                  </div>

                  {/* Specialties */}
                  <div className="pt-2 border-t border-theme-border flex flex-wrap gap-2">
                    {kitchen.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="px-2.5 py-1 bg-theme-bg border border-theme-border font-mono text-[10px] uppercase tracking-wider text-theme-muted"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 sm:px-6 md:px-8 py-4 sm:py-5 border-t-2 border-theme-border bg-theme-surface-alt flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 font-mono text-xs text-theme-text font-bold">
                  <Star className="w-4 h-4 fill-[#f91814] text-[#f91814]" />
                  <span>{kitchen.rating}</span>
                  <span className="text-theme-muted font-normal">({kitchen.reviewCount} Reviews)</span>
                </div>

                <button
                  onClick={() => handleEnterKitchen(kitchen.slug)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#f91814] text-white border-2 border-[#f91814] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-black hover:border-black hover:shadow-[3px_3px_0px_0px_#f91814] transition-all cursor-pointer"
                >
                  <span>ENTER KITCHEN</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredKitchens.length === 0 && !isLoading && (
          <div className="py-20 text-center space-y-4 border-2 border-dashed border-theme-border p-8 sm:p-10 bg-theme-surface/40">
            <div className="w-12 h-12 border-2 border-[#f91814] flex items-center justify-center mx-auto text-[#f91814]">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-mono text-base text-theme-text font-bold uppercase tracking-wider">
              {searchQuery ? 'NO MATCHING KITCHENS FOUND' : `NO ACTIVE KITCHENS IN ${selectedCity.toUpperCase()} YET`}
            </h3>
            <p className="font-mono text-xs sm:text-sm text-theme-muted max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? `No kitchens in ${selectedCity} match "${searchQuery}". Try clearing your search.`
                : `To prevent food spoilage and excessive courier travel costs, nBites only delivers within local operational zones. We are currently active in Dharan, Kathmandu, and Pokhara.`}
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-[#f91814] text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors cursor-pointer"
                >
                  CLEAR SEARCH
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedCity('Dharan')}
                    className="px-4 py-2 bg-[#f91814] text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors cursor-pointer"
                  >
                    SWITCH TO DHARAN &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCity('Kathmandu')}
                    className="px-4 py-2 border-2 border-theme-text text-theme-text font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#f91814] hover:text-white hover:border-[#f91814] transition-colors cursor-pointer"
                  >
                    SWITCH TO KATHMANDU
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
