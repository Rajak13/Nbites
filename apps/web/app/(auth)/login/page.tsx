'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { ArrowRight, Phone, Lock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [step, setStep] = React.useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = React.useState('9841000000');

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center bg-[#F97316] text-black font-black text-2xl border-2 border-black mb-2">
            n
          </div>
          <h1 className="font-editorial text-3xl font-bold tracking-tight text-[#F5F5F0]">
            NBITES
          </h1>
          <p className="font-mono text-xs text-[#A1A1AA] uppercase tracking-widest">
            Kathmandu Valley Unified Portal
          </p>
        </div>

        <Card className="border-2 border-[#27272A] bg-[#141414]">
          <CardHeader className="p-6 pb-4">
            <div className="flex justify-between items-center mb-1">
              <Chip variant="brand">Authentication</Chip>
              <Chip variant="neutral">SMS OTP</Chip>
            </div>
            <CardTitle className="text-xl">
              {step === 'phone' ? 'Enter Phone Number' : 'Enter OTP Verification'}
            </CardTitle>
            <CardDescription>
              {step === 'phone'
                ? 'Sign in or register with your Nepal mobile number.'
                : `We sent a 6-digit code to +977 ${phone}`}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-0 space-y-4">
            {step === 'phone' ? (
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-[#A1A1AA] border-r border-[#27272A] pr-2">
                    +977
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full bg-[#0B0B0B] border-2 border-[#27272A] pl-18 pr-4 py-3 text-sm text-[#F5F5F0] font-mono focus:outline-none focus:border-[#F97316]"
                  />
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setStep('otp')}
                >
                  Request OTP
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="&bull; &bull; &bull; &bull; &bull; &bull;"
                  className="w-full bg-[#0B0B0B] border-2 border-[#27272A] px-4 py-3 text-center text-xl tracking-widest text-[#F5F5F0] font-mono focus:outline-none focus:border-[#F97316]"
                />

                <Link href="/" className="block">
                  <Button variant="primary" className="w-full">
                    Verify & Enter
                  </Button>
                </Link>

                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-full text-center font-mono text-xs text-[#A1A1AA] hover:text-[#F97316]"
                >
                  &larr; Change Phone Number
                </button>
              </div>
            )}

            <div className="pt-4 border-t border-[#27272A] flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#71717A]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Direct Kathmandu OTP Gateway
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
