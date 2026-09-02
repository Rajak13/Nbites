import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface TelemetryData {
  orderId: string;
  status: string;
  riderLat: number;
  riderLng: number;
  etaMinutes: number;
  updatedAt: string;
}

export function useOrderTelemetry(orderId: string) {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';
    const socket: Socket = io(`${socketUrl}/drivers`, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join:order_track', { orderId });
    });

    socket.on('telemetry:update', (data: TelemetryData) => {
      setTelemetry(data);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  return { telemetry, isConnected };
}
