'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Button } from '@/components/ui/button';
import {
  ChefHat,
  Bike,
  CheckCircle2,
  Phone,
  Clock,
  Radio,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = (params?.id as string) || 'ORD-KTM-8942';

  const [etaMinutes, setEtaMinutes] = React.useState(16);
  const [riderCoords, setRiderCoords] = React.useState({
    lat: 27.7172,
    lng: 85.324,
  });

  // Simulated live socket rider coordinate updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setRiderCoords((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.0005,
        lng: prev.lng + (Math.random() - 0.5) * 0.0005,
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#27272A] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Chip variant="active" pulse>
              Live Telemetry Active
            </Chip>
            <span className="font-mono text-xs text-[#A1A1AA]">
              Socket: ws://api.nbites.internal
            </span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F5F0]">
            Tracking Order #{orderId}
          </h1>
        </div>

        <div className="bg-[#141414] border-2 border-[#27272A] px-5 py-3 flex items-center gap-4">
          <Clock className="w-6 h-6 text-[#F97316] animate-pulse" />
          <div>
            <div className="text-[10px] font-mono text-[#A1A1AA] uppercase">
              Estimated Arrival
            </div>
            <div className="font-mono text-xl font-black text-[#F5F5F0]">
              ~{etaMinutes} Minutes
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Milestones & Map Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Milestones */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-lg">Order State Machine</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-6">
              {/* Step 1: Order Confirmed */}
              <div className="flex gap-4 items-start">
                <div className="h-8 w-8 bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#F5F5F0]">
                    Order Confirmed & Paid
                  </div>
                  <div className="text-xs text-[#A1A1AA] font-mono">
                    eSewa Txn #ESW-9841289 &bull; 15:32 NPT
                  </div>
                </div>
              </div>

              {/* Step 2: Kitchen KDS Preparing */}
              <div className="flex gap-4 items-start">
                <div className="h-8 w-8 bg-[#F97316]/20 border border-[#F97316] text-[#F97316] flex items-center justify-center shrink-0">
                  <ChefHat className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#F5F5F0]">
                    Kitchen Searing & Plating (KDS Station 1)
                  </div>
                  <div className="text-xs text-[#A1A1AA] font-mono">
                    Bajeko Sekuwa Jhamsikhel &bull; Ticket #TK-482
                  </div>
                </div>
              </div>

              {/* Step 3: Rider Dispatch */}
              <div className="flex gap-4 items-start opacity-75">
                <div className="h-8 w-8 bg-zinc-900 border border-zinc-700 text-zinc-400 flex items-center justify-center shrink-0">
                  <Bike className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-sm text-zinc-400">
                    Rider Radial Dispatch Assigned
                  </div>
                  <div className="text-xs text-[#71717A] font-mono">
                    Rider: Bikash Maharjan (Hero Splendor BA 89 PA 4321)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rider Profile Card */}
          <Card className="border-2 border-[#27272A] bg-[#141414] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-zinc-900 border border-zinc-700 flex items-center justify-center font-bold text-lg text-[#F97316]">
                  NB
                </div>
                <div>
                  <div className="font-bold text-sm text-[#F5F5F0]">
                    Bikash Maharjan
                  </div>
                  <div className="text-xs text-[#A1A1AA] font-mono">
                    nBites Express Driver &bull; ★ 4.95
                  </div>
                </div>
              </div>
              <Button variant="brutalistDark" size="sm">
                <Phone className="w-4 h-4 mr-1.5" />
                Call Driver
              </Button>
            </div>
          </Card>
        </div>

        {/* Right: GPS Telemetry Visualizer */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="p-6 bg-[#0B0B0B] border-2 border-[#27272A] min-h-[360px] flex flex-col justify-between relative overflow-hidden">
            {/* Telemetry Radar Grid Overlay */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 50% 50%, #f97316 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#F97316] animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#F5F5F0]">
                  Turf.js Radial GPS Coordinates
                </span>
              </div>
              <Chip variant="live" pulse>
                Streaming
              </Chip>
            </div>

            {/* Simulated Coordinate HUD */}
            <div className="space-y-3 font-mono text-xs z-10 bg-[#141414]/90 p-4 border border-[#27272A] my-auto">
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Rider Latitude</span>
                <span className="text-emerald-400">{riderCoords.lat.toFixed(6)} N</span>
              </div>
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Rider Longitude</span>
                <span className="text-emerald-400">{riderCoords.lng.toFixed(6)} E</span>
              </div>
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Kathmandu Radial Sector</span>
                <span className="text-[#F97316]">Sector 4 (Patan / Jhamsikhel)</span>
              </div>
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Route Bearing</span>
                <span className="text-[#F5F5F0]">34.2&deg; NNE</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#27272A] text-xs font-mono text-[#71717A]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                Destination: Lazimpat Heights
              </span>
              <Link href="/discovery" className="text-[#F97316] hover:underline">
                Back to Discovery &rarr;
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
