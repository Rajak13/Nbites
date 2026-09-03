import * as React from 'react';
import { ComingSoon } from '@/components/common/ComingSoon';

export const metadata = {
  title: 'Portal Access | Coming Soon | nBites',
  description: 'Merchant & Rider unified portal for nBites.',
};

export default function LoginPage() {
  return (
    <ComingSoon
      moduleCode="PORTAL 01"
      moduleName="MERCHANT & RIDER"
      description="Unified merchant, kitchen staff, and rider telemetry access portal. Launching with our first cohort of partner kitchens."
    />
  );
}
