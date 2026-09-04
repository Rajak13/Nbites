'use client';

import * as React from 'react';
import { X, MapPin, Navigation, Check, Search } from 'lucide-react';
import { KATHMANDU_HUBS, KathmanduLocation, NepalRegion } from '@/lib/kathmandu-locations';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (loc: { landmark: string; lat: number; lng: number }) => void;
  initialCoords?: { lat: number; lng: number };
}

const REGIONS: NepalRegion[] = [
  'All Nepal',
  'Kathmandu Valley',
  'Pokhara',
  'Chitwan',
  'Eastern Nepal',
  'Lumbini & West',
];

export function LocationPickerModal({
  isOpen,
  onClose,
  onSelectLocation,
  initialCoords = { lat: 27.7172, lng: 85.324 },
}: LocationPickerModalProps) {
  const [coords, setCoords] = React.useState(initialCoords);
  const [selectedHub, setSelectedHub] = React.useState<KathmanduLocation>(KATHMANDU_HUBS[0]);
  const [selectedRegion, setSelectedRegion] = React.useState<NepalRegion>('All Nepal');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLocating, setIsLocating] = React.useState(false);

  if (!isOpen) return null;

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lng = parseFloat(pos.coords.longitude.toFixed(4));
        setCoords({ lat, lng });
        setIsLocating(false);
      },
      (err) => {
        console.warn('GPS location error:', err);
        setIsLocating(false);
        alert('Could not acquire GPS coordinates. Please select your sector manually.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSelectHub = (hub: KathmanduLocation) => {
    setSelectedHub(hub);
    setCoords({ lat: hub.lat, lng: hub.lng });
  };

  const handleConfirm = () => {
    onSelectLocation({
      landmark: `${selectedHub.name}, ${selectedHub.landmark} (${selectedHub.city})`,
      lat: coords.lat,
      lng: coords.lng,
    });
    onClose();
  };

  const filteredHubs = KATHMANDU_HUBS.filter((h) => {
    const hubRegion = h.region || 'Kathmandu Valley';
    if (selectedRegion !== 'All Nepal' && hubRegion !== selectedRegion) {
      return false;
    }
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      h.name.toLowerCase().includes(q) ||
      h.zone.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q) ||
      hubRegion.toLowerCase().includes(q) ||
      h.landmark.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-2xl border-2 border-theme-border bg-theme-bg p-5 sm:p-7 shadow-[6px_6px_0px_0px_#f91814] space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-theme-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#f91814]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f91814] font-bold">
                NEPAL DISPATCH // NATIONWIDE COURIER PIN
              </span>
            </div>
            <h2
              className="text-2xl sm:text-3xl uppercase tracking-tight text-theme-text"
              style={{ fontFamily: 'var(--font-clubstone)' }}
            >
              PIN DELIVERY SPOT.
            </h2>
            <p className="font-mono text-xs text-theme-muted">
              Live map pin across Kathmandu, Pokhara, Chitwan, Dharan, Butwal &amp; beyond.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border border-theme-border text-theme-muted hover:text-theme-text hover:border-theme-text transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Map View & Coordinate HUD */}
        <div className="space-y-2">
          <div className="relative w-full h-56 sm:h-64 border-2 border-theme-border overflow-hidden bg-[#18120e]">
            {/* OpenStreetMap Live Embed centered on active coordinates */}
            <iframe
              title="Nepal OpenStreetMap Live Dispatch View"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.02}%2C${coords.lat - 0.015}%2C${coords.lng + 0.02}%2C${coords.lat + 0.015}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`}
              className="w-full h-full border-none opacity-90 filter contrast-105"
              loading="lazy"
            />

            {/* Overlaid Coordinate HUD */}
            <div className="absolute top-3 left-3 bg-black/85 border border-[#27272A] p-2 font-mono text-[10px] text-[#F5F5F0] space-y-0.5 pointer-events-none">
              <div className="text-[#f91814] font-bold">PRECISE GPS PIN</div>
              <div>LAT: {coords.lat.toFixed(4)}</div>
              <div>LNG: {coords.lng.toFixed(4)}</div>
            </div>

            {/* GPS Button */}
            <button
              onClick={handleUseGps}
              disabled={isLocating}
              className="absolute bottom-3 right-3 px-3 py-1.5 bg-[#f91814] text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-[#f91814] hover:bg-black hover:border-black cursor-pointer shadow-md"
            >
              <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Acquiring GPS...' : 'My Current Location'}</span>
            </button>
          </div>
        </div>

        {/* Region Filter Chips */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-theme-muted uppercase tracking-wider block text-[10px]">
              Filter by Region
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRegion(r)}
                className={`px-2.5 py-1 text-[10px] font-mono uppercase font-bold border transition-colors cursor-pointer rounded-none ${
                  selectedRegion === r
                    ? 'bg-[#f91814] text-white border-[#f91814]'
                    : 'border-theme-border bg-theme-surface text-theme-muted hover:border-theme-text hover:text-theme-text'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Hub Selector / Search */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-theme-muted uppercase tracking-wider block text-[10px]">
              Select Neighborhood or City Hub
            </span>
          </div>

          <div className="relative border-2 border-theme-border bg-theme-surface focus-within:border-[#f91814] transition-colors">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-theme-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search (e.g. Lakeside, Chaubiskothi, Thamel, Dharan, Butwal...)"
              className="w-full bg-transparent pl-9 pr-3 py-2 font-mono text-xs text-theme-text placeholder:text-theme-muted focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1 pt-1">
            {filteredHubs.map((hub) => (
              <button
                key={hub.id}
                type="button"
                onClick={() => handleSelectHub(hub)}
                className={`p-2 border text-left font-mono text-[11px] transition-colors cursor-pointer ${
                  selectedHub.id === hub.id
                    ? 'border-[#f91814] bg-[#f91814]/15 text-theme-text font-bold'
                    : 'border-theme-border bg-theme-surface text-theme-muted hover:border-theme-text hover:text-theme-text'
                }`}
              >
                <div className="truncate text-theme-text font-bold">{hub.name}</div>
                <div className="truncate text-[9px] text-theme-muted">{hub.city} &bull; {hub.region || 'Nepal'}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Landmark Summary */}
        <div className="p-3 border border-theme-border bg-theme-surface flex items-center justify-between font-mono text-xs">
          <div>
            <span className="text-[#f91814] font-bold text-[10px] uppercase block">
              Pinned Drop-off Spot
            </span>
            <p className="text-theme-text font-bold text-xs">{selectedHub.name} ({selectedHub.city})</p>
            <p className="text-theme-muted text-[10px] truncate max-w-sm">{selectedHub.landmark}</p>
          </div>

          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 bg-[#f91814] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-2 border-[#f91814] hover:bg-black hover:border-black transition-all cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>CONFIRM SPOT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
