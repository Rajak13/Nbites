'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  MapPin,
  Clock,
  Star,
  Plus,
  SlidersHorizontal,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import {
  ItemCustomizationModal,
  MenuItemDetail,
} from '@/components/menu/ItemCustomizationModal';
import { getApiBaseUrl } from '@/lib/api-config';

interface RestaurantDetails {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  coverImage: string;
  address: string;
  zone: string;
  city: string;
  phone: string;
  isOpen: boolean;
  rating: number;
  reviewCount: number;
  estimatedPrepTimeMins: number;
  deliveryFeeBase: number;
  coordinates: { lng: number; lat: number };
  categories: {
    id: string;
    name: string;
    items: MenuItemDetail[];
  }[];
}

const FALLBACK_RESTAURANT: RestaurantDetails = {
  id: 'rest-ktm-1',
  name: 'Kathmandu Himalayan Grill',
  slug: 'himalayan-grill-jhamsikhel',
  tagline: 'Wood-fired sekuwa, Himalayan timur marinades & artisan momo crafts.',
  description:
    'Specialty smokehouse and momo guild operating in the heart of Jhamsikhel with synchronized kitchen telemetry.',
  coverImage: '/foods/1.jpg',
  address: 'Restaurant Lane, Ward 3, Jhamsikhel',
  zone: 'Jhamsikhel',
  city: 'Lalitpur',
  phone: '+977 1 5521000',
  isOpen: true,
  rating: 4.9,
  reviewCount: 482,
  estimatedPrepTimeMins: 18,
  deliveryFeeBase: 50,
  coordinates: { lng: 85.3168, lat: 27.6784 },
  categories: [
    {
      id: 'momos',
      name: 'ARTISAN MOMOS',
      items: [
        {
          id: 'momo-1',
          name: 'Smoked Timur Buff Jhol Momo',
          description:
            'Hand-pinched water buffalo dumplings submerged in roasted sesame, soybean, and wild timur pepper broth.',
          basePrice: 280,
          image: '/foods/main.jpg',
          prepTime: '14 mins',
          isVeg: false,
          restaurantId: 'rest-ktm-1',
          restaurantName: 'Kathmandu Himalayan Grill',
          groups: [
            {
              id: 'prep-style',
              title: 'Preparation Style',
              type: 'single',
              required: true,
              options: [
                { id: 'steamed', name: 'Steamed in Bamboo', price: 0 },
                { id: 'fried', name: 'Deep Golden Fried', price: 30 },
                { id: 'kothey', name: 'Pan-Seared Kothey', price: 40 },
                { id: 'c-momo', name: 'Wok Chilli (C-Momo)', price: 60 },
              ],
            },
            {
              id: 'addons',
              title: 'Artisan Dips & Add-ons',
              type: 'multi',
              required: false,
              options: [
                { id: 'extra-jhol', name: 'Extra Spiced Jhol Achar', price: 30 },
                { id: 'dalle-paste', name: 'Mountain Dalle Paste', price: 25 },
                { id: 'melted-cheese', name: 'Smoked Yak Cheese Melt', price: 65 },
              ],
            },
          ],
        },
        {
          id: 'momo-2',
          name: 'Kothey Chicken Dumplings',
          description:
            'Crispy pan-bottom chicken dumplings with scallions, minced ginger, and mild coriander butter.',
          basePrice: 260,
          image: '/foods/4.jpg',
          prepTime: '12 mins',
          isVeg: false,
          restaurantId: 'rest-ktm-1',
          restaurantName: 'Kathmandu Himalayan Grill',
          groups: [
            {
              id: 'prep-style',
              title: 'Preparation Style',
              type: 'single',
              required: true,
              options: [
                { id: 'kothey', name: 'Pan-Seared Kothey', price: 0 },
                { id: 'steamed', name: 'Steamed Classic', price: 0 },
                { id: 'c-momo', name: 'Spicy Chilli Glaze', price: 50 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'sekuwa',
      name: 'FIRE-ROASTED SEKUWA',
      items: [
        {
          id: 'sekuwa-1',
          name: 'Smoked Timur Pork Sekuwa',
          description:
            'Charcoal-roasted pork belly marinated for 18 hours in mustard oil, mountain timur, and crushed green chillies.',
          basePrice: 520,
          image: '/foods/2.jpg',
          prepTime: '18 mins',
          isVeg: false,
          restaurantId: 'rest-ktm-1',
          restaurantName: 'Kathmandu Himalayan Grill',
          groups: [
            {
              id: 'sides',
              title: 'Select Accompaniment',
              type: 'single',
              required: true,
              options: [
                { id: 'chiura', name: 'Crispy Baji (Chiura) & Achar', price: 0 },
                { id: 'pulao', name: 'Basmati Spiced Pulao', price: 60 },
                { id: 'furandana', name: 'Spiced Furandana Crunch', price: 20 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'bowls',
      name: 'FIRED NOODLE BOWLS',
      items: [
        {
          id: 'bowl-1',
          name: 'Kathmandu Highland Chili Thukpa',
          description:
            'Hand-pulled wheat noodles in slow-simmered bone broth with charred greens, garlic oil, and chili crunch.',
          basePrice: 380,
          image: '/foods/3.jpg',
          prepTime: '15 mins',
          isVeg: false,
          restaurantId: 'rest-ktm-1',
          restaurantName: 'Kathmandu Himalayan Grill',
          groups: [
            {
              id: 'spice-level',
              title: 'Heat Level',
              type: 'single',
              required: true,
              options: [
                { id: 'medium', name: 'Valley Mild (Normal)', price: 0 },
                { id: 'hot', name: 'Spicy Timur Fire', price: 0 },
                { id: 'dalle-extreme', name: 'Mountain Dalle Extreme', price: 30 },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default function RestaurantDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'himalayan-grill-jhamsikhel';

  const [restaurant, setRestaurant] = React.useState<RestaurantDetails>(FALLBACK_RESTAURANT);
  const [activeCategory, setActiveCategory] = React.useState<string>('momos');
  const [customizingItem, setCustomizingItem] = React.useState<MenuItemDetail | null>(null);
  const [addedItemIds, setAddedItemIds] = React.useState<Record<string, boolean>>({});

  const addItem = useCartStore((state) => state.addItem);

  React.useEffect(() => {
    async function loadRestaurant() {
      try {
        const apiUrl = getApiBaseUrl();
        const res = await fetch(`${apiUrl}/restaurants/${slug}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const d = json.data;
            const categories = (d.categories || []).map((cat: any) => ({
              ...cat,
              items: (cat.items || []).map((item: any) => ({
                ...item,
                image: item.image || '/foods/1.jpg',
                restaurantId: d.id,
                restaurantName: d.name,
                groups: item.groups || [],
              })),
            }));
            setRestaurant({ ...d, categories });
            if (categories.length > 0) setActiveCategory(categories[0].id);
          }
        }
      } catch {
        // Fallback remains active
      }
    }
    loadRestaurant();
  }, [slug]);

  const handleQuickAdd = (item: MenuItemDetail) => {
    const hasRequired = item.groups.some((g) => g.required);
    if (hasRequired) {
      setCustomizingItem(item);
      return;
    }

    addItem({
      menuItemId: item.id,
      name: item.name,
      basePrice: item.basePrice,
      price: item.basePrice,
      quantity: 1,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      selectedModifiers: [],
      image: item.image,
    });

    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text select-none pb-28 transition-colors duration-200">

      {/* ── Hero Banner ──────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[52vw] sm:h-[45vw] max-h-[520px] min-h-[300px] bg-[#1A1208] overflow-hidden pt-24">
        <Image
          src={restaurant.coverImage}
          alt={restaurant.name}
          fill
          priority
          className="object-cover opacity-50"
        />
        {/* Dynamic gradient that blends smoothly into current theme background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 60%, var(--theme-bg) 100%)',
          }}
        />

        {/* Back Link */}
        <div className="absolute top-6 sm:top-8 left-4 sm:left-8 z-20 mt-16 sm:mt-20">
          <Link
            href="/discovery"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-theme-bg/90 border border-theme-border font-mono text-xs uppercase tracking-wider text-theme-text hover:bg-black hover:text-white hover:border-black transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            All Kitchens
          </Link>
        </div>

        {/* Restaurant Info */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-6 sm:pb-8 z-20">
          <div className="max-w-5xl mx-auto space-y-2 sm:space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-[#f91814] text-white font-mono text-[10px] font-bold uppercase tracking-widest">
                OPEN &bull; {restaurant.estimatedPrepTimeMins} MINS PREP
              </span>
            </div>

            <h1
              className="text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[0.9] uppercase drop-shadow-lg"
              style={{ fontFamily: 'var(--font-clubstone), serif' }}
            >
              {restaurant.name}
            </h1>

            <p
              className="font-mono text-xs sm:text-sm text-zinc-200 max-w-2xl leading-relaxed drop-shadow"
              style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
            >
              {restaurant.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono text-zinc-300 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#f91814]" />
                {restaurant.address}
              </span>
              <span className="flex items-center gap-1 text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                {restaurant.rating} ({restaurant.reviewCount} Reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Category Bar ───────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 w-full bg-theme-header backdrop-blur-md border-b-2 border-theme-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
            {restaurant.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 sm:px-4 py-2 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider border-2 transition-all shrink-0 cursor-pointer rounded-none ${
                  activeCategory === cat.id
                    ? 'bg-[#f91814] text-white border-[#f91814] shadow-[3px_3px_0px_0px_#f91814]'
                    : 'bg-transparent text-theme-muted border-theme-border hover:border-theme-text hover:text-theme-text'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Menu Grid ────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-8 sm:pt-10 space-y-12 sm:space-y-16">
        {restaurant.categories.map((cat) => (
          <section key={cat.id} id={cat.id} className="space-y-5 sm:space-y-6">
            <div className="flex items-center justify-between pb-3 border-b-2 border-theme-border">
              <h2
                className="text-xl sm:text-2xl md:text-3xl text-theme-text tracking-tight uppercase"
                style={{ fontFamily: 'var(--font-clubstone), serif' }}
              >
                {cat.name}
              </h2>
              <span className="font-mono text-[10px] text-theme-muted uppercase hidden sm:block">
                {cat.items.length} DISHES
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {cat.items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 bg-theme-surface border-2 border-theme-border hover:border-[#f91814] transition-all flex flex-col justify-between group"
                >
                  <div className="flex gap-3 sm:gap-4">
                    {/* Item Image */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 shrink-0 border-2 border-theme-border overflow-hidden bg-black/20">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Dish Info */}
                    <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.isVeg ? 'bg-emerald-600' : 'bg-[#f91814]'
                          }`}
                        />
                        <span className="font-mono text-[10px] text-theme-muted uppercase">
                          {item.prepTime || '15 MINS'}
                        </span>
                      </div>

                      <h3
                        className="text-sm sm:text-base md:text-lg text-theme-text tracking-tight leading-snug"
                        style={{ fontFamily: 'var(--font-clubstone), serif' }}
                      >
                        {item.name}
                      </h3>

                      <p className="font-mono text-[10px] sm:text-xs text-theme-muted leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      <div className="font-mono text-sm sm:text-base font-black text-[#f91814] pt-0.5">
                        Rs. {item.basePrice}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2.5 pt-3 mt-3 border-t border-theme-border">
                    {item.groups && item.groups.length > 0 ? (
                      <button
                        onClick={() => setCustomizingItem(item)}
                        className="px-3 sm:px-4 py-2 bg-transparent text-theme-text border-2 border-theme-text font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider hover:bg-[#f91814] hover:text-white hover:border-[#f91814] transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <SlidersHorizontal className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        CUSTOMIZE
                      </button>
                    ) : (
                      <button
                        onClick={() => handleQuickAdd(item)}
                        className={`px-3 sm:px-4 py-2 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider border-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                          addedItemIds[item.id]
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-[#f91814] text-white border-[#f91814] hover:bg-black hover:border-black'
                        }`}
                      >
                        {addedItemIds[item.id] ? (
                          <>
                            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            ADDED
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            ADD
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Customization Modal */}
      <ItemCustomizationModal
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
      />
    </div>
  );
}
