import * as React from 'react';
import { LegalLayout } from '@/components/legal/LegalLayout';

export const metadata = {
  title: 'Refunds & Cancellation Policy | nBites',
  description: 'Rules governing order cancellations, kitchen rejections, and eSewa/Khalti refund reversals.',
};

export default function RefundsPage() {
  return (
    <LegalLayout
      title="Cancellation &amp; Refund Rules"
      subtitle="Clear, fair policies regarding order cancellations, kitchen stock-outs, and digital payment reversals in Nepal."
    >
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white border-l-2 border-[#f91814] pl-3">
          1. Self-Service Order Cancellation
        </h2>
        <p>
          Customers may cancel an order free of charge while the order status remains <code className="text-white bg-[#18120e] px-1.5 py-0.5 border border-[#27272A]">PLACED</code> (prior to kitchen confirmation). Once the restaurant accepts the order and commences preparation (<code className="text-[#f91814] bg-[#18120e] px-1.5 py-0.5 border border-[#27272A]">ACCEPTED / PREPARING</code>), self-service cancellation is locked to prevent food waste.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white border-l-2 border-[#f91814] pl-3">
          2. Kitchen Rejection &amp; Stock-Outs
        </h2>
        <p>
          If a merchant partner is unable to fulfill your order due to item stock-out or peak kitchen overload, the order status transitions to <code className="text-red-400 bg-[#18120e] px-1.5 py-0.5 border border-[#27272A]">CANCELLED</code>. If prepaid via eSewa or Khalti, an automated refund reversal is initiated immediately back to your originating wallet or bank account within 2 to 24 banking hours.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white border-l-2 border-[#f91814] pl-3">
          3. Food Quality &amp; Missing Items
        </h2>
        <p>
          If an order arrives with incorrect items or significant damage during transit, customers must notify support within 45 minutes of delivery timestamp with photo verification. Legitimate quality claims qualify for instant wallet credit or direct item replacement.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white border-l-2 border-[#f91814] pl-3">
          4. Contacting Support
        </h2>
        <p>
          For urgent cancellation inquiries or payment discrepancies, contact our dispatch operations team at <a href="mailto:hello@nbites.com" className="text-[#f91814] underline underline-offset-2">hello@nbites.com</a> or via our engineering contact <a href="mailto:nantio.official@gmail.com" className="text-[#f91814] underline underline-offset-2">nantio.official@gmail.com</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
