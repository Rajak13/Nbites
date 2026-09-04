'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Phone,
  ShieldCheck,
  Moon,
  Sun,
  MapPin,
  Clock,
  LogOut,
  ChevronRight,
  Plus,
  ArrowUpRight,
  Check,
  Save,
  Package,
} from 'lucide-react';
import { useAuthStore, SavedAddress } from '@/lib/auth';
import { useTheme } from '@/components/common/ThemeProvider';
import { getApiBaseUrl } from '@/lib/api-config';

interface OrderHistoryItem {
  id: string;
  orderNumber: string;
  restaurantName: string;
  status: string;
  totalPayable: number;
  paymentMethod: string;
  deliveryLandmark: string;
  deliveryPin: string;
  createdAt: string;
  itemsCount: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);

  const { theme, setTheme } = useTheme();

  const [nameInput, setNameInput] = React.useState('');
  const [isSavingName, setIsSavingName] = React.useState(false);
  const [nameSavedSuccess, setNameSavedSuccess] = React.useState(false);

  const [orders, setOrders] = React.useState<OrderHistoryItem[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = React.useState(false);

  const [isAddingAddress, setIsAddingAddress] = React.useState(false);
  const [newLabel, setNewLabel] = React.useState('Home');
  const [newLandmark, setNewLandmark] = React.useState('');
  const [newAddress, setNewAddress] = React.useState('');
  const [isSavingAddress, setIsSavingAddress] = React.useState(false);

  React.useEffect(() => {
    if (user?.name) {
      setNameInput(user.name);
    }
  }, [user?.name]);

  // Fetch live order history
  React.useEffect(() => {
    if (!token) return;

    async function fetchOrders() {
      setIsLoadingOrders(true);
      try {
        const apiUrl = getApiBaseUrl();
        const res = await fetch(`${apiUrl}/auth/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data?.orders)) {
            setOrders(json.data.orders);
          }
        }
      } catch (err) {
        console.warn('[Profile] Failed to fetch orders:', err);
      } finally {
        setIsLoadingOrders(false);
      }
    }

    fetchOrders();
  }, [token]);

  const handleSaveName = async () => {
    if (!nameInput.trim() || !token) return;
    setIsSavingName(true);

    try {
      const apiUrl = getApiBaseUrl();
      const res = await fetch(`${apiUrl}/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: nameInput.trim() }),
      });

      if (res.ok) {
        updateUser({ name: nameInput.trim() });
        setNameSavedSuccess(true);
        setTimeout(() => setNameSavedSuccess(false), 2000);
      }
    } catch {
      // offline fallback
      updateUser({ name: nameInput.trim() });
    } finally {
      setIsSavingName(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLandmark.trim() || !token) return;
    setIsSavingAddress(true);

    const updatedAddresses: SavedAddress[] = [
      ...(user?.savedAddresses || []),
      {
        label: newLabel,
        landmark: newLandmark.trim(),
        address: newAddress.trim() || undefined,
      },
    ];

    try {
      const apiUrl = getApiBaseUrl();
      const res = await fetch(`${apiUrl}/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ savedAddresses: updatedAddresses }),
      });

      if (res.ok) {
        updateUser({ savedAddresses: updatedAddresses });
        setIsAddingAddress(false);
        setNewLandmark('');
        setNewAddress('');
      }
    } catch {
      updateUser({ savedAddresses: updatedAddresses });
      setIsAddingAddress(false);
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleRemoveAddress = async (index: number) => {
    if (!token || !user?.savedAddresses) return;
    const updated = user.savedAddresses.filter((_, idx) => idx !== index);

    try {
      const apiUrl = getApiBaseUrl();
      await fetch(`${apiUrl}/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ savedAddresses: updated }),
      });
      updateUser({ savedAddresses: updated });
    } catch {
      updateUser({ savedAddresses: updated });
    }
  };

  const handleSignOut = () => {
    logout();
    router.push('/discovery');
  };

  // ── GUEST STATE ─────────────────────────────────────────────────────────────
  if (!token || !user) {
    return (
      <div className="min-h-screen bg-theme-bg text-theme-text pt-28 sm:pt-32 pb-24 px-4 sm:px-6 md:px-12 select-none flex items-center justify-center">
        <div className="max-w-md w-full border-2 border-theme-border bg-theme-surface p-6 sm:p-8 text-center space-y-6 shadow-[4px_4px_0px_0px_#f91814]">
          <div className="w-14 h-14 bg-[#f91814] text-white flex items-center justify-center mx-auto rounded-none">
            <UserIcon className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1
              className="text-3xl font-black uppercase tracking-tight"
              style={{ fontFamily: 'var(--font-clubstone)' }}
            >
              Account Portal
            </h1>
            <p className="font-mono text-xs text-theme-muted">
              Sign in with your Nepal mobile number to access your order history, delivery spots, and interface preferences.
            </p>
          </div>

          <button
            onClick={() => openAuthModal()}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#f91814] text-white border-2 border-[#f91814] py-3.5 px-6 font-mono text-xs font-bold uppercase tracking-wider rounded-none hover:bg-black hover:text-white hover:border-black transition-all cursor-pointer"
          >
            <span>SIGN IN VIA MOBILE OTP</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── AUTHENTICATED PROFILE ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-theme-bg text-theme-text pt-24 sm:pt-28 md:pt-32 pb-24 select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 space-y-10">

        {/* Masthead Header */}
        <div className="border-b-2 border-theme-border pb-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#f91814]" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#f91814] font-bold">
              KATHMANDU VALLEY // CUSTOMER TELEMETRY
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1
                className="text-4xl sm:text-6xl font-black tracking-tight uppercase leading-none"
                style={{ fontFamily: 'var(--font-clubstone)' }}
              >
                ACCOUNT HUB.
              </h1>
              <p className="font-mono text-xs text-theme-muted pt-2">
                Identity verified &bull; Passwordless phone authentication &bull; Real-time preferences
              </p>
            </div>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border-2 border-theme-border bg-theme-surface font-mono text-xs font-bold uppercase tracking-wider text-theme-text hover:border-[#f91814] hover:text-[#f91814] transition-colors cursor-pointer self-start sm:self-end"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>SIGN OUT</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: Identity & Theme */}
          <div className="lg:col-span-7 space-y-8">

            {/* 1. Identity & Credentials Card */}
            <div className="border-2 border-theme-border bg-theme-surface p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-theme-border pb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-[#f91814]" />
                  Identity &amp; Mobile Verified
                </span>
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  AUTHENTICATED
                </span>
              </div>

              {/* Phone (Immutable verified ID) */}
              <div className="space-y-1 font-mono text-xs">
                <span className="text-theme-muted uppercase tracking-wider block text-[10px]">
                  Nepal Mobile Number (ID)
                </span>
                <div className="flex items-center justify-between p-3 border-2 border-theme-border bg-theme-bg">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Phone className="w-4 h-4 text-theme-muted" />
                    <span>+977 {user.phone}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] uppercase font-bold">
                    VERIFIED
                  </span>
                </div>
              </div>

              {/* Name (Editable) */}
              <div className="space-y-1.5 font-mono text-xs">
                <span className="text-theme-muted uppercase tracking-wider block text-[10px]">
                  Full Name / Display
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your name"
                    className="flex-1 border-2 border-theme-border bg-theme-bg px-3 py-2.5 text-theme-text focus:outline-none text-xs font-mono focus:border-[#f91814] transition-colors"
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={isSavingName || !nameInput.trim()}
                    className="px-4 py-2.5 bg-[#f91814] text-white font-mono text-xs font-bold uppercase tracking-wider border-2 border-[#f91814] hover:bg-black hover:border-black transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
                  >
                    {nameSavedSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>SAVED</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>UPDATE</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Theme Preference Switcher Card */}
            <div className="border-2 border-theme-border bg-theme-surface p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-theme-border pb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <Sun className="w-4 h-4 text-[#f91814]" />
                  Visual Interface Canvas Preference
                </span>
                <span className="font-mono text-[10px] text-theme-muted uppercase">
                  PERSISTENT ACROSS SESSIONS
                </span>
              </div>

              <p className="font-mono text-xs text-theme-muted leading-relaxed">
                Choose your default background canvas. Preference is synchronized with your profile and applied instantly across discovery, menu, checkout, and tracking.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                {/* WARM CANVAS OPTION */}
                <div
                  onClick={() => setTheme('cream')}
                  className={`border-2 p-4 cursor-pointer transition-all duration-200 ${
                    theme === 'cream'
                      ? 'border-[#f91814] bg-[#F5F5F0] text-[#0B0B0B] shadow-[4px_4px_0px_0px_#f91814]'
                      : 'border-theme-border bg-[#F5F5F0]/60 text-[#0B0B0B] hover:border-zinc-400 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-5 h-5 bg-[#f91814] text-white flex items-center justify-center">
                      <Sun className="w-3 h-3" />
                    </span>
                    {theme === 'cream' && (
                      <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 bg-[#f91814] text-white uppercase">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <h3
                    className="text-lg font-black uppercase tracking-tight"
                    style={{ fontFamily: 'var(--font-clubstone)' }}
                  >
                    WARM CANVAS
                  </h3>
                  <p className="font-mono text-[10px] text-zinc-600 mt-1 leading-snug">
                    Natural cream stone background with heavy editorial typography.
                  </p>
                </div>

                {/* EDITORIAL DARK OPTION */}
                <div
                  onClick={() => setTheme('dark')}
                  className={`border-2 p-4 cursor-pointer transition-all duration-200 ${
                    theme === 'dark'
                      ? 'border-[#f91814] bg-[#0B0B0B] text-[#F5F5F0] shadow-[4px_4px_0px_0px_#f91814]'
                      : 'border-theme-border bg-[#0B0B0B]/70 text-[#F5F5F0] hover:border-zinc-500 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-5 h-5 bg-amber-400 text-black flex items-center justify-center">
                      <Moon className="w-3 h-3" />
                    </span>
                    {theme === 'dark' && (
                      <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 bg-[#f91814] text-white uppercase">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <h3
                    className="text-lg font-black uppercase tracking-tight"
                    style={{ fontFamily: 'var(--font-clubstone)' }}
                  >
                    EDITORIAL DARK
                  </h3>
                  <p className="font-mono text-[10px] text-zinc-400 mt-1 leading-snug">
                    Deep brutalist obsidian canvas with stark high-contrast borders.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Saved Addresses Card */}
            <div className="border-2 border-theme-border bg-theme-surface p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-theme-border pb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#f91814]" />
                  Saved Drop-off Spots
                </span>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="font-mono text-[10px] text-[#f91814] uppercase font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  ADD ADDRESS
                </button>
              </div>

              {/* Add Address Form */}
              {isAddingAddress && (
                <form
                  onSubmit={handleAddAddress}
                  className="border-2 border-[#f91814] p-4 bg-theme-bg space-y-3 font-mono text-xs"
                >
                  <div className="flex gap-2">
                    {['Home', 'Office', 'Studio'].map((lbl) => (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => setNewLabel(lbl)}
                        className={`px-2.5 py-1 text-[10px] uppercase font-bold border ${
                          newLabel === lbl
                            ? 'bg-[#f91814] text-white border-[#f91814]'
                            : 'border-theme-border bg-theme-surface text-theme-muted'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Landmark / Building name (e.g. Lazimpat, Blue Gate)"
                    value={newLandmark}
                    onChange={(e) => setNewLandmark(e.target.value)}
                    className="w-full p-2.5 border border-theme-border bg-theme-surface text-theme-text text-xs focus:outline-none focus:border-[#f91814]"
                  />

                  <input
                    type="text"
                    placeholder="Specific room, floor or street address (optional)"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full p-2.5 border border-theme-border bg-theme-surface text-theme-text text-xs focus:outline-none focus:border-[#f91814]"
                  />

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-3 py-1.5 border border-theme-border text-theme-muted text-[10px] uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingAddress || !newLandmark.trim()}
                      className="px-4 py-1.5 bg-[#f91814] text-white text-[10px] font-bold uppercase"
                    >
                      {isSavingAddress ? 'Saving...' : 'Save Spot'}
                    </button>
                  </div>
                </form>
              )}

              {/* Address List */}
              {user.savedAddresses && user.savedAddresses.length > 0 ? (
                <div className="space-y-2.5">
                  {user.savedAddresses.map((addr, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 border border-theme-border bg-theme-bg flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono text-[10px] uppercase font-bold text-[#f91814] block">
                          {addr.label}
                        </span>
                        <p className="text-xs font-bold text-theme-text">{addr.landmark}</p>
                        {addr.address && (
                          <p className="font-mono text-[11px] text-theme-muted">{addr.address}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveAddress(idx)}
                        className="text-[10px] font-mono text-red-500 hover:underline uppercase"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-xs text-theme-muted py-2">
                  No saved delivery spots yet. Add one for rapid 1-tap checkout.
                </p>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Order History Ledger */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border-2 border-theme-border bg-theme-surface p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-theme-border pb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#f91814]" />
                  Telemetry Order History
                </span>
                <span className="font-mono text-[10px] text-theme-muted">
                  {orders.length} TICKETS
                </span>
              </div>

              {isLoadingOrders ? (
                <div className="py-12 text-center font-mono text-xs text-theme-muted">
                  Loading order telemetry history...
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 border-2 border-theme-border bg-theme-bg space-y-3 hover:border-[#f91814] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-theme-text">
                          {ord.orderNumber}
                        </span>
                        <span className="px-2 py-0.5 bg-[#f91814] text-white font-mono text-[9px] font-bold uppercase">
                          {ord.status}
                        </span>
                      </div>

                      <div className="font-mono text-xs space-y-0.5">
                        <p className="text-theme-text font-bold">{ord.restaurantName}</p>
                        <p className="text-theme-muted text-[11px]">
                          {ord.itemsCount} items &bull; Rs. {ord.totalPayable} &bull; {ord.paymentMethod}
                        </p>
                        <p className="text-theme-muted text-[10px]">
                          PIN: <strong className="text-theme-text">{ord.deliveryPin}</strong>
                        </p>
                      </div>

                      <div className="pt-2 border-t border-theme-border flex items-center justify-between">
                        <span className="font-mono text-[10px] text-theme-muted">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                        <Link
                          href={`/order-tracking/${ord.orderNumber}`}
                          className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-[#f91814] hover:underline uppercase"
                        >
                          <span>Track Live</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center space-y-3">
                  <Clock className="w-8 h-8 text-theme-muted mx-auto opacity-50" />
                  <p className="font-mono text-xs text-theme-muted">
                    No order telemetry tickets yet.
                  </p>
                  <Link href="/discovery">
                    <button className="px-4 py-2 bg-[#f91814] text-white font-mono text-xs font-bold uppercase tracking-wider">
                      Explore Kitchens
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
