import { config } from '../config/env';

export interface KhaltiInitiatePayload {
  return_url: string;
  website_url: string;
  amount: number; // in paisa (1 NPR = 100 Paisa)
  purchase_order_id: string;
  purchase_order_name: string;
  customer_info?: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface KhaltiInitiateResponse {
  pidx: string;
  payment_url: string;
  expires_at: string;
  expires_in: number;
}

export interface KhaltiLookupResponse {
  pidx: string;
  total_amount: number;
  status: 'Completed' | 'Pending' | 'Initiated' | 'Refunded' | 'Expired' | 'User canceled';
  transaction_id: string;
  fee: number;
  refunded: boolean;
}

export class KhaltiService {
  private secretKey: string;
  private gatewayUrl: string;

  constructor() {
    this.secretKey = config.khalti.secretKey;
    this.gatewayUrl = config.khalti.gatewayUrl;
  }

  /**
   * Initiates payment request with Khalti v2 epayment API.
   */
  public async initiatePayment(
    payload: KhaltiInitiatePayload
  ): Promise<KhaltiInitiateResponse> {
    try {
      const response = await fetch(this.gatewayUrl, {
        method: 'POST',
        headers: {
          Authorization: `Key ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Khalti initiation failed: ${errText}`);
      }

      const data = (await response.json()) as KhaltiInitiateResponse;
      return data;
    } catch (error: unknown) {
      throw new Error(
        `Khalti Service Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Verifies/Lookups payment status by pidx with Khalti v2 epayment API.
   */
  public async verifyPayment(pidx: string): Promise<KhaltiLookupResponse> {
    try {
      const lookupUrl = 'https://a.khalti.com/api/v2/epayment/lookup/';
      const response = await fetch(lookupUrl, {
        method: 'POST',
        headers: {
          Authorization: `Key ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pidx }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Khalti lookup verification failed: ${errText}`);
      }

      const data = (await response.json()) as KhaltiLookupResponse;
      return data;
    } catch (error: unknown) {
      throw new Error(
        `Khalti Verification Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

export const khaltiService = new KhaltiService();
