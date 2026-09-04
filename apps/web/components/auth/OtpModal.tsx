'use client';

import * as React from 'react';
import Link from 'next/link';
import { X, ShieldCheck, ArrowRight, Loader2, RefreshCw, MapPin } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { getApiBaseUrl } from '@/lib/api-config';

const CITIES = [
  { value: 'Dharan', label: 'Dharan (Eastern Hub)' },
  { value: 'Kathmandu', label: 'Kathmandu (Capital Hub)' },
  { value: 'Lalitpur', label: 'Lalitpur (Patan Heritage)' },
  { value: 'Pokhara', label: 'Pokhara (Lakeside)' },
  { value: 'Chitwan', label: 'Chitwan (Bharatpur / Narayangarh)' },
  { value: 'Biratnagar', label: 'Biratnagar (Morang Hub)' },
  { value: 'Butwal', label: 'Butwal (Lumbini Hub)' },
];

export function OtpModal() {
  const isOpen = useAuthStore((state) => state.isAuthModalOpen);
  const closeModal = useAuthStore((state) => state.closeAuthModal);
  const login = useAuthStore((state) => state.login);
  const selectedCity = useAuthStore((state) => state.selectedCity);
  const setSelectedCity = useAuthStore((state) => state.setSelectedCity);

  const [step, setStep] = React.useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = React.useState('');
  const [name, setName] = React.useState('');
  const [city, setCity] = React.useState(selectedCity || 'Dharan');
  const [acceptTerms, setAcceptTerms] = React.useState(true);
  const [digits, setDigits] = React.useState<string[]>(['', '', '', '', '', '']);
  const [devOtp, setDevOtp] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [cooldown, setCooldown] = React.useState(0);

  const digitRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Keep city in sync with store
  React.useEffect(() => {
    if (selectedCity) setCity(selectedCity);
  }, [selectedCity]);

  // Reset state on modal open/close
  React.useEffect(() => {
    if (isOpen) {
      setError(null);
      if (step === 'otp') {
        setTimeout(() => digitRefs.current[0]?.focus(), 100);
      }
    } else {
      setStep('phone');
      setDigits(['', '', '', '', '', '']);
      setError(null);
      setDevOtp(null);
    }
  }, [isOpen, step]);

  // Cooldown timer
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  if (!isOpen) return null;

  const validatePhone = (num: string) => {
    const clean = num.replace(/\D/g, '');
    return /^9[78]\d{8}$/.test(clean);
  };

  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = phone.replace(/\D/g, '');

    if (!validatePhone(clean)) {
      setError('Please enter a valid 10-digit Nepal mobile number (98XXXXXXXX or 97XXXXXXXX).');
      return;
    }

    if (!acceptTerms) {
      setError('You must accept the Terms & Conditions and Policies to proceed.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = getApiBaseUrl();
      const res = await fetch(`${apiUrl}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: clean }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStep('otp');
        setCooldown(60);
        if (data.data?.devOtp) {
          setDevOtp(data.data.devOtp);
        }
      } else {
        setError(data.message || 'Failed to send verification code. Please try again.');
      }
    } catch {
      setError('Network connection error. Check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDigitChange = (idx: number, val: string) => {
    const char = val.slice(-1).replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[idx] = char;
    setDigits(newDigits);

    if (char && idx < 5) {
      digitRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      digitRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setDigits(newDigits);
    const nextIdx = Math.min(pasted.length, 5);
    digitRefs.current[nextIdx]?.focus();
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = digits.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = getApiBaseUrl();
      const cleanPhone = phone.replace(/\D/g, '');
      const res = await fetch(`${apiUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          otp: code,
          name: name.trim() || undefined,
          city: city.trim() || 'Dharan',
          termsAccepted: true,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.data?.token) {
        setSelectedCity(city.trim() || 'Dharan');
        login(data.data.token, data.data.user);
      } else {
        setError(data.message || 'Invalid or expired verification code.');
      }
    } catch {
      setError('Network connection error during verification.');
    } finally {
      setIsLoading(false);
    }
  };

  const autofillDevOtp = () => {
    if (!devOtp || devOtp.length !== 6) return;
    setDigits(devOtp.split(''));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-md border-2 border-[#0B0B0B] dark:border-[#27272A] bg-[#F5F5F0] dark:bg-[#141414] p-6 sm:p-8 shadow-[6px_6px_0px_0px_#f91814]">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-1.5 border border-[#C8C6C1] dark:border-[#27272A] text-[#6B6966] hover:text-[#0B0B0B] dark:hover:text-[#F5F5F0] hover:border-[#0B0B0B] dark:hover:border-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 border-b-2 border-[#C8C6C1] dark:border-[#27272A] pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#f91814]" />
            <span className="font-mono text-[10px] text-[#f91814] uppercase tracking-[0.2em] font-bold">
              ACCOUNT ACCESS // NBITES
            </span>
          </div>
          <h2
            className="text-2xl sm:text-3xl text-[#0B0B0B] dark:text-[#F5F5F0] tracking-tight uppercase leading-tight"
            style={{ fontFamily: 'var(--font-clubstone), serif' }}
          >
            {step === 'phone' ? 'SIGN IN OR REGISTER.' : 'ENTER 6-DIGIT CODE.'}
          </h2>
          <p className="font-mono text-xs text-[#6B6966] dark:text-[#A1A1AA]">
            {step === 'phone'
              ? 'Enter your mobile number and operational city to unlock your local kitchens.'
              : `Verification code sent to +977 ${phone}. Valid for 5 minutes.`}
          </p>
        </div>

        {/* Error notice */}
        {error && (
          <div className="mb-4 p-3 border-2 border-[#f91814] bg-[#f91814]/10 font-mono text-xs text-[#f91814]">
            {error}
          </div>
        )}

        {/* STEP 1: Phone Input & City Form */}
        {step === 'phone' && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-[#6B6966] dark:text-[#A1A1AA] uppercase tracking-wider block">
                Nepal Mobile Number <span className="text-[#f91814]">*</span>
              </label>
              <div className="flex border-2 border-[#C8C6C1] dark:border-[#27272A] bg-[#EDECEA] dark:bg-[#0B0B0B] focus-within:border-[#f91814] transition-colors">
                <span className="px-3.5 py-2.5 bg-[#E8E6E1] dark:bg-[#18120e] text-[#6B6966] dark:text-[#A1A1AA] border-r border-[#C8C6C1] dark:border-[#27272A] font-bold">
                  +977
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98XXXXXXXX"
                  maxLength={10}
                  autoFocus
                  required
                  className="flex-1 bg-transparent px-3 py-2.5 text-[#0B0B0B] dark:text-[#F5F5F0] focus:outline-none text-sm tracking-wider font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-[#6B6966] dark:text-[#A1A1AA] uppercase tracking-wider block">
                Full Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aayush Shrestha"
                className="w-full border-2 border-[#C8C6C1] dark:border-[#27272A] bg-[#EDECEA] dark:bg-[#0B0B0B] px-3 py-2.5 text-[#0B0B0B] dark:text-[#F5F5F0] focus:outline-none text-xs font-mono focus:border-[#f91814] transition-colors"
              />
            </div>

            {/* City Selector */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-[#6B6966] dark:text-[#A1A1AA] uppercase tracking-wider block flex items-center justify-between">
                <span>Your Active City <span className="text-[#f91814]">*</span></span>
                <span className="text-[10px] text-[#f91814] lowercase font-normal">(filters kitchens near you)</span>
              </label>
              <div className="relative border-2 border-[#C8C6C1] dark:border-[#27272A] bg-[#EDECEA] dark:bg-[#0B0B0B] focus-within:border-[#f91814] transition-colors">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent px-3 py-2.5 text-[#0B0B0B] dark:text-[#F5F5F0] focus:outline-none text-xs font-mono cursor-pointer uppercase font-bold"
                >
                  {CITIES.map((c) => (
                    <option key={c.value} value={c.value} className="bg-[#F5F5F0] dark:bg-[#141414] text-[#0B0B0B] dark:text-[#F5F5F0]">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="pt-2 pb-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded-none accent-[#f91814] cursor-pointer"
                />
                <span className="font-mono text-[11px] text-[#6B6966] dark:text-[#A1A1AA] leading-relaxed select-none">
                  I accept all{' '}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="text-[#0B0B0B] dark:text-[#F5F5F0] underline font-bold hover:text-[#f91814]"
                  >
                    Terms &amp; Conditions
                  </Link>
                  ,{' '}
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="text-[#0B0B0B] dark:text-[#F5F5F0] underline font-bold hover:text-[#f91814]"
                  >
                    Privacy Policy
                  </Link>
                  , and{' '}
                  <Link
                    href="/refunds"
                    target="_blank"
                    className="text-[#0B0B0B] dark:text-[#F5F5F0] underline font-bold hover:text-[#f91814]"
                  >
                    Refund Policies
                  </Link>
                  .
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !phone || !acceptTerms}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-[#f91814] text-[#F5F5F0] border-2 border-[#f91814] py-3.5 px-5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#0B0B0B] hover:border-[#0B0B0B] hover:shadow-[3px_3px_0px_0px_#f91814] transition-all cursor-pointer disabled:opacity-40"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>SENDING CODE...</span>
                </>
              ) : (
                <>
                  <span>SEND VERIFICATION CODE</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: 6-Digit OTP Form */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            {/* Dev helper badge */}
            {devOtp && (
              <div className="p-2.5 border border-[#C8C6C1] dark:border-[#27272A] bg-[#E8E6E1] dark:bg-[#18181B] flex items-center justify-between font-mono text-[11px]">
                <span className="text-[#6B6966] dark:text-[#A1A1AA]">
                  TEST CODE: <strong className="text-[#f91814] tracking-widest">{devOtp}</strong>
                </span>
                <button
                  type="button"
                  onClick={autofillDevOtp}
                  className="px-2 py-0.5 bg-[#f91814] text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                >
                  AUTOFILL
                </button>
              </div>
            )}

            {/* 6 Digit Inputs */}
            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    digitRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-11 sm:w-12 h-14 text-center text-xl font-mono font-black border-2 border-[#C8C6C1] dark:border-[#27272A] bg-[#EDECEA] dark:bg-[#0B0B0B] text-[#0B0B0B] dark:text-[#F5F5F0] focus:border-[#f91814] focus:outline-none transition-colors"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || digits.join('').length !== 6}
              className="w-full flex items-center justify-center gap-2 bg-[#f91814] text-[#F5F5F0] border-2 border-[#f91814] py-3.5 px-5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#0B0B0B] hover:border-[#0B0B0B] hover:shadow-[3px_3px_0px_0px_#f91814] transition-all cursor-pointer disabled:opacity-40"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>VERIFYING CODE...</span>
                </>
              ) : (
                <>
                  <span>VERIFY &amp; SIGN IN</span>
                  <ShieldCheck className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Resend / Change number */}
            <div className="flex items-center justify-between pt-2 border-t border-[#C8C6C1] dark:border-[#27272A] font-mono text-[11px] text-[#6B6966] dark:text-[#A1A1AA]">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="hover:text-[#0B0B0B] dark:hover:text-[#F5F5F0] underline cursor-pointer"
              >
                Change Phone
              </button>

              <button
                type="button"
                disabled={cooldown > 0 || isLoading}
                onClick={() => handleRequestOtp()}
                className="flex items-center gap-1 hover:text-[#0B0B0B] dark:hover:text-[#F5F5F0] disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
