/**
 * SMS Service — abstraction layer for sending SMS notifications and OTPs in Nepal.
 * 
 * Supports:
 *  - Dev mode (default): Formats and outputs verification code to console
 *  - Sparrow SMS / Twilio pluggable architecture
 */

import { config } from '../config/env';

export interface ISmsService {
  sendOtp(phone: string, otp: string): Promise<boolean>;
}

class SmsService implements ISmsService {
  async sendOtp(phone: string, otp: string): Promise<boolean> {
    const message = `[nBites] Your security verification code is: ${otp}. Valid for 5 minutes. Do not share this code.`;

    if (config.sms.devMode) {
      console.log('──────────────────────────────────────────────────');
      console.log(`[SMS DEV SIMULATION] To: +977 ${phone}`);
      console.log(`Message: ${message}`);
      console.log(`CODE: >>> ${otp} <<<`);
      console.log('──────────────────────────────────────────────────');
      return true;
    }

    // Production hook: Sparrow SMS or Twilio API
    try {
      // Example Sparrow SMS endpoint if configured
      if (process.env.SPARROW_SMS_TOKEN) {
        const response = await fetch('http://api.sparrowsms.com/v2/sms/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: process.env.SPARROW_SMS_TOKEN,
            from: 'TheAlert',
            to: phone,
            text: message,
          }),
        });
        return response.ok;
      }

      console.warn('[SMS] Production credentials not found, fallback to console log');
      console.log(`[SMS FALLBACK] To: ${phone} | Code: ${otp}`);
      return true;
    } catch (err) {
      console.error('[SMS] Failed to transmit SMS:', err);
      return false;
    }
  }
}

export const smsService = new SmsService();
