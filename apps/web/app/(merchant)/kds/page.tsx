'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Lock,
  ChefHat,
  Flame,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  ArrowLeft,
  RefreshCw,
  LogOut,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { getApiBaseUrl } from '@/lib/api-config';

interface KDSTicket {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryLandmark: string;
  items: {
    name: string;
    quantity: number;
    selectedModifiers?: Record<string, string>;
    specialInstructions?: string;
  }[];
  totalPayable: number;
  paymentMethod: string;
  status: 'PLACED' | 'ACCEPTED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'DISPATCHED';
  placedAt: string;
}

const INITIAL_MOCK_TICKETS: KDSTicket[] = [
  {
    id: 't-101',
    orderNumber: 'ORD-DHN-4891',
    customerName: 'Sujan Rai',
    customerPhone: '+977 9812345678',
    deliveryLandmark: 'Bhanuchowk Clock Tower, Dharan-2',
    items: [
      { name: 'Kothey Sekuwa Pork Ribs (500g)', quantity: 1, selectedModifiers: { 'Spice Level': 'Spicy Timur' } },
      { name: 'Roasted Chiura & Timur Chutney', quantity: 2 },
    ],
    totalPayable: 780,
    paymentMethod: 'COD',
    status: 'PLACED',
    placedAt: '2 mins ago',
  },
  {
    id: 't-102',
    orderNumber: 'ORD-DHN-4889',
    customerName: 'Pooja Limbu',
    customerPhone: '+977 9842109876',
    deliveryLandmark: 'BPKIHS Doctors Quarter Gate 2, Dharan',
    items: [
      { name: 'Smoked Timur Buff Jhol Momo', quantity: 2, selectedModifiers: { 'Prep Style': 'Deep Steamed' } },
      { name: 'Cold Badam Drink', quantity: 2 },
    ],
    totalPayable: 680,
    paymentMethod: 'ESEWA',
    status: 'PREPARING',
    placedAt: '12 mins ago',
  },
  {
    id: 't-103',
    orderNumber: 'ORD-DHN-4885',
    customerName: 'Aashish Shrestha',
    customerPhone: '+977 9801239871',
    deliveryLandmark: 'Zero Point Chowk, Dharan-8',
    items: [
      { name: 'Crispy Mustang Aloo Fries', quantity: 1 },
      { name: 'Charcoal Sekuwa Chicken Plate', quantity: 1 },
    ],
    totalPayable: 620,
    paymentMethod: 'KHALTI',
    status: 'READY_FOR_PICKUP',
    placedAt: '21 mins ago',
  },
];

