import * as React from 'react';
import { LegalLayout } from '@/components/legal/LegalLayout';

export const metadata = {
  title: 'Terms of Service | nBites',
  description: 'Official Terms of Service governing culinary orders, dispatch telemetry, and digital transactions on nBites.',
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="Standard terms and conditions governing customer orders, merchant partner relations, and delivery logistics across Nepal."
    >
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white border-l-2 border-[#f91814] pl-3">
          1. Scope &amp; Legal Framework
        </h2>
        <p>
          Welcome to nBites. By accessing our web application, ordering food, or interacting with our automated dispatch systems, you agree to be bound by these Terms of Service. nBites operates as an editorial, hyper-local culinary logistics engine facilitating transactions between independent kitchens, riders, and end consumers in Nepal.
        </p>
        <p>
          These Terms are governed by the substantive laws of Nepal, including the Electronic Transactions Act 2063 (2006) and the Consumer Protection Act 2075 (2018).
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white border-l-2 border-[#f91814] pl-3">
          2. Ordering &amp; Single-Kitchen Policy
        </h2>
        <p>
          To ensure food temperature integrity and prevent multi-stop logistical degradation, all customer orders are strictly bound to a single merchant kitchen per checkout. Attempting to add dishes from multiple kitchens requires clearing the active cart.
        </p>
        <p>
          Orders once transmitted to the kitchen and marked as <code className="text-[#f91814] bg-[#18120e] px-1.5 py-0.5 border border-[#27272A]">ACCEPTED</code> cannot be cancelled by the user through self-service, as food preparation has commenced.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white border-l-2 border-[#f91814] pl-3">
          3. Phone-First Identity &amp; Contact Verification
        </h2>
        <p>
          Customers must provide a valid 10-digit Nepal telecommunications mobile number (<code className="text-white bg-[#18120e] px-1.5 py-0.5 border border-[#27272A]">+977 98XXXXXXXX / 97XXXXXXXX</code>). This number is utilized by dispatch riders to coordinate drop-off landmarks and verify arrival. Failure to answer rider contact upon arrival may result in delivery forfeiture after a mandatory 10-minute wait time.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white border-l-2 border-[#f91814] pl-3">
          4. Payments &amp; Gateway Settlements
        </h2>
        <p>
          nBites supports direct wallet payments via eSewa v2 and Khalti ePayment, as well as Cash on Delivery (COD). Digital transactions are settled in Nepali Rupees (NPR). Cash on Delivery is limited to orders under NPR 5,000 to mitigate fraud and non-acceptance risks.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white border-l-2 border-[#f91814] pl-3">
          5. Platform Engineering Disclosure
        </h2>
        <p>
          The nBites storefront, real-time Kitchen Display System (KDS), and spatial routing engines are engineered and operated by <strong className="text-white">&lt;nantio&gt;</strong> (Dharan, Nepal). Inquiries regarding commercial licensing, software architecture, or platform partnerships should be directed to <a href="mailto:nantio.official@gmail.com" className="text-[#f91814] underline underline-offset-2">nantio.official@gmail.com</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
