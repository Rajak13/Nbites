import { Server, Socket } from 'socket.io';

export function registerKDSSocket(io: Server) {
  const kdsNamespace = io.of('/kds');

  kdsNamespace.on('connection', (socket: Socket) => {
    console.log(`[KDS Socket] Kitchen client connected: ${socket.id}`);

    // Join restaurant specific kitchen channel
    socket.on('kds:join_kitchen', (data: { restaurantId: string }) => {
      const room = `restaurant:${data.restaurantId}`;
      socket.join(room);
      console.log(`[KDS Socket] ${socket.id} joined kitchen room ${room}`);
    });

    // Handle ticket state updates from KDS client (NEW -> IN_PROGRESS -> READY)
    socket.on(
      'kds:update_ticket_status',
      (data: {
        ticketId: string;
        orderId: string;
        restaurantId: string;
        status: 'NEW' | 'IN_PROGRESS' | 'READY' | 'DISPATCHED';
      }) => {
        const room = `restaurant:${data.restaurantId}`;
        console.log(
          `[KDS Socket] Ticket ${data.ticketId} status updated to ${data.status}`
        );

        // Broadcast to all station displays in this restaurant
        kdsNamespace.to(room).emit('kds:ticket_updated', {
          ticketId: data.ticketId,
          orderId: data.orderId,
          status: data.status,
          updatedAt: new Date().toISOString(),
        });

        // Also broadcast to general customer order tracking
        io.of('/drivers').to(`order:${data.orderId}`).emit('order:status_changed', {
          orderId: data.orderId,
          status: data.status,
          timestamp: new Date().toISOString(),
        });
      }
    );

    socket.on('disconnect', () => {
      console.log(`[KDS Socket] Kitchen client disconnected: ${socket.id}`);
    });
  });
}
