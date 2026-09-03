'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';

export function CartDrawer() {
  const {
    items,
    isOpen,
    conflict,
    cutleryRequested,
    setIsOpen,
    setCutleryRequested,
    updateQuantity,
    removeItem,
    clearCart,
    confirmConflictReplace,
    cancelConflict,
    getSubtotal,
    getDeliveryFee,
    getTotal,
    getActiveRestaurant,
  } = useCartStore();

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();
  const activeRestaurant = getActiveRestaurant();

  // Close on escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  return (
    <>
      {/* 1. Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* 2. Slide-out Drawer Panel */}
      <aside
        aria-label="Your food order ticket"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[460px] bg-[#0B0B0B] text-[#F5F5F0] border-l-2 border-[#27272A] flex flex-col transform transition-transform duration-300 ease-in-out select-none ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b-2 border-[#27272A] bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#f91814]" />
            <div>
              <span className="font-mono text-[10px] text-[#f91814] uppercase tracking-widest font-bold block">
                LIVE TICKET // CART
              </span>
              <h2
                className="text-lg font-black text-white tracking-tight"
                style={{ fontFamily: 'var(--font-clubstone), serif' }}
              >
                Your Order Summary
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close cart drawer"
            className="w-9 h-9 border border-[#27272A] bg-[#0B0B0B] flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Active Kitchen Banner */}
        {activeRestaurant && items.length > 0 && (
          <div className="px-5 py-2.5 bg-[#18120e] border-b border-[#27272A] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 truncate pr-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[#A1A1AA] truncate">
                Kitchen: <strong className="text-white">{activeRestaurant.name}</strong>
              </span>
            </div>
            <button
              onClick={clearCart}
              className="text-[#71717A] hover:text-[#f91814] text-[11px] underline underline-offset-2 shrink-0 cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Scrollable Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 border-2 border-[#27272A] bg-[#141414] flex items-center justify-center text-[#71717A]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3
                  className="text-xl font-black text-white"
                  style={{ fontFamily: 'var(--font-clubstone), serif' }}
                >
                  Your ticket is empty
                </h3>
                <p className="text-xs font-mono text-[#A1A1AA] max-w-xs">
                  Browse neighborhood kitchens across the valley and add wood-fired dishes, momos, or bowls.
                </p>
              </div>
              <Link
                href="/discovery"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 bg-[#f91814] text-white border-2 border-[#f91814] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider rounded-none hover:bg-white hover:text-[#0B0B0B] transition-colors"
              >
                <span>EXPLORE DISCOVERY</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            /* Non-empty Items */
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 border-2 border-[#27272A] bg-[#141414] space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h4
                      className="text-sm font-bold text-white leading-tight"
                      style={{ fontFamily: 'var(--font-clubstone), serif' }}
                    >
                      {item.name}
                    </h4>
                    <div className="font-mono text-xs text-[#f91814] font-bold">
                      Rs. {item.price} each
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                    className="text-[#71717A] hover:text-[#f91814] transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Modifiers List */}
                {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.selectedModifiers.map((mod) => (
                      <span
                        key={mod.id}
                        className="px-2 py-0.5 bg-[#0B0B0B] border border-[#27272A] text-[10px] font-mono text-[#A1A1AA]"
                      >
                        +{mod.name} {mod.price > 0 && `(Rs. ${mod.price})`}
                      </span>
                    ))}
                  </div>
                )}

                {/* Kitchen Special Note */}
                {item.specialInstructions && (
                  <div className="text-[10px] font-mono text-zinc-400 italic bg-[#0B0B0B] p-2 border border-[#222]">
                    Note: &ldquo;{item.specialInstructions}&rdquo;
                  </div>
                )}

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between pt-2 border-t border-[#27272A]">
                  <div className="flex items-center border border-[#27272A] bg-[#0B0B0B]">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 flex items-center justify-center text-white hover:text-[#f91814] cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center font-mono font-bold text-xs text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 flex items-center justify-center text-white hover:text-[#f91814] cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-mono text-xs font-bold text-white">
                    Rs. {item.price * item.quantity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer — Financial Breakdown & Checkout Button */}
        {items.length > 0 && (
          <div className="p-5 border-t-2 border-[#27272A] bg-[#141414] space-y-4">
            {/* Cutlery Toggle (PRD Section 2.4 - Eco Option) */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!cutleryRequested}
                onChange={(e) => setCutleryRequested(!e.target.checked)}
                className="w-4 h-4 rounded-none accent-[#f91814] cursor-pointer"
              />
              <span className="font-mono text-[11px] text-[#A1A1AA]">
                Do not include disposable cutlery (Eco-friendly)
              </span>
            </label>

            {/* Financial Breakdown */}
            <div className="space-y-2 font-mono text-xs text-[#A1A1AA] border-t border-[#27272A] pt-3">
              <div className="flex justify-between">
                <span>Food Subtotal</span>
                <span className="text-white">Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Valley Radial Delivery Fee</span>
                <span className="text-white">Rs. {deliveryFee}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-[#27272A]">
                <span>Total Payable</span>
                <span className="text-[#f91814]">Rs. {total}</span>
              </div>
            </div>

            {/* Direct Checkout CTA */}
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-[#f91814] text-white border-2 border-[#f91814] py-3.5 px-6 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider rounded-none hover:bg-white hover:text-[#0B0B0B] hover:shadow-[4px_4px_0px_0px_#ffffff] transition-all cursor-pointer text-center"
            >
              <span>PROCEED TO CHECKOUT &bull; Rs. {total}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-[#71717A]">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Direct Kitchen Telemetry &bull; Nepal ePayments</span>
            </div>
          </div>
        )}
      </aside>

      {/* 3. Single-Restaurant Conflict Modal (PRD Section 2.4 Constraint) */}
      {conflict && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs select-none">
          <div className="max-w-md w-full bg-[#0B0B0B] text-[#F5F5F0] border-2 border-[#f91814] shadow-[8px_8px_0px_0px_#f91814] p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2.5 text-[#f91814]">
              <AlertCircle className="w-6 h-6" />
              <h3
                className="text-xl font-black text-white"
                style={{ fontFamily: 'var(--font-clubstone), serif' }}
              >
                Replace Cart Items?
              </h3>
            </div>

            <p className="font-mono text-xs text-[#A1A1AA] leading-relaxed">
              Your ticket currently contains dishes from{' '}
              <strong className="text-white">{conflict.existingRestaurant.name}</strong>.
              Do you want to discard them and start a fresh order from{' '}
              <strong className="text-[#f91814]">{conflict.pendingItem.restaurantName}</strong>?
            </p>

            <div className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-2">
              <button
                onClick={confirmConflictReplace}
                className="flex-1 bg-[#f91814] text-white border-2 border-[#f91814] py-2.5 px-4 font-mono text-xs font-bold uppercase tracking-wider rounded-none hover:bg-[#d81410] transition-colors cursor-pointer text-center"
              >
                CLEAR &amp; ADD NEW ITEM
              </button>
              <button
                onClick={cancelConflict}
                className="bg-transparent text-[#A1A1AA] border-2 border-[#27272A] py-2.5 px-4 font-mono text-xs font-bold uppercase tracking-wider rounded-none hover:text-white hover:border-white transition-colors cursor-pointer text-center"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
