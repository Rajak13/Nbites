import { Request, Response } from 'express';
import { esewaService } from '../services/esewa.service';
import { khaltiService } from '../services/khalti.service';
import { config } from '../config/env';

export class PaymentController {
  /**
   * Generates eSewa v2 signature and payment form fields.
   */
  public async initiateEsewa(req: Request, res: Response): Promise<void> {
    try {
      const { amount, orderId } = req.body;

      if (!amount || !orderId) {
        res.status(400).json({
          success: false,
          message: 'amount and orderId are required',
        });
        return;
      }

      const transactionUuid = `${orderId}-${Date.now()}`;
      const successUrl = `${config.corsOrigin}/order-tracking/${orderId}?payment=success`;
      const failureUrl = `${config.corsOrigin}/checkout?payment=failed`;

      const paymentPayload = esewaService.initiatePayment({
        amount: Number(amount),
        transactionUuid,
        successUrl,
        failureUrl,
      });

      res.json({
        success: true,
        gateway: 'ESEWA_V2',
        gatewayUrl: esewaService.getGatewayUrl(),
        data: paymentPayload,
      });
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        message: 'Failed to initiate eSewa payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Handles eSewa callback / validation.
   */
  public async verifyEsewaCallback(req: Request, res: Response): Promise<void> {
    try {
      const { data } = req.query; // eSewa v2 returns base64 encoded string in ?data=

      if (!data || typeof data !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Encoded response data parameter required',
        });
        return;
      }

      const verification = esewaService.verifyCallbackSignature(data);

      if (!verification.isValid) {
        res.status(400).json({
          success: false,
          message: 'Invalid eSewa payment signature verification',
        });
        return;
      }

      res.json({
        success: true,
        message: 'eSewa payment successfully verified',
        data: verification.decodedPayload,
      });
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        message: 'Error verifying eSewa payment callback',
      });
    }
  }

  /**
   * Initiates payment with Khalti ePayment v2.
   */
  public async initiateKhalti(req: Request, res: Response): Promise<void> {
    try {
      const { amount, orderId, orderName, customerInfo } = req.body;

      if (!amount || !orderId) {
        res.status(400).json({
          success: false,
          message: 'amount (in NPR) and orderId are required',
        });
        return;
      }

      // Khalti takes amount in paisa (1 NPR = 100 Paisa)
      const amountInPaisa = Math.round(Number(amount) * 100);

      const response = await khaltiService.initiatePayment({
        return_url: `${config.corsOrigin}/order-tracking/${orderId}?payment=khalti_success`,
        website_url: config.corsOrigin,
        amount: amountInPaisa,
        purchase_order_id: orderId,
        purchase_order_name: orderName || `nBites Order ${orderId}`,
        customer_info: customerInfo || {
          name: 'nBites Guest',
          email: 'guest@nbites.com',
          phone: '9800000000',
        },
      });

      res.json({
        success: true,
        gateway: 'KHALTI_V2',
        data: response,
      });
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        message: 'Failed to initiate Khalti payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Verifies Khalti payment via lookup API.
   */
  public async verifyKhalti(req: Request, res: Response): Promise<void> {
    try {
      const { pidx } = req.body;

      if (!pidx) {
        res.status(400).json({
          success: false,
          message: 'pidx is required for Khalti verification',
        });
        return;
      }

      const lookupResult = await khaltiService.verifyPayment(pidx);

      res.json({
        success: true,
        data: lookupResult,
      });
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        message: 'Khalti payment verification failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const paymentController = new PaymentController();
