import * as React from 'react';
import { LegalLayout } from '@/components/legal/LegalLayout';

export const metadata = {
  title: 'Privacy & Data Policy | nBites',
  description: 'How nBites and <nantio> collect, store, and process customer telemetry and order data in Nepal.',
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy & Data Policy"
      subtitle="Transparent protocols for personal data protection, spatial telemetry tracking, and Nepal digital communication standards."
    >
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white border-l-2 border-[#f91814] pl-3">
          1. Data Collected
        </h2>
        <p>
          nBites adheres to minimal-data principles. To process your culinary dispatch, we collect:
        </p>
        <ul className="list-disc list-inside space-y-1 text-[#A1A1AA] pl-2">
          <li><strong>Contact Identifier:</strong> Mobile phone number (+977) and optional name.</li>
          <li><strong>Geographic Landmark:</strong> Delivery address, street name, and GPS coordinates for spatial radius routing.</li>
          <li><strong>Transaction Logs:</strong> Order receipt, items chosen, and payment provider references (eSewa / Khalti transaction IDs). We do not store banking passwords or wallet MPINs.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white border-l-2 border-[#f91814] pl-3">
          2. Live Spatial Telemetry
        </h2>
        <p>
          When you place an order, our automated logistics engine calculates route bearings and Haversine distances using Turf.js. Rider GPS coordinate updates are streamed over WebSockets strictly during active delivery transit and are purged following successful delivery verification.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white border-l-2 border-[#f91814] pl-3">
          3. Non-Disclosure &amp; Third Parties
        </h2>
        <p>
          We do not sell, license, or monetize customer phone numbers or order histories to advertisers. Contact information is shared solely with the assigned delivery rider and merchant kitchen solely to facilitate physical hand-off.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white border-l-2 border-[#f91814] pl-3">
          4. Security Standards
        </h2>
        <p>
          All network communications are encrypted via HTTPS (TLS 1.3). Digital payment callbacks are validated using HMAC-SHA256 cryptographic signatures. Infrastructure is maintained by &lt;nantio&gt; with localized servers and data governance in Nepal.
        </p>
      </section>
    </LegalLayout>
  );
}
