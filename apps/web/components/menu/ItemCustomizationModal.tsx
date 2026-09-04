'use client';

import * as React from 'react';
import Image from 'next/image';
import { X, Plus, Minus, ShieldAlert } from 'lucide-react';
import { useCartStore, CartItemModifier } from '@/lib/cart-store';

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface CustomizationGroup {
  id: string;
  title: string;
  type: 'single' | 'multi';
  required: boolean;
  options: CustomizationOption[];
}

export interface MenuItemDetail {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  prepTime: string;
  isVeg: boolean;
  restaurantId: string;
  restaurantName: string;
  groups: CustomizationGroup[];
}

interface ItemCustomizationModalProps {
  item: MenuItemDetail | null;
  onClose: () => void;
}

export function ItemCustomizationModal({ item, onClose }: ItemCustomizationModalProps) {
  const addItem = useCartStore((state) => state.addItem);

  const [selectedSingle, setSelectedSingle] = React.useState<Record<string, CustomizationOption>>({});
  const [selectedMulti, setSelectedMulti] = React.useState<Record<string, CustomizationOption[]>>({});
  const [quantity, setQuantity] = React.useState(1);
  const [instructions, setInstructions] = React.useState('');

  // Pre-select first option for required single-select groups
  React.useEffect(() => {
    if (!item) return;
    const initialSingle: Record<string, CustomizationOption> = {};
    const initialMulti: Record<string, CustomizationOption[]> = {};

    item.groups.forEach((group) => {
      if (group.type === 'single' && group.options.length > 0) {
        initialSingle[group.id] = group.options[0];
      } else {
        initialMulti[group.id] = [];
      }
    });

    setSelectedSingle(initialSingle);
    setSelectedMulti(initialMulti);
    setQuantity(1);
    setInstructions('');
  }, [item]);

  if (!item) return null;

  const handleSingleSelect = (groupId: string, option: CustomizationOption) => {
    setSelectedSingle((prev) => ({ ...prev, [groupId]: option }));
  };

  const handleMultiToggle = (groupId: string, option: CustomizationOption) => {
    setSelectedMulti((prev) => {
      const current = prev[groupId] || [];
      const exists = current.some((o) => o.id === option.id);
      const updated = exists
        ? current.filter((o) => o.id !== option.id)
        : [...current, option];
      return { ...prev, [groupId]: updated };
    });
  };

  // Calculate dynamic price
  const singleAddonsTotal = Object.values(selectedSingle).reduce(
    (sum, opt) => sum + opt.price,
    0
  );
  const multiAddonsTotal = Object.values(selectedMulti).reduce(
    (sum, arr) => sum + arr.reduce((sub, opt) => sub + opt.price, 0),
    0
  );
  const unitPrice = item.basePrice + singleAddonsTotal + multiAddonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    const allModifiers: CartItemModifier[] = [
      ...Object.values(selectedSingle),
      ...Object.values(selectedMulti).flat(),
    ];

    addItem({
      menuItemId: item.id,
      name: item.name,
      basePrice: item.basePrice,
      price: unitPrice,
      quantity,
      restaurantId: item.restaurantId,
      restaurantName: item.restaurantName,
      selectedModifiers: allModifiers,
      specialInstructions: instructions.trim() || undefined,
      image: item.image,
    });

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none animate-fadeIn"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] bg-[#0B0B0B] text-[#F5F5F0] border-2 border-[#27272A] shadow-[8px_8px_0px_0px_#f91814] flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-5 border-b-2 border-[#27272A] bg-[#141414]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-[#f91814]'}`} />
              <span className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest">
                {item.restaurantName} &bull; {item.isVeg ? 'VEGETARIAN' : 'NON-VEGETARIAN'}
              </span>
            </div>
            <h3
              className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight"
              style={{ fontFamily: 'var(--font-clubstone), serif' }}
            >
              Customize: {item.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 border border-[#27272A] bg-[#0B0B0B] flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modifier Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Dish Overview */}
          <div className="flex gap-4 items-center pb-4 border-b border-[#27272A]">
            <div className="relative w-20 h-20 shrink-0 border-2 border-[#27272A] overflow-hidden bg-[#18120e]">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div>
              <p className="font-mono text-xs text-[#A1A1AA] leading-relaxed line-clamp-2">
                {item.description}
              </p>
              <div className="font-mono text-sm font-bold text-[#f91814] mt-1">
                Base: Rs. {item.basePrice}
              </div>
            </div>
          </div>

          {/* Groups */}
          {item.groups.map((group) => (
            <div key={group.id} className="space-y-3 pb-5 border-b border-[#27272A]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#F5F5F0]">
                  {group.title}
                </span>
                <span className="font-mono text-[10px] text-[#71717A] uppercase">
                  {group.required ? 'REQUIRED (1)' : 'OPTIONAL'}
                </span>
              </div>

              {group.type === 'single' ? (
                // Radio buttons
                <div className="space-y-2">
                  {group.options.map((opt) => {
                    const isChecked = selectedSingle[group.id]?.id === opt.id;
                    return (
                      <label
                        key={opt.id}
                        onClick={() => handleSingleSelect(group.id, opt)}
                        className={`flex items-center justify-between p-3 border-2 cursor-pointer transition-colors ${
                          isChecked
                            ? 'border-[#f91814] bg-[#f91814]/10 text-white'
                            : 'border-[#27272A] bg-[#141414] text-[#A1A1AA] hover:border-zinc-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isChecked ? 'border-[#f91814]' : 'border-zinc-600'
                            }`}
                          >
                            {isChecked && <div className="w-2 h-2 rounded-full bg-[#f91814]" />}
                          </div>
                          <span className="font-mono text-xs sm:text-sm font-semibold text-white">
                            {opt.name}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#f91814]">
                          {opt.price === 0 ? 'INCLUDED' : `+Rs. ${opt.price}`}
                        </span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                // Checkboxes
                <div className="space-y-2">
                  {group.options.map((opt) => {
                    const isChecked = (selectedMulti[group.id] || []).some((o) => o.id === opt.id);
                    return (
                      <label
                        key={opt.id}
                        onClick={() => handleMultiToggle(group.id, opt)}
                        className={`flex items-center justify-between p-3 border-2 cursor-pointer transition-colors ${
                          isChecked
                            ? 'border-[#f91814] bg-[#f91814]/10 text-white'
                            : 'border-[#27272A] bg-[#141414] text-[#A1A1AA] hover:border-zinc-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 border-2 flex items-center justify-center ${
                              isChecked ? 'border-[#f91814] bg-[#f91814]' : 'border-zinc-600'
                            }`}
                          >
                            {isChecked && <span className="text-[10px] text-white font-bold">&check;</span>}
                          </div>
                          <span className="font-mono text-xs sm:text-sm font-semibold text-white">
                            {opt.name}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#f91814]">
                          +Rs. {opt.price}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Special Instructions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#F5F5F0]">
                Kitchen Notes
              </span>
              <span className="font-mono text-[10px] text-[#71717A]">
                {instructions.length}/120
              </span>
            </div>
            <textarea
              maxLength={120}
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Less timur on the side, hot broth, no onions..."
              className="w-full bg-[#141414] border-2 border-[#27272A] p-3 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#f91814] resize-none"
            />
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#71717A]">
              <ShieldAlert className="w-3 h-3 text-[#f91814]" />
              <span>Cannot be used to request free additional dishes or items.</span>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer with Dynamic Calculator */}
        <div className="p-5 border-t-2 border-[#27272A] bg-[#141414] flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Stepper Quantity */}
          <div className="flex items-center border-2 border-[#27272A] bg-[#0B0B0B]">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center text-white hover:text-[#f91814] disabled:opacity-30 cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-mono font-bold text-sm text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 flex items-center justify-center text-white hover:text-[#f91814] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA Button */}
          <button
            onClick={handleAddToCart}
            className="w-full sm:flex-1 bg-[#f91814] text-white border-2 border-[#f91814] py-3 px-6 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider rounded-none hover:bg-white hover:text-[#0B0B0B] hover:shadow-[4px_4px_0px_0px_#ffffff] transition-all cursor-pointer text-center"
          >
            ADD TO TICKET &bull; Rs. {totalPrice}
          </button>
        </div>

      </div>
    </div>
  );
}
