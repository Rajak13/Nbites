'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Phone,
  MapPin,
  ArrowUpRight,
  ChevronLeft,
  Shield,
  Bike,
  Clock,
} from 'lucide-react';
import { getApiBaseUrl } from '@/lib/api-config';

// ─── State Machine ────────────────────────────────────────────────────────────

type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'DISPATCHED'
  | 'ARRIVED'
  | 'DELIVERED'
  | 'CANCELLED';

const PIPELINE: { key: OrderStatus; label: string; sub: string }[] = [
  { key: 'PLACED',           label: 'ORDER PLACED',   sub: 'Payment confirmed. Kitchen notified.' },
  { key: 'ACCEPTED',         label: 'ACCEPTED',        sub: 'Kitchen has taken your ticket.' },
  { key: 'PREPARING',        label: 'KITCHEN FIRING',  sub: 'Your food is being crafted right now.' },
  { key: 'READY_FOR_PICKUP', label: 'READY FOR RIDER', sub: 'Awaiting rider pickup at the kitchen.' },
  { key: 'DISPATCHED',       label: 'EN ROUTE',        sub: 'Rider has left the kitchen.' },
  { key: 'ARRIVED',          label: 'ARRIVED',         sub: 'Rider is at your location.' },
  { key: 'DELIVERED',        label: 'DELIVERED',       sub: 'Order complete. Enjoy your meal.' },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  PLACED: 0, ACCEPTED: 1, PREPARING: 2, READY_FOR_PICKUP: 3,
  DISPATCHED: 4, ARRIVED: 5, DELIVERED: 6, CANCELLED: -1,
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderReceipt {
  id: string;
  restaurant: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  paymentMethod: string;
  deliveryPin: string;
  placedAt: string;
}

// ─── Rider ────────────────────────────────────────────────────────────────────

const RIDER = {
  name: 'Bikash Maharjan',
  zone: 'Patan / Lalitpur Corridor',
  phone: '+9779841009191',
  plateNo: 'BA 11 PA 8294',
  vehicle: 'Honda Activa 6G',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [receipt, setReceipt] = React.useState<OrderReceipt | null>(null);
  const [status, setStatus] = React.useState<OrderStatus>('PLACED');
  const [eta, setEta] = React.useState<number>(28);
  const [tick, setTick] = React.useState(0);
  const [coords, setCoords] = React.useState({ lat: 27.6788, lng: 85.3198 });

  // ── Load order ───────────────────────────────────────────────────────────
  React.useEffect(() => {
    const stored = localStorage.getItem(`order_${orderId}`);
    if (stored) {
      try { setReceipt(JSON.parse(stored)); } catch { /* ignore */ }
    }

    const apiUrl = getApiBaseUrl();
    fetch(`${apiUrl}/orders/${orderId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((json) => {
        if (json?.data?.order) {
          const o = json.data.order;
          setStatus(o.status || 'PLACED');
          setEta(o.estimatedDeliveryMins ?? 28);
          if (!stored) {
            setReceipt({
              id: o.orderNumber,
              restaurant: o.restaurant?.name || o.restaurantId || 'Kitchen',
              items: o.items || [],
              total: o.financialBreakdown?.totalPayable || o.totalPayable || 0,
              customerName: o.customer?.name || o.customerName || '',
              phone: o.customer?.phone || o.customerPhone || '',
              deliveryAddress: o.deliveryAddress?.landmark || o.deliveryLandmark || '',
              paymentMethod: o.payment?.method || o.paymentMethod || '',
              deliveryPin: o.deliveryPin || '----',
              placedAt: o.createdAt || new Date().toISOString(),
            });
          }
        }
      })
      .catch(() => { /* api offline — use localStorage */ });
  }, [orderId]);

  // ── Demo progression ─────────────────────────────────────────────────────
  React.useEffect(() => {
    if (status === 'DELIVERED' || status === 'CANCELLED') return;
    const STEPS: OrderStatus[] = ['PLACED','ACCEPTED','PREPARING','READY_FOR_PICKUP','DISPATCHED','ARRIVED','DELIVERED'];
    const timer = setInterval(() => {
      setStatus((prev) => {
        const idx = STEPS.indexOf(prev);
        if (idx < STEPS.length - 1) return STEPS[idx + 1];
        clearInterval(timer);
        return prev;
      });
      setEta((prev) => Math.max(0, prev - 4));
    }, 8000);
    return () => clearInterval(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── GPS drift ────────────────────────────────────────────────────────────
  React.useEffect(() => {
    const gps = setInterval(() => {
      setCoords((c) => ({
        lat: parseFloat((c.lat + (Math.random() - 0.5) * 0.0008).toFixed(6)),
        lng: parseFloat((c.lng + (Math.random() - 0.5) * 0.0008).toFixed(6)),
      }));
      setTick((t) => t + 1);
    }, 2000);
    return () => clearInterval(gps);
  }, []);

  const currentStep = STATUS_INDEX[status] ?? 0;
  const placedTime = receipt?.placedAt
    ? new Date(receipt.placedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  // ── Cancelled ────────────────────────────────────────────────────────────
  if (status === 'CANCELLED') {
    return (
      <main className="min-h-screen bg-theme-bg flex items-center justify-center px-6 transition-colors duration-200">
        <div className="text-center max-w-md">
          <div className="text-[100px] sm:text-[120px] leading-none font-mono text-[#f91814] select-none">✕</div>
          <h1
            className="text-3xl sm:text-4xl uppercase tracking-tight text-theme-text mt-6"
            style={{ fontFamily: 'var(--font-clubstone)' }}
          >
            Order Cancelled
          </h1>
          <p className="text-theme-muted mt-4 text-sm font-mono">
            Your order {orderId} was cancelled. No charge was made.
          </p>
          <Link
            href="/discovery"
            className="inline-flex items-center gap-2 mt-8 border-2 border-theme-border px-6 py-3 text-theme-text text-xs font-mono uppercase tracking-widest hover:bg-[#f91814] hover:text-white hover:border-[#f91814] transition-colors"
          >
            Back to Kitchen Index <ArrowUpRight size={14} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-200">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="border-b-2 border-theme-border bg-theme-bg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3">
          <Link
            href="/discovery"
            className="flex items-center gap-1.5 text-theme-muted hover:text-theme-text transition-colors font-mono text-[10px] sm:text-xs uppercase tracking-widest shrink-0"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">Kitchen Index</span>
          </Link>

          <div className="text-center min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-widest text-theme-muted">
              Order Telemetry
            </p>
            <p
              className="text-xs sm:text-sm uppercase tracking-tight text-theme-text truncate"
              style={{ fontFamily: 'var(--font-clubstone)' }}
            >
              {orderId}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-theme-muted shrink-0">
            <span
              className="inline-block w-2 h-2 bg-[#f91814]"
              style={{ animation: 'pulse-gps 1.5s ease-in-out infinite' }}
            />
            LIVE
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 sm:gap-12">

        {/* ── LEFT: ETA + Pipeline + Rider + GPS ───────────────────────────── */}
        <div className="space-y-8 sm:space-y-12">

          {/* ETA */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-theme-muted mb-3">
              Estimated Arrival
            </p>
            <div className="flex items-end gap-3 sm:gap-4">
              <span
                className="text-[72px] sm:text-[96px] leading-none text-theme-text"
                style={{ fontFamily: 'var(--font-clubstone)' }}
              >
                {status === 'DELIVERED' ? '00' : String(eta).padStart(2, '0')}
              </span>
              <div className="pb-3 sm:pb-4">
                <p
                  className="text-xl sm:text-2xl uppercase text-theme-muted"
                  style={{ fontFamily: 'var(--font-clubstone)' }}
                >
                  {status === 'DELIVERED' ? 'DELIVERED' : 'MIN'}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-theme-muted mt-1">
                  {receipt?.restaurant || 'Kitchen'} &bull; placed {placedTime}
                </p>
              </div>
            </div>
          </div>

          {/* Pipeline */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-theme-muted mb-5 sm:mb-6">
              Order Pipeline
            </p>
            <div className="space-y-0">
              {PIPELINE.map((step, idx) => {
                const isCompleted = idx < currentStep;
                const isActive = idx === currentStep;

                return (
                  <div key={step.key} className="flex gap-4 sm:gap-6">
                    {/* Indicator */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 border-2 flex items-center justify-center shrink-0 transition-all duration-500 ${
                          isCompleted
                            ? 'border-[#f91814] bg-[#f91814]'
                            : isActive
                            ? 'border-[#f91814] bg-transparent'
                            : 'border-theme-border bg-transparent'
                        }`}
                      >
                        {isCompleted ? (
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="#F5F5F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : isActive ? (
                          <div className="w-2 h-2 bg-[#f91814]" />
                        ) : null}
                      </div>
                      {idx < PIPELINE.length - 1 && (
                        <div
                          className={`w-px flex-1 min-h-[28px] sm:min-h-[32px] transition-all duration-700 ${
                            isCompleted ? 'bg-[#f91814]' : 'bg-theme-border'
                          }`}
                        />
                      )}
                    </div>

                    {/* Label */}
                    <div className={`pb-6 sm:pb-8 ${idx === PIPELINE.length - 1 ? 'pb-0' : ''}`}>
                      <p
                        className={`text-xs sm:text-sm uppercase tracking-widest transition-colors duration-300 ${
                          isCompleted ? 'text-theme-muted' : isActive ? 'text-theme-text' : 'text-theme-muted/40'
                        }`}
                        style={{ fontFamily: 'var(--font-clubstone)' }}
                      >
                        {step.label}
                      </p>
                      <p
                        className={`font-mono text-[10px] sm:text-[11px] mt-0.5 transition-colors ${
                          isActive ? 'text-theme-muted' : 'text-theme-muted/40'
                        }`}
                      >
                        {isActive || isCompleted ? step.sub : '—'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rider Card — visible from DISPATCHED onward */}
          {currentStep >= 4 && (
            <div className="border-2 border-theme-border bg-theme-surface p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-theme-muted mb-4 sm:mb-5">
                Your Rider
              </p>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="text-xl sm:text-2xl uppercase text-theme-text"
                    style={{ fontFamily: 'var(--font-clubstone)' }}
                  >
                    {RIDER.name}
                  </p>
                  <p className="font-mono text-xs text-theme-muted mt-1">{RIDER.zone}</p>

                  <div className="mt-3 sm:mt-4 space-y-1.5">
                    <div className="flex items-center gap-2 font-mono text-xs text-theme-muted">
                      <Bike size={12} className="text-[#f91814]" />
                      {RIDER.vehicle}
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs text-theme-muted">
                      <MapPin size={12} className="text-[#f91814]" />
                      {RIDER.plateNo}
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${RIDER.phone}`}
                  className="flex items-center gap-2 border-2 border-theme-text px-3 sm:px-4 py-2.5 text-theme-text font-mono text-xs uppercase tracking-widest hover:bg-[#f91814] hover:text-white hover:border-[#f91814] transition-colors shrink-0"
                >
                  <Phone size={12} /> Call
                </a>
              </div>
            </div>
          )}

          {/* GPS HUD */}
          <div className="border-2 border-theme-border bg-theme-surface p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-theme-muted">
                GPS Coordinate Stream
              </p>
              <span className="font-mono text-[10px] text-theme-muted/50">
                TICK {String(tick).padStart(4, '0')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-theme-muted/60 mb-1">LAT</p>
                <p
                  className="text-xl sm:text-2xl text-[#f91814] tabular-nums"
                  style={{ fontFamily: 'var(--font-clubstone)' }}
                >
                  {coords.lat.toFixed(4)}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-theme-muted/60 mb-1">LNG</p>
                <p
                  className="text-xl sm:text-2xl text-[#f91814] tabular-nums"
                  style={{ fontFamily: 'var(--font-clubstone)' }}
                >
                  {coords.lng.toFixed(4)}
                </p>
              </div>
            </div>

            <div className="mt-4 h-px bg-theme-border" />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[10px] text-theme-muted uppercase tracking-widest">
                <MapPin size={10} className="text-[#f91814]" />
                Kathmandu Valley
              </div>
              <div className="font-mono text-[10px] text-theme-muted uppercase tracking-widest">
                Turf.js Spatial
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: PIN + Receipt + Details ───────────────────────────────── */}
        <div className="space-y-5 sm:space-y-6">

          {/* Delivery PIN — most prominent */}
          <div className="border-2 border-[#f91814] bg-theme-surface p-5 sm:p-6 shadow-[3px_3px_0px_0px_#f91814]">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Shield size={14} className="text-[#f91814]" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-theme-muted">
                Delivery Verification PIN
              </p>
            </div>
            <p
              className="text-6xl sm:text-7xl uppercase tracking-[0.15em] text-theme-text text-center py-3 sm:py-4"
              style={{ fontFamily: 'var(--font-clubstone)' }}
            >
              {receipt?.deliveryPin || '————'}
            </p>
            <p className="font-mono text-[10px] text-theme-muted text-center mt-2">
              Share this PIN with your rider only upon delivery
            </p>
          </div>

          {/* Order Receipt */}
          <div className="border-2 border-theme-border bg-theme-surface p-5 sm:p-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-theme-muted mb-4 sm:mb-5">
              Order Receipt
            </p>

            {receipt?.items && receipt.items.length > 0 ? (
              <div className="space-y-3">
                {receipt.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-baseline gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-theme-text truncate" style={{ fontFamily: 'var(--font-nokie)' }}>
                        {item.name}
                      </p>
                      <p className="font-mono text-[10px] text-theme-muted">QTY {item.quantity}</p>
                    </div>
                    <p className="font-mono text-sm text-theme-text shrink-0">
                      NPR {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-mono text-xs text-theme-muted">Loading items...</p>
            )}

            <div className="mt-5 pt-4 border-t border-theme-border space-y-2">
              <div className="flex justify-between font-mono text-xs text-theme-muted">
                <span>Subtotal</span>
                <span>NPR {receipt ? (receipt.total - 50).toLocaleString() : '—'}</span>
              </div>
              <div className="flex justify-between font-mono text-xs text-theme-muted">
                <span>Delivery</span>
                <span>NPR 50</span>
              </div>
              <div className="flex justify-between font-mono text-sm text-theme-text pt-2 border-t border-theme-border">
                <span className="uppercase tracking-widest" style={{ fontFamily: 'var(--font-clubstone)' }}>Total</span>
                <span>NPR {receipt?.total?.toLocaleString() || '—'}</span>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="border-2 border-theme-border bg-theme-surface p-5 sm:p-6 space-y-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-theme-muted">
              Delivery Details
            </p>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-theme-muted/60 mb-1">Recipient</p>
              <p className="text-sm text-theme-text" style={{ fontFamily: 'var(--font-nokie)' }}>
                {receipt?.customerName || '—'}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-theme-muted/60 mb-1">Phone</p>
              <p className="font-mono text-sm text-theme-text">{receipt?.phone || '—'}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-theme-muted/60 mb-1">Address</p>
              <p className="text-sm text-theme-muted" style={{ fontFamily: 'var(--font-nokie)' }}>
                {receipt?.deliveryAddress || '—'}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-theme-muted/60 mb-1">Payment</p>
              <span className="font-mono text-xs text-theme-text border border-theme-border px-2 py-0.5 uppercase tracking-widest">
                {receipt?.paymentMethod || '—'}
              </span>
            </div>
          </div>

          {/* Help */}
          <div className="border-2 border-theme-border p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={12} className="text-theme-muted" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-theme-muted">
                Need Help?
              </p>
            </div>
            <p className="font-mono text-xs text-theme-muted mb-4">
              If there&apos;s an issue with your order, our team is available 07:00–23:00 NPT.
            </p>
            <Link
              href="/"
              className="flex items-center justify-between border border-theme-border px-4 py-3 text-theme-muted hover:border-[#f91814] hover:text-theme-text transition-colors group"
            >
              <span className="font-mono text-xs uppercase tracking-widest">nBites Support</span>
              <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-gps {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>
    </main>
  );
}
