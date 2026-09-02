import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Server as SocketIOServer } from 'socket.io';
import { config } from './config/env';
import apiRouter from './routes';
import { apiRateLimiter } from './middleware/rateLimiter.middleware';
import { registerKDSSocket } from './sockets/kds.socket';
import { registerDriverSocket } from './sockets/driver.socket';

const app = express();
const server = http.createServer(app);

// -----------------------------------------------------------------------------
// Middlewares
// -----------------------------------------------------------------------------
app.use(helmet());
app.use(
  cors({
    origin: [config.corsOrigin, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));

// Global API rate limiting
app.use('/api/', apiRateLimiter);

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------
app.use('/api/v1', apiRouter);

// Root Status
app.get('/', (_req, res) => {
  res.json({
    service: 'nBites Real-Time Backend API',
    version: '1.0.0',
    documentation: '/api/v1/health',
    status: 'ONLINE',
  });
});

// -----------------------------------------------------------------------------
// WebSocket Gateway (Socket.io)
// -----------------------------------------------------------------------------
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  pingTimeout: 30000,
  pingInterval: 10000,
});

registerKDSSocket(io);
registerDriverSocket(io);

// -----------------------------------------------------------------------------
// Server Initialization
// -----------------------------------------------------------------------------
const PORT = config.port;

server.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 nBites API Server running on port ${PORT}`);
  console.log(`🌐 HTTP URL:    http://localhost:${PORT}`);
  console.log(`⚡ WebSocket:   ws://localhost:${PORT}`);
  console.log(`🔥 Environment: ${config.nodeEnv}`);
  console.log('====================================================');
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP and Socket server');
  server.close(() => {
    console.log('HTTP & Socket server closed');
  });
});

export { app, server, io };
