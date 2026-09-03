import * as React from 'react';
import { LegalLayout } from '@/components/legal/LegalLayout';

export const metadata = {
  title: 'Cookie & Telemetry Policy | nBites',
  description: 'Detailed explanation of session cookies, telemetry caching, and local storage on nBites.',
};

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookie &amp; Telemetry Policy"
      subtitle="How nBites utilizes client-side local storage and essential session cookies to run real-time food delivery."
    >
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white border-l-2 border-[#f91814] pl-3">
          1. What Are Cookies on nBites?
        </h2>
        <p>
          Cookies and client-side browser storage (such as <code className="text-[#f91814] bg-[#18120e] px-1.5 py-0.5 border border-[#27272A]">localStorage</code>) are tiny text records retained on your device. Unlike ad-heavy platforms, nBites uses browser storage almost exclusively for operational logistics and state preservation.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white border-l-2 border-[#f91814] pl-3">
          2. Specific Storage Keys Used
        </h2>
        <div className="space-y-3">
          <div className="p-4 bg-[#141414] border border-[#27272A] space-y-1">
            <div className="text-white font-bold font-mono">nbites_customer_cart</div>
            <p className="text-xs text-[#A1A1AA]">
              Preserves your active order ticket, chosen dishes, and custom modifiers across page refreshes so your cart does not vanish.
            </p>
          </div>
          <div className="p-4 bg-[#141414] border border-[#27272A] space-y-1">
            <div className="text-white font-bold font-mono">nbites_cookie_consent</div>
            <p className="text-xs text-[#A1A1AA]">
              Remembers whether you accepted or customized telemetry preferences so the banner does not repeatedly obstruct your browsing experience.
            </p>
          </div>
          <div className="p-4 bg-[#141414] border border-[#27272A] space-y-1">
            <div className="text-white font-bold font-mono">order_ORD-KTM-XXXX</div>
            <p className="text-xs text-[#A1A1AA]">
              Retains active delivery verification PIN and live receipt details for your ongoing dispatch tracking.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white border-l-2 border-[#f91814] pl-3">
          3. Managing Your Preferences
        </h2>
        <p>
          You can clear your cookies or browser storage at any time through your browser settings. Note that clearing storage will empty your current cart ticket and require re-entering your delivery landmark on subsequent checkouts.
        </p>
      </section>
    </LegalLayout>
  );
}
