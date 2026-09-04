import mongoose from 'mongoose';
import { config } from './env';

let isConnected = false;

export async function connectDatabase(): Promise<typeof mongoose> {
  if (isConnected) {
    console.log('[MongoDB] Using existing database connection');
    return mongoose;
  }

  const uri = config.mongodbUri;

  try {
    console.log('[MongoDB] Connecting to MongoDB Atlas cluster...');
    
    // Mask password in logs
    const maskedUri = uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    console.log(`[MongoDB] Target URI: ${maskedUri}`);

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    isConnected = conn.connections[0].readyState === 1;

    console.log('====================================================');
    console.log(`✅ [MongoDB] Connected successfully to: ${conn.connection.name}`);
    console.log(`📡 [MongoDB] Host: ${conn.connection.host}`);
    console.log('====================================================');

    mongoose.connection.on('error', (err) => {
      console.error('❌ [MongoDB] Runtime connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ [MongoDB] Disconnected from MongoDB Atlas');
      isConnected = false;
    });

    return mongoose;
  } catch (error) {
    console.error('❌ [MongoDB] Connection failed:');
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`);
    }
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[MongoDB] Disconnected successfully');
  }
}
