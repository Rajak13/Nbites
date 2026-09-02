import crypto from 'crypto';
import { config } from '../config/env';

export interface EsewaPaymentRequestPayload {
  amount: number;
  tax_amount?: number;
  total_amount: number;
  transaction_uuid: string;
  product_code: string;
  product_service_charge?: number;
  product_delivery_charge?: number;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

export class EsewaService {
  private secretKey: string;
  private productCode: string;
  private gatewayUrl: string;

  constructor() {
    this.secretKey = config.esewa.secretKey;
    this.productCode = config.esewa.productCode;
    this.gatewayUrl = config.esewa.gatewayUrl;
  }

  /**
   * Generates eSewa v2 HMAC-SHA256 base64 signature.
   * Format: "total_amount=<amt>,transaction_uuid=<uuid>,product_code=<code>"
   */
  public generateSignature(
    totalAmount: string | number,
    transactionUuid: string,
    productCode: string = this.productCode
  ): string {
    const signatureMessage = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    const hmac = crypto.createHmac('sha256', this.secretKey);
    hmac.update(signatureMessage);
    return hmac.digest('base64');
  }

  /**
   * Creates full payment form payload for client-side redirection to eSewa v2 gateway.
   */
  public initiatePayment(params: {
    amount: number;
    transactionUuid: string;
    deliveryFee?: number;
    successUrl: string;
    failureUrl: string;
  }): EsewaPaymentRequestPayload {
    const deliveryFee = params.deliveryFee || 0;
    const totalAmount = params.amount + deliveryFee;
    const signature = this.generateSignature(
      totalAmount,
      params.transactionUuid,
      this.productCode
    );

    return {
      amount: params.amount,
      tax_amount: 0,
      total_amount: totalAmount,
      transaction_uuid: params.transactionUuid,
      product_code: this.productCode,
      product_service_charge: 0,
      product_delivery_charge: deliveryFee,
      success_url: params.successUrl,
      failure_url: params.failureUrl,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature,
    };
  }

  /**
   * Validates eSewa response payload signature returned upon payment completion.
   */
  public verifyCallbackSignature(
    encodedData: string
  ): { isValid: boolean; decodedPayload: Record<string, unknown> } {
    try {
      const decodedString = Buffer.from(encodedData, 'base64').toString('utf-8');
      const payload = JSON.parse(decodedString);

      const generatedSig = this.generateSignature(
        payload.total_amount,
        payload.transaction_uuid,
        payload.product_code
      );

      const isValid = generatedSig === payload.signature;
      return { isValid, decodedPayload: payload };
    } catch (err) {
      return { isValid: false, decodedPayload: {} };
    }
  }

  public getGatewayUrl(): string {
    return this.gatewayUrl;
  }
}

export const esewaService = new EsewaService();
