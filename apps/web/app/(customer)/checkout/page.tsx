'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { ShieldCheck, MapPin, CreditCard, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = React.useState<'esewa' | 'khalti' | 'cod'>('esewa');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const subtotal = 760;
  const deliveryFee = 50;
  const tax = 0;
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    // In production, this triggers /api/v1/payments/initiate or server action
    setTimeout(() => {
      setIsSubmitting(false);
      window.location.href = '/order-tracking/ORD-KTM-8942';
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b-2 border-[#27272A] pb-6">
        <Chip variant="brand">Step 02 // Finalize</Chip>
        <h1 className="font-editorial text-4xl font-bold tracking-tight text-[#F5F5F0] mt-2">
          Editorial Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery & Payment Options */}
        <div className="lg:col-span-7 space-y-6">
          {/* Delivery Location */}
          <Card>
            <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F97316]" />
                Delivery Address
              </CardTitle>
              <Chip variant="live" pulse>
                In Zone
              </Chip>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-2">
              <div className="font-mono text-sm text-[#F5F5F0] bg-[#0B0B0B] p-3 border border-[#27272A]">
                Lazimpat Heights, Ward 2, Kathmandu
                <span className="block text-xs text-[#A1A1AA] mt-1">
                  Instructions: Call upon arrival at security gate.
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selector */}
          <Card>
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#F97316]" />
                Select Payment Gateway
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3">
              {/* eSewa v2 Option */}
              <div
                onClick={() => setPaymentMethod('esewa')}
                className={`cursor-pointer border-2 p-4 flex items-center justify-between transition-colors ${
                  paymentMethod === 'esewa'
                    ? 'border-[#60BB46] bg-[#60BB46]/10'
                    : 'border-[#27272A] bg-[#0B0B0B] hover:border-zinc-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-[#60BB46] text-white flex items-center justify-center font-bold text-xs rounded-none">
                    eSewa
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#F5F5F0]">
                      eSewa v2 Secure Gateway
                    </div>
                    <div className="text-xs text-[#A1A1AA] font-mono">
                      Instant HMAC-SHA256 encrypted checkout
                    </div>
                  </div>
                </div>
                <div className="font-mono text-xs text-[#60BB46] font-bold">
                  RECOMMENDED
                </div>
              </div>

              {/* Khalti Option */}
              <div
                onClick={() => setPaymentMethod('khalti')}
                className={`cursor-pointer border-2 p-4 flex items-center justify-between transition-colors ${
                  paymentMethod === 'khalti'
                    ? 'border-[#5D2E8E] bg-[#5D2E8E]/10'
                    : 'border-[#27272A] bg-[#0B0B0B] hover:border-zinc-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-[#5D2E8E] text-white flex items-center justify-center font-bold text-xs rounded-none">
                    Khalti
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#F5F5F0]">
                      Khalti ePayment
                    </div>
                    <div className="text-xs text-[#A1A1AA] font-mono">
                      Pay via Khalti Wallet or Mobile Banking
                    </div>
                  </div>
                </div>
              </div>

              {/* Cash On Delivery Option */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`cursor-pointer border-2 p-4 flex items-center justify-between transition-colors ${
                  paymentMethod === 'cod'
                    ? 'border-[#F97316] bg-[#F97316]/10'
                    : 'border-[#27272A] bg-[#0B0B0B] hover:border-zinc-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-[#27272A] text-white flex items-center justify-center font-bold text-xs rounded-none">
                    COD
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#F5F5F0]">
                      Cash / POS on Delivery
                    </div>
                    <div className="text-xs text-[#A1A1AA] font-mono">
                      Pay when the rider arrives at your door
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-2 border-[#27272A] bg-[#141414]">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="space-y-3 font-mono text-xs border-b border-[#27272A] pb-4">
                <div className="flex justify-between text-[#F5F5F0]">
                  <span>1x Smoked Timur Pork Sekuwa</span>
                  <span>Rs. 520</span>
                </div>
                <div className="flex justify-between text-[#F5F5F0]">
                  <span>1x Jhol Momo (Buff)</span>
                  <span>Rs. 240</span>
                </div>
              </div>

              <div className="space-y-2 font-mono text-xs text-[#A1A1AA]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valley Radial Delivery Fee</span>
                  <span>Rs. {deliveryFee}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-[#F5F5F0] pt-2 border-t border-[#27272A]">
                  <span>Total Amount</span>
                  <span className="text-[#F97316]">Rs. {total}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full mt-4 flex items-center justify-center"
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Connecting Gateway...
                  </>
                ) : (
                  <>
                    Pay Rs. {total} with {paymentMethod.toUpperCase()}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#71717A] pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                256-Bit Encrypted Kathmandu Payment Gateway
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
