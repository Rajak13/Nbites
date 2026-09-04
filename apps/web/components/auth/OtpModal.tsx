'use client';

import * as React from 'react';
import Link from 'next/link';
import { X, ShieldCheck, ArrowRight, Loader2, MapPin, Lock, Mail, Phone, User, CheckCircle2 } from 'lucide-react';
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

  const [mode, setMode] = React.useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [name, setName] = React.useState('');
  const [city, setCity] = React.useState(selectedCity || 'Dharan');
  const [acceptTerms, setAcceptTerms] = React.useState(true);

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // Keep city in sync with store
  React.useEffect(() => {
    if (selectedCity) setCity(selectedCity);
  }, [selectedCity]);

  // Reset state on modal open/close
  React.useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessMsg(null);
    } else {
      setError(null);
      setSuccessMsg(null);
      setPassword('');
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const validatePhone = (num: string) => {
    const clean = num.replace(/\D/g, '');
    return /^9[78]\d{8}$/.test(clean);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = getApiBaseUrl();
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.data?.token) {
        if (data.data.user.city) {
          setSelectedCity(data.data.user.city);
        }
        login(data.data.token, data.data.user);
        closeModal();
      } else {
        setError(data.message || 'Invalid email or password. Please check and try again.');
      }
    } catch {
      setError('Network connection error. Check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!validatePhone(cleanPhone)) {
      setError('Please enter a valid 10-digit Nepal mobile number (98XXXXXXXX or 97XXXXXXXX).');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
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
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: cleanPhone,
          city: city.trim() || 'Dharan',
          termsAccepted: true,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.data?.token) {
        setSelectedCity(city.trim() || 'Dharan');
        login(data.data.token, data.data.user);
        closeModal();
      } else {
        setError(data.message || 'Registration failed. An account with this email may already exist.');
      }
    } catch {
      setError('Network connection error. Check your internet connection.');
    } finally {
      setIsLoading(false);
    }
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
        <div className="space-y-1.5 border-b-2 border-[#C8C6C1] dark:border-[#27272A] pb-4 mb-5">
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
            {mode === 'signin' ? 'WELCOME BACK.' : 'CREATE ACCOUNT.'}
          </h2>
          <p className="font-mono text-xs text-[#6B6966] dark:text-[#A1A1AA]">
            {mode === 'signin'
              ? 'Sign in to access your orders, partner kitchen tickets, and delivery telemetry.'
              : 'Join nBites with verified contact coordinates for instant line ordering.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-5 font-mono text-xs font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`py-2 px-3 border-2 transition-all cursor-pointer text-center ${
              mode === 'signin'
                ? 'border-[#0B0B0B] dark:border-white bg-[#0B0B0B] dark:bg-white text-white dark:text-[#0B0B0B] shadow-[2px_2px_0px_0px_#f91814]'
                : 'border-[#C8C6C1] dark:border-[#27272A] bg-transparent text-[#6B6966] dark:text-[#A1A1AA] hover:border-[#0B0B0B]'
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`py-2 px-3 border-2 transition-all cursor-pointer text-center ${
              mode === 'signup'
                ? 'border-[#0B0B0B] dark:border-white bg-[#0B0B0B] dark:bg-white text-white dark:text-[#0B0B0B] shadow-[2px_2px_0px_0px_#f91814]'
                : 'border-[#C8C6C1] dark:border-[#27272A] bg-transparent text-[#6B6966] dark:text-[#A1A1AA] hover:border-[#0B0B0B]'
            }`}
          >
            NEW ACCOUNT
          </button>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-4 p-3 border-2 border-[#f91814] bg-[#f91814]/10 font-mono text-xs text-[#f91814]">
            {error}
          </div>
        )}

        {/* Success Notice */}
        {successMsg && (
          <div className="mb-4 p-3 border-2 border-emerald-500 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* FORM 1: SIGN IN */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-[#6B6966] dark:text-[#A1A1AA] uppercase tracking-wider block">
                Email Address <span className="text-[#f91814]">*</span>
              </label>
              <div className="flex items-center border-2 border-[#C8C6C1] dark:border-[#27272A] bg-[#EDECEA] dark:bg-[#0B0B0B] focus-within:border-[#f91814] transition-colors">
                <span className="px-3 text-[#6B6966] dark:text-[#A1A1AA]">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  autoFocus
                  required
                  className="flex-1 bg-transparent py-2.5 pr-3 text-[#0B0B0B] dark:text-[#F5F5F0] focus:outline-none text-sm font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <label className="text-[#6B6966] dark:text-[#A1A1AA] uppercase tracking-wider block">
                  Password <span className="text-[#f91814]">*</span>
                </label>
              </div>
              <div className="flex items-center border-2 border-[#C8C6C1] dark:border-[#27272A] bg-[#EDECEA] dark:bg-[#0B0B0B] focus-within:border-[#f91814] transition-colors">
                <span className="px-3 text-[#6B6966] dark:text-[#A1A1AA]">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="flex-1 bg-transparent py-2.5 pr-3 text-[#0B0B0B] dark:text-[#F5F5F0] focus:outline-none text-sm font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-[#f91814] text-[#F5F5F0] border-2 border-[#f91814] py-3 px-5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#0B0B0B] hover:border-[#0B0B0B] hover:shadow-[3px_3px_0px_0px_#f91814] transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <span>SIGN IN TO NBITES</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-3 border-t border-[#C8C6C1] dark:border-[#27272A] text-center font-mono text-xs text-[#6B6966] dark:text-[#A1A1AA]">
              Don&apos;t have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-[#f91814] font-bold underline cursor-pointer hover:text-[#0B0B0B] dark:hover:text-white"
              >
                Create one now
              </button>
            </div>
          </form>
        )}

        {/* FORM 2: CREATE ACCOUNT */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5 max-h-[75vh] overflow-y-auto pr-1">
            <div className="space-y-1 font-mono text-xs">
              <label className="text-[#6B6966] dark:text-[#A1A1AA] uppercase tracking-wider block">
                Full Name <span className="text-[#f91814]">*</span>
              </label>
              <div className="flex items-center border-2 border-[#C8C6C1] dark:border-[#27272A] bg-[#EDECEA] dark:bg-[#0B0B0B] focus-within:border-[#f91814] transition-colors">
                <span className="px-3 text-[#6B6966] dark:text-[#A1A1AA]">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aashish Shrestha"
                  autoFocus
                  required
                  className="flex-1 bg-transparent py-2 pr-3 text-[#0B0B0B] dark:text-[#F5F5F0] focus:outline-none text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1 font-mono text-xs">
              <label className="text-[#6B6966] dark:text-[#A1A1AA] uppercase tracking-wider block">
                Email Address <span className="text-[#f91814]">*</span>
              </label>
              <div className="flex items-center border-2 border-[#C8C6C1] dark:border-[#27272A] bg-[#EDECEA] dark:bg-[#0B0B0B] focus-within:border-[#f91814] transition-colors">
                <span className="px-3 text-[#6B6966] dark:text-[#A1A1AA]">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="flex-1 bg-transparent py-2 pr-3 text-[#0B0B0B] dark:text-[#F5F5F0] focus:outline-none text-xs font-mono"
                />
              </div>
            </div>

            {/* Nepal Mobile Number (Mandatory for restaurant & rider contact) */}
            <div className="space-y-1 font-mono text-xs">
              <div className="flex items-center justify-between">
                <label className="text-[#6B6966] dark:text-[#A1A1AA] uppercase tracking-wider block">
                  Nepal Mobile Number <span className="text-[#f91814]">*</span>
                </label>
                <span className="text-[10px] text-[#f91814] uppercase tracking-wider">
                  Contact Line
                </span>
              </div>
              <div className="flex border-2 border-[#C8C6C1] dark:border-[#27272A] bg-[#EDECEA] dark:bg-[#0B0B0B] focus-within:border-[#f91814] transition-colors">
                <span className="px-2.5 py-2 bg-[#E8E6E1] dark:bg-[#18120e] text-[#6B6966] dark:text-[#A1A1AA] border-r border-[#C8C6C1] dark:border-[#27272A] font-bold text-xs">
                  +977
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98XXXXXXXX"
                  maxLength={10}
                  required
                  className="flex-1 bg-transparent px-3 py-2 text-[#0B0B0B] dark:text-[#F5F5F0] focus:outline-none text-xs font-mono tracking-wider"
                />
              </div>
              <p className="text-[10px] text-[#8C8A85] dark:text-[#71717A] leading-tight">
                Used by kitchen chefs and delivery riders to confirm orders and dispatch.
              </p>
            </div>

            {/* City Selector */}
            <div className="space-y-1 font-mono text-xs">
              <label className="text-[#6B6966] dark:text-[#A1A1AA] uppercase tracking-wider block">
                Primary Delivery City <span className="text-[#f91814]">*</span>
              </label>
              <div className="relative border-2 border-[#C8C6C1] dark:border-[#27272A] bg-[#EDECEA] dark:bg-[#0B0B0B] focus-within:border-[#f91814] transition-colors">
                <div className="absolute left-3 top-2.5 pointer-events-none text-[#f91814]">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent pl-8 pr-3 py-2 text-[#0B0B0B] dark:text-[#F5F5F0] focus:outline-none text-xs font-mono cursor-pointer appearance-none"
                >
                  {CITIES.map((c) => (
                    <option key={c.value} value={c.value} className="bg-[#F5F5F0] dark:bg-[#141414] text-[#0B0B0B] dark:text-[#F5F5F0]">
                      {c.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none text-[#6B6966] dark:text-[#A1A1AA] text-xs">
                  ▾
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1 font-mono text-xs">
              <label className="text-[#6B6966] dark:text-[#A1A1AA] uppercase tracking-wider block">
                Create Password <span className="text-[#f91814]">*</span>
              </label>
              <div className="flex items-center border-2 border-[#C8C6C1] dark:border-[#27272A] bg-[#EDECEA] dark:bg-[#0B0B0B] focus-within:border-[#f91814] transition-colors">
                <span className="px-3 text-[#6B6966] dark:text-[#A1A1AA]">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="flex-1 bg-transparent py-2 pr-3 text-[#0B0B0B] dark:text-[#F5F5F0] focus:outline-none text-xs font-mono"
                />
              </div>
            </div>

            {/* Mandatory Terms & Conditions Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                  className="mt-0.5 accent-[#f91814] w-4 h-4 cursor-pointer rounded-none"
                />
                <span className="font-mono text-[11px] text-[#6B6966] dark:text-[#A1A1AA] leading-tight">
                  I accept the{' '}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="text-[#f91814] underline hover:text-[#0B0B0B] dark:hover:text-[#F5F5F0]"
                  >
                    Terms &amp; Conditions
                  </Link>
                  ,{' '}
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="text-[#f91814] underline hover:text-[#0B0B0B] dark:hover:text-[#F5F5F0]"
                  >
                    Privacy Policy
                  </Link>
                  , and DoorDash-style city delivery boundaries.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-[#f91814] text-[#F5F5F0] border-2 border-[#f91814] py-3 px-5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#0B0B0B] hover:border-[#0B0B0B] hover:shadow-[3px_3px_0px_0px_#f91814] transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>CREATING ACCOUNT...</span>
                </>
              ) : (
                <>
                  <span>CREATE NBITES ACCOUNT</span>
                  <ShieldCheck className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center font-mono text-xs text-[#6B6966] dark:text-[#A1A1AA]">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-[#f91814] font-bold underline cursor-pointer hover:text-[#0B0B0B] dark:hover:text-white"
              >
                Sign in here
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
