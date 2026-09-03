import * as React from 'react';
import { ComingSoon } from '@/components/common/ComingSoon';

export const metadata = {
  title: 'Order Telemetry Tracking | Coming Soon | nBites',
  description: 'Live order telemetry tracking with Turf.js spatial logistics.',
};

export default function OrderTrackingPage() {
  return (
    <ComingSoon
      moduleCode="TRACKING 01"
      moduleName="LIVE TELEMETRY"
      description="Live radar coordinate streaming and real-time kitchen state machine tracking are firing soon."
    />
  );
}
