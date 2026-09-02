'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Clock, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface Ticket {
  id: string;
  orderNumber: string;
  status: 'NEW' | 'IN_PROGRESS' | 'READY';
  items: { name: string; qty: number; notes?: string }[];
  elapsedSeconds: number;
  tableOrChannel: string;
}

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'tk-1',
    orderNumber: 'ORD-KTM-8942',
    status: 'IN_PROGRESS',
    items: [
      { name: 'Smoked Timur Pork Sekuwa', qty: 1, notes: 'Extra spicy timur dip' },
      { name: 'Jhol Momo (Buff)', qty: 1, notes: 'Hot achar broth' },
    ],
    elapsedSeconds: 240,
    tableOrChannel: 'Online Dispatch',
  },
  {
    id: 'tk-2',
    orderNumber: 'ORD-KTM-8943',
    status: 'NEW',
    items: [
      { name: 'Thakali Mutton Khana Set', qty: 2, notes: 'Ghee on side' },
      { name: 'Gundruk Sadeko', qty: 1 },
    ],
    elapsedSeconds: 45,
    tableOrChannel: 'Online Dispatch',
  },
  {
    id: 'tk-3',
    orderNumber: 'ORD-KTM-8940',
    status: 'READY',
    items: [
      { name: 'Sourdough Pizza (Diavola)', qty: 1 },
      { name: 'Truffle Fries', qty: 1 },
    ],
    elapsedSeconds: 620,
    tableOrChannel: 'Rider Arrived (Bikash M.)',
  },
];

export default function KDSPage() {
  const [tickets, setTickets] = React.useState<Ticket[]>(INITIAL_TICKETS);

  // Bump ticket status forward
  const bumpTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          if (t.status === 'NEW') return { ...t, status: 'IN_PROGRESS' };
          if (t.status === 'IN_PROGRESS') return { ...t, status: 'READY' };
        }
        return t;
      })
    );
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#F5F5F0] p-6 space-y-6">
      {/* Top KDS Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#27272A] pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[#F97316] text-black font-black flex items-center justify-center">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-editorial text-2xl font-bold tracking-tight">
              NBITES KDS &bull; Kitchen Display System
            </h1>
            <span className="text-xs font-mono text-[#A1A1AA]">
              Station: Main Grill & Cook Line (Bajeko Sekuwa Jhamsikhel)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Chip variant="live" pulse>
            KDS WebSocket Live
          </Chip>
          <Link href="/">
            <Button variant="outline" size="sm">
              Exit Portal
            </Button>
          </Link>
        </div>
      </div>

      {/* Ticket Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tickets.map((t) => {
          const isLate = t.elapsedSeconds > 600;
          return (
            <Card
              key={t.id}
              className={`border-2 ${
                t.status === 'READY'
                  ? 'border-emerald-500 bg-[#0B1E13]'
                  : isLate
                  ? 'border-red-500 bg-[#1A0C0C]'
                  : 'border-[#27272A] bg-[#141414]'
              }`}
            >
              <CardHeader className="p-4 pb-2 border-b border-[#27272A] flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-mono">{t.orderNumber}</CardTitle>
                  <span className="text-xs font-mono text-[#A1A1AA]">
                    {t.tableOrChannel}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-sm font-bold">
                  <Clock className="w-4 h-4 text-[#F97316]" />
                  <span>{formatTimer(t.elapsedSeconds)}</span>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                {/* Items */}
                <div className="space-y-3 font-mono text-sm">
                  {t.items.map((item, i) => (
                    <div
                      key={i}
                      className="border-b border-[#27272A]/50 pb-2 last:border-0"
                    >
                      <div className="flex justify-between font-bold text-[#F5F5F0]">
                        <span>
                          {item.qty}x {item.name}
                        </span>
                      </div>
                      {item.notes && (
                        <span className="text-xs text-[#F97316] block mt-0.5">
                          * {item.notes}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Status Bump Button */}
                <div className="pt-2">
                  {t.status === 'NEW' && (
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => bumpTicket(t.id)}
                    >
                      Start Cooking &rarr;
                    </Button>
                  )}
                  {t.status === 'IN_PROGRESS' && (
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => bumpTicket(t.id)}
                    >
                      Mark Ready for Dispatch &rarr;
                    </Button>
                  )}
                  {t.status === 'READY' && (
                    <div className="flex items-center justify-center gap-2 py-2 text-emerald-400 font-mono text-xs uppercase font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      Ready for Rider Pickup
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
