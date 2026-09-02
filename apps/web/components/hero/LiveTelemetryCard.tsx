'use client';

import * as React from 'react';

export function LiveTelemetryCard() {
  return (
    <div
      className="w-full bg-[#FFFFFF] border-2 border-[#18120e] rounded-none p-6 shadow-[8px_8px_0px_0px_#18120e] transition-all"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between border-b-2 border-[#18120e] pb-4 mb-6">
        <div className="flex flex-col">
          <span className="font-mono text-xs font-semibold text-[#7a6e65] tracking-wider uppercase">
            TELEMETRY TRACE ID
          </span>
          <span className="font-mono text-sm font-bold text-[#18120e] tracking-tight">
            #ORD-20260902-1082
          </span>
        </div>

        {/* Pill status chip (100px radius, bg #f5e3cd, border 1px solid #18120e, text #f91814) */}
        <span className="inline-flex items-center gap-1.5 rounded-[100px] px-3.5 py-1 bg-[#f5e3cd] border border-[#18120e] text-[#f91814] font-mono text-xs font-bold uppercase tracking-wider select-none">
          <span className="w-2 h-2 rounded-full bg-[#f91814] animate-pulse" />
          KITCHEN ACTIVE
        </span>
      </div>

      {/* Data Table Rows */}
      <div className="space-y-5">
        {/* Row 1: Order Verification */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span
              className="font-bold text-[#18120e] uppercase tracking-wide text-sm"
              style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
            >
              01. Order Verification
            </span>
            <span className="text-[#18120e] font-mono font-bold text-xs bg-[#f5e3cd]/70 px-2 py-0.5 border border-[#18120e]/30">
              [● VERIFIED]
            </span>
          </div>
          {/* Progress Bar (h-2, bg #f5e3cd, filled 100% with #18120e) */}
          <div className="h-2 w-full bg-[#f5e3cd] border border-[#18120e] overflow-hidden">
            <div className="h-full bg-[#18120e] w-full" />
          </div>
        </div>

        {/* Row 2: eSewa / Khalti Payment */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span
              className="font-bold text-[#18120e] uppercase tracking-wide text-sm"
              style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
            >
              02. eSewa / Khalti Payment
            </span>
            <span className="text-[#f91814] font-mono font-bold text-xs bg-[#f5e3cd]/70 px-2 py-0.5 border border-[#f91814]/40">
              [● PAID]
            </span>
          </div>
          {/* Progress Bar (filled 100% with #f91814) */}
          <div className="h-2 w-full bg-[#f5e3cd] border border-[#18120e] overflow-hidden">
            <div className="h-full bg-[#f91814] w-full" />
          </div>
        </div>

        {/* Row 3: Delivery Dispatch */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span
              className="font-bold text-[#18120e] uppercase tracking-wide text-sm"
              style={{ fontFamily: 'var(--font-nokie), sans-serif' }}
            >
              03. Delivery Dispatch
            </span>
            <span className="text-[#f91814] font-mono font-bold text-xs bg-[#f5e3cd]/70 px-2 py-0.5 border border-[#f91814]/40">
              [● IN TRANSIT]
            </span>
          </div>
          {/* Progress Bar (filled 60% with #f91814) */}
          <div className="h-2 w-full bg-[#f5e3cd] border border-[#18120e] overflow-hidden">
            <div className="h-full bg-[#f91814] w-[60%]" />
          </div>
        </div>
      </div>

      {/* Card Micro Footer Info */}
      <div className="mt-6 pt-4 border-t border-[#18120e]/20 flex items-center justify-between font-mono text-[11px] text-[#7a6e65]">
        <span>ZONE: KATHMANDU SECTOR 01</span>
        <span>LATENCY: 14ms</span>
      </div>
    </div>
  );
}
