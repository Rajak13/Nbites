import * as React from 'react';
import { ComingSoon } from '@/components/common/ComingSoon';

export const metadata = {
  title: 'Restaurant Menu | Coming Soon | nBites',
  description: 'Artisan kitchen menu catalog.',
};

export default function RestaurantPage() {
  return (
    <ComingSoon
      moduleCode="KITCHEN 01"
      moduleName="RESTAURANT MENU"
      description="Individual kitchen catalogs and dish customization stations are currently being curated. Firing soon."
    />
  );
}
