import { Server, Socket } from 'socket.io';

export function registerDriverSocket(io: Server) {
  const driverNamespace = io.of('/drivers');

  driverNamespace.on('connection', (socket: Socket) => {
    console.log(`[Driver Socket] Client connected: ${socket.id}`);

    // Customer or merchant joining specific order tracking stream
    socket.on('join:order_track', (data: { orderId: string }) => {
      const room = `order:${data.orderId}`;
      socket.join(room);
      console.log(`[Driver Socket] ${socket.id} joined tracking room ${room}`);
    });

    // Rider broadcasting live GPS coordinates
    socket.on(
      'driver:location_ping',
      (data: {
        driverId: string;
        orderId?: string;
        lat: number;
        lng: number;
        speed?: number;
        heading?: number;
      }) => {
        // If assigned to an active order, broadcast to the order room
        if (data.orderId) {
          const room = `order:${data.orderId}`;
          driverNamespace.to(room).emit('telemetry:update', {
            orderId: data.orderId,
            riderLat: data.lat,
            riderLng: data.lng,
            speed: data.speed || 0,
            heading: data.heading || 0,
            updatedAt: new Date().toISOString(),
          });
        }
      }
    );

    socket.on('disconnect', () => {
      console.log(`[Driver Socket] Client disconnected: ${socket.id}`);
    });
  });
}
