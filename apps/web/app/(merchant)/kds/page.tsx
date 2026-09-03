import * as React from 'react';
import { ComingSoon } from '@/components/common/ComingSoon';

export const metadata = {
  title: 'Kitchen KDS | Coming Soon | nBites',
  description: 'Synchronized kitchen display system for live restaurant line dispatch.',
};

export default function KDSPage() {
  return (
    <ComingSoon
      moduleCode="SECTOR 02"
      moduleName="KITCHEN KDS"
      description="Live kitchen display terminal and line station telemetry are currently in private pilot testing. Public rollout firing soon."
    />
  );
}