export default function KDSPage() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);
  const logout = useAuthStore((state) => state.logout);

  const [tickets, setTickets] = React.useState<KDSTicket[]>(INITIAL_MOCK_TICKETS);
  const [filter, setFilter] = React.useState<'ALL' | 'PLACED' | 'PREPARING' | 'READY_FOR_PICKUP'>('ALL');
  const [currentTime, setCurrentTime] = React.useState<string>('');
  const [isUpdating, setIsUpdating] = React.useState<string | null>(null);

  // Live station clock
  React.useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // GUARD 1: Unauthenticated
  // ─────────────────────────────────────────────────────────────────────────────
  if (!token || !user) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F0] pt-28 pb-20 px-4 sm:px-6 flex items-center justify-center select-none font-mono">
        <div className="max-w-md w-full border-2 border-[#27272A] bg-[#141414] p-6 sm:p-8 shadow-[6px_6px_0px_0px_#f91814] space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#f91814] animate-pulse" />
            <span className="text-[10px] text-[#f91814] uppercase tracking-[0.2em] font-bold">
              TERMINAL FAULT // 401 UNAUTHORIZED
            </span>
          </div>

          <div className="w-14 h-14 bg-[#f91814]/10 border-2 border-[#f91814] text-[#f91814] flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1
              className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white"
              style={{ fontFamily: 'var(--font-clubstone)' }}
            >
              KITCHEN TERMINAL LOCKED.
            </h1>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              This station is strictly reserved for verified partner kitchen operators and head chefs. Changing the URL does not grant terminal privileges.
            </p>
          </div>

          <div className="p-3 border border-[#27272A] bg-[#18181B] text-[11px] space-y-1.5 text-[#A1A1AA]">
            <div className="text-[10px] uppercase font-bold text-white tracking-wider">
              Sample Partner Kitchen Logins:
            </div>
            <div>• Dharan Sekuwa: <code className="text-[#f91814]">dharan.bhanuchowk.sekuwa@nbites.com</code></div>
            <div>• BPKIHS Guild: <code className="text-[#f91814]">dharan.bpkihs.food@nbites.com</code></div>
            <div className="text-[10px] text-[#71717A]">Password for all: <code className="text-white">nbites2026</code></div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => openAuthModal()}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#f91814] text-white font-bold text-xs uppercase tracking-wider border-2 border-[#f91814] hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer shadow-[3px_3px_0px_0px_white]"
            >
              <ChefHat className="w-4 h-4" />
              <span>LOG IN AS KITCHEN STAFF</span>
            </button>

            <Link
              href="/discovery"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-transparent text-[#A1A1AA] hover:text-white font-mono text-xs uppercase tracking-wider text-center"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // GUARD 2: Authenticated as regular Customer (Strict Role Protection)
  // ─────────────────────────────────────────────────────────────────────────────
  if (user.role !== 'MERCHANT' && user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F0] pt-28 pb-20 px-4 sm:px-6 flex items-center justify-center select-none font-mono">
        <div className="max-w-lg w-full border-2 border-[#f91814] bg-[#141414] p-6 sm:p-8 shadow-[6px_6px_0px_0px_#f91814] space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#f91814]" />
            <span className="text-[10px] text-[#f91814] uppercase tracking-[0.2em] font-bold">
              ROLE ERROR // 403 FORBIDDEN
            </span>
          </div>

          <div className="w-14 h-14 bg-[#f91814] text-white flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1
              className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white"
              style={{ fontFamily: 'var(--font-clubstone)' }}
            >
              ACCESS DENIED.
            </h1>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Your account (<strong className="text-white">{user.email || user.phone}</strong>) is authenticated as a{' '}
              <span className="text-[#f91814] font-bold">CUSTOMER</span>. Station queue dispatch and ticket controls are strictly restricted to verified partner kitchens.
            </p>
          </div>

          <div className="p-3 border border-[#27272A] bg-[#18181B] text-[11px] text-[#A1A1AA] space-y-1">
            <p className="text-white font-bold">Need station access?</p>
            <p>Log out of your customer account and log in with your restaurant partner email.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/discovery"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#f91814] text-white font-bold text-xs uppercase tracking-wider border-2 border-[#f91814] hover:bg-white hover:text-black transition-all text-center"
            >
              <span>RETURN TO DISCOVERY</span>
            </Link>

            <button
              onClick={() => {
                logout();
                openAuthModal();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-transparent border-2 border-[#27272A] text-[#A1A1AA] hover:text-white hover:border-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>SWITCH ACCOUNT</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // AUTHORIZED: Partner Kitchen Merchant KDS Terminal
  // ─────────────────────────────────────────────────────────────────────────────
  const filteredTickets = tickets.filter((t) => {
    if (filter === 'ALL') return true;
    return t.status === filter;
  });

  const handleUpdateStatus = async (ticketId: string, newStatus: KDSTicket['status']) => {
    setIsUpdating(ticketId);
    try {
      const apiUrl = getApiBaseUrl();
      await fetch(`${apiUrl}/orders/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // Local optimistic update
    }

    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
    setIsUpdating(null);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F0] select-none font-mono pt-20 pb-16 px-4 sm:px-6 md:px-12">
      {/* ── Terminal Header Bar ─────────────────────────────────────────── */}
      <div className="border-2 border-[#27272A] bg-[#141414] p-4 sm:p-6 mb-6 shadow-[4px_4px_0px_0px_#f91814] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-400 uppercase tracking-[0.2em] font-bold">
              STATION ONLINE // LIVE TELEMETRY
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-[#f91814] text-white font-bold uppercase tracking-wider">
              {user.city || 'DHARAN HUB'}
            </span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3"
            style={{ fontFamily: 'var(--font-clubstone)' }}
          >
            <span>KITCHEN DISPATCH TERMINAL</span>
          </h1>
          <p className="text-xs text-[#A1A1AA]">
            Logged in as <strong className="text-white">{user.name || 'Head Chef'}</strong> ({user.email})
          </p>
        </div>

        <div className="flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 border-[#27272A] pt-3 md:pt-0">
          <div className="text-right">
            <div className="text-[10px] text-[#71717A] uppercase tracking-wider">STATION CLOCK</div>
            <div className="text-lg sm:text-xl font-bold text-white tracking-widest">{currentTime || '--:--:--'}</div>
          </div>

          <button
            onClick={() => logout()}
            className="flex items-center gap-1.5 px-3 py-2 border border-[#27272A] hover:border-[#f91814] hover:text-[#f91814] text-xs transition-colors cursor-pointer text-[#A1A1AA]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LOGOUT</span>
          </button>
        </div>
      </div>

      {/* ── Filter Tabs ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 text-xs font-bold uppercase tracking-wider">
        {(['ALL', 'PLACED', 'PREPARING', 'READY_FOR_PICKUP'] as const).map((tab) => {
          const count = tab === 'ALL' ? tickets.length : tickets.filter((t) => t.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`py-2 px-3 sm:px-4 border-2 transition-all cursor-pointer whitespace-nowrap ${
                filter === tab
                  ? 'border-[#f91814] bg-[#f91814] text-white shadow-[2px_2px_0px_0px_white]'
                  : 'border-[#27272A] bg-[#141414] text-[#A1A1AA] hover:border-white hover:text-white'
              }`}
            >
              <span>{tab.replace('_', ' ')}</span>
              <span className="ml-2 px-1.5 py-0.2 bg-black/40 text-[10px]">{count}</span>
            </button>
          );
        })}
      </div>

      {/* ── Tickets Grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTickets.map((ticket) => {
          const isPlaced = ticket.status === 'PLACED';
          const isPreparing = ticket.status === 'PREPARING';
          const isReady = ticket.status === 'READY_FOR_PICKUP';

          return (
            <div
              key={ticket.id}
              className={`border-2 bg-[#141414] p-5 flex flex-col justify-between transition-all ${
                isPlaced
                  ? 'border-[#f91814] shadow-[4px_4px_0px_0px_#f91814]'
                  : isPreparing
                  ? 'border-amber-500 shadow-[4px_4px_0px_0px_#f59e0b]'
                  : 'border-emerald-500 shadow-[4px_4px_0px_0px_#10b981]'
              }`}
            >
              <div className="space-y-4">
                {/* Card Top */}
                <div className="flex items-start justify-between border-b border-[#27272A] pb-3">
                  <div>
                    <span className="text-[10px] text-[#A1A1AA] block uppercase">TICKET NUMBER</span>
                    <span className="text-base font-bold text-white tracking-wider">{ticket.orderNumber}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        isPlaced
                          ? 'bg-[#f91814] text-white'
                          : isPreparing
                          ? 'bg-amber-500 text-black'
                          : 'bg-emerald-500 text-black'
                      }`}
                    >
                      {ticket.status.replace('_', ' ')}
                    </span>
                    <div className="text-[10px] text-[#71717A] mt-1 flex items-center justify-end gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{ticket.placedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Contact Coordinates */}
                <div className="p-2.5 bg-[#18181B] border border-[#27272A] text-xs space-y-1">
                  <div className="text-white font-bold">{ticket.customerName}</div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Phone className="w-3 h-3 shrink-0" />
                    <span>{ticket.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#A1A1AA] text-[11px] truncate">
                    <MapPin className="w-3 h-3 text-[#f91814] shrink-0" />
                    <span className="truncate">{ticket.deliveryLandmark}</span>
                  </div>
                </div>

                {/* Ordered Food Line Items */}
                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-wider text-[#71717A] font-bold">
                    ORDER ITEMS ({ticket.items.reduce((s, i) => s + i.quantity, 0)})
                  </div>
                  <div className="space-y-1.5">
                    {ticket.items.map((item, idx) => (
                      <div key={idx} className="border-l-2 border-[#f91814] pl-2.5 py-0.5">
                        <div className="flex items-center justify-between text-xs font-bold text-white">
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                        </div>
                        {item.selectedModifiers && Object.keys(item.selectedModifiers).length > 0 && (
                          <div className="text-[10px] text-[#A1A1AA]">
                            {Object.entries(item.selectedModifiers).map(([k, v]) => (
                              <span key={k}>
                                • {k}: {v}{' '}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-[#27272A]">
                {isPlaced && (
                  <button
                    disabled={isUpdating === ticket.id}
                    onClick={() => handleUpdateStatus(ticket.id, 'PREPARING')}
                    className="w-full py-2.5 px-3 bg-[#f91814] hover:bg-white hover:text-black text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Flame className="w-4 h-4" />
                    <span>ACCEPT &amp; FIRE TICKET</span>
                  </button>
                )}

                {isPreparing && (
                  <button
                    disabled={isUpdating === ticket.id}
                    onClick={() => handleUpdateStatus(ticket.id, 'READY_FOR_PICKUP')}
                    className="w-full py-2.5 px-3 bg-amber-500 hover:bg-white text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>MARK READY FOR PICKUP</span>
                  </button>
                )}

                {isReady && (
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-center text-xs text-emerald-400 font-bold uppercase tracking-wider">
                    AWAITING RIDER DISPATCH
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
