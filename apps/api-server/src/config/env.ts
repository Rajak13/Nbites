import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  mongodbUri:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/nbites',
  jwt: {
    secret: process.env.JWT_SECRET || 'nbites-super-secret-jwt-key-2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  esewa: {
    productCode: process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST',
    secretKey: process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q',
    gatewayUrl:
      process.env.ESEWA_GATEWAY_URL ||
      'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
  },
  khalti: {
    publicKey: process.env.KHALTI_PUBLIC_KEY || 'test_public_key_77a9e18e',
    secretKey: process.env.KHALTI_SECRET_KEY || 'test_secret_key_684629',
    gatewayUrl:
      process.env.KHALTI_GATEWAY_URL ||
      'https://a.khalti.com/api/v2/epayment/initiate/',
  },
  sms: {
    devMode: process.env.SMS_DEV_MODE !== 'false',
  },
};
