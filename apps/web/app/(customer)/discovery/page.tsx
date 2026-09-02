import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Search, SlidersHorizontal, MapPin, Star, Flame, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DiscoveryPage() {
  const KITCHENS = [
    {
      name: 'Kathmandu Himalayan Grill',
      zone: 'Jhamsikhel',
      cuisine: 'Sekuwa & Smokehouse',
      rating: 4.9,
      distance: '1.8 km',
      prepAvg: '14 min',
      badge: 'nBites Choice',
    },
    {
      name: 'Old Town Newari Kitchen',
      zone: 'Patan Durbar',
      cuisine: 'Traditional Choila & Samay Baji',
      rating: 4.8,
      distance: '2.4 km',
      prepAvg: '18 min',
      badge: 'Heritage',
    },
    {
      name: 'Artisan Wood Fired Co.',
      zone: 'Baluwatar',
      cuisine: 'Neapolitan Sourdough',
      rating: 4.9,
      distance: '3.1 km',
      prepAvg: '20 min',
      badge: 'Popular',
    },
    {
      name: 'Yak & Momo Guild',
      zone: 'Thamel',
      cuisine: 'Dumplings & Broths',
      rating: 4.7,
      distance: '0.9 km',
      prepAvg: '11 min',
      badge: 'Fast Dispatch',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 space-y-10">
      {/* Discovery Header */}
      <div className="border-b-2 border-[#27272A] pb-8 space-y-4">
        <div className="flex items-center gap-2">
          <Chip variant="brand">Radial Logistics</Chip>
          <Chip variant="neutral">Kathmandu Valley</Chip>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-[#F5F5F0]">
          Kitchen Discovery Index
        </h1>
        <p className="font-body text-[#A1A1AA] max-w-2xl text-base">
          Browse verified master kitchens operating with synchronized Kitchen Display Systems for lightning turnaround.
        </p>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
            <input
              type="text"
              placeholder="Search dishes, cuisines, or Kathmandu locations..."
              className="w-full bg-[#141414] border-2 border-[#27272A] pl-11 pr-4 py-3 text-sm text-[#F5F5F0] placeholder-[#71717A] focus:outline-none focus:border-[#F97316] font-mono"
            />
          </div>
          <Button variant="brutalistDark" className="shrink-0">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters (Active Zone: 5km)
          </Button>
        </div>
      </div>

      {/* Kitchen List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {KITCHENS.map((k) => (
          <Card key={k.name} className="hover:border-[#F97316] transition-all">
            <CardHeader className="p-6 pb-4">
              <div className="flex items-center justify-between mb-2">
                <Chip variant="active">{k.badge}</Chip>
                <div className="flex items-center gap-1 text-amber-400 font-mono text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {k.rating}
                </div>
              </div>
              <CardTitle className="text-2xl">{k.name}</CardTitle>
              <div className="flex items-center gap-4 text-xs font-mono text-[#A1A1AA] pt-1">
                <span className="flex items-center gap-1 text-[#F97316]">
                  <MapPin className="w-3.5 h-3.5" />
                  {k.zone} &bull; {k.distance}
                </span>
                <span>{k.cuisine}</span>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-2 flex items-center justify-between border-t border-[#27272A]">
              <div className="flex items-center gap-2 font-mono text-xs text-[#A1A1AA]">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                <span>Avg KDS: {k.prepAvg}</span>
              </div>
              <Link href="/checkout">
                <Button variant="primary" size="sm">
                  View Menu
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
