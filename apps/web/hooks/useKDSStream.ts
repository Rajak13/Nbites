import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface KDSTicketPayload {
  id: string;
  orderNumber: string;
  status: 'NEW' | 'IN_PROGRESS' | 'READY' | 'DISPATCHED';
  restaurantId: string;
  station: string;
  items: { name: string; qty: number; notes?: string }[];
  timestamp: string;
}

export function useKDSStream(restaurantId: string) {
  const [tickets, setTickets] = useState<KDSTicketPayload[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';
    const socket: Socket = io(`${socketUrl}/kds`, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('kds:join_kitchen', { restaurantId });
    });

    socket.on('kds:ticket_created', (ticket: KDSTicketPayload) => {
      setTickets((prev) => [ticket, ...prev]);
    });

    socket.on('kds:ticket_updated', (ticket: KDSTicketPayload) => {
      setTickets((prev) =>
        prev.map((t) => (t.id === ticket.id ? { ...t, ...ticket } : t))
      );
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [restaurantId]);

  return { tickets, isConnected };
}
