import * as React from 'react';
import { ComingSoon } from '@/components/common/ComingSoon';

export const metadata = {
  title: 'Discovery Index | Coming Soon | nBites',
  description: 'Kitchen discovery index for Kathmandu Valley. Firing soon.',
};

export default function DiscoveryPage() {
  return (
    <ComingSoon
      moduleCode="SECTOR 01"
      moduleName="KITCHEN DISCOVERY"
      description="Our hyper-local kitchen discovery index is being curated with verified master kitchens across Nepal. Firing soon."
    />
  );
}
