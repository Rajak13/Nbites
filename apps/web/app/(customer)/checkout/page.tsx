import * as React from 'react';
import { ComingSoon } from '@/components/common/ComingSoon';

export const metadata = {
  title: 'Checkout | Coming Soon | nBites',
  description: 'Editorial checkout system for nBites.',
};

export default function CheckoutPage() {
  return (
    <ComingSoon
      moduleCode="CHECKOUT 01"
      moduleName="ORDER CHECKOUT"
      description="Direct phone-first dispatch checkout with Nepal wallet integration (eSewa & Khalti) is undergoing final security compliance. Firing soon."
    />
  );
}
