import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { OrderService } from './order.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(OrderService.name);
  private readonly baseUrl: string;
  private readonly accessToken: string;
  private readonly notificationUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly orderService: OrderService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('MERCADOPAGO_BASE_URL');
    this.accessToken = this.configService.get<string>(
      'MERCADOPAGO_ACCESS_TOKEN',
    );
    this.notificationUrl = this.configService.get<string>(
      'MERCADOPAGO_NOTIFICATION_URL',
    );
  }

  async createDynamicQR(
    userId: string,
    externalPosId: string,
    order: Order,
  ): Promise<string> {
    const url = `${this.baseUrl}/instore/orders/qr/seller/collectors/${userId}/pos/${externalPosId}/qrs`;

    const payload = {
      external_reference: order.id,
      title: 'Order Payment',
      description: 'Purchase of products',
      notification_url: this.notificationUrl,
      total_amount: order.product.reduce(
        (sum, product) => sum + product.price,
        0,
      ),
      items: order.product.map((product) => ({
        sku_number: product.id,
        category: product.category,
        title: product.name,
        description: product.description,
        unit_price: product.price,
        quantity: 1,
        unit_measure: 'unit',
        total_amount: product.price,
      })),
      cash_out: {
        amount: 0,
      },
    };

    try {
      const response: AxiosResponse = await this.httpService
        .post(url, payload, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        .toPromise();

      if (response.data.qr_data) {
        return response.data.qr_data;
      } else {
        throw new Error('QR Code not generated');
      }
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      throw new Error('Erro ao gerar QR Code');
    }
  }

  async checkPaymentStatus(orderId: string): Promise<any> {
    try {
      const response = await this.httpService
        .get(`${this.baseUrl}/merchant_orders/search`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        })
        .toPromise();

      const merchantOrders = response.data.elements;
      const matchingOrder = merchantOrders.find(
        (order) => order.external_reference === orderId,
      );

      if (!matchingOrder) {
        throw new Error(`Order with ID ${orderId} not found in Mercado Pago`);
      }

      const isPaid =
        matchingOrder.status === 'closed' &&
        matchingOrder.payments?.some(
          (payment) => payment.status === 'approved',
        );

      if (isPaid) {
        return {
          orderId: matchingOrder.external_reference,
          status: 'paid',
        };
      } else if (matchingOrder.status === 'opened') {
        return {
          orderId: matchingOrder.external_reference,
          status: 'pending',
        };
      } else {
        return {
          orderId: matchingOrder.external_reference,
          status: 'unknown',
        };
      }
    } catch (error) {
      console.error('Erro ao consultar o status do pagamento:', error);
      throw new Error('Erro ao consultar o status do pagamento');
    }
  }

  async processMerchantOrderNotification(
    merchantOrderId: string,
  ): Promise<void> {
    try {
      this.logger.debug(
        `Fetching details for merchant order ID: ${merchantOrderId}`,
      );

      const response: AxiosResponse = await this.httpService
        .get(`${this.baseUrl}/merchant_orders/${merchantOrderId}`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        })
        .toPromise();

      const merchantOrder = response.data;

      this.logger.debug('Merchant order details received', merchantOrder);

      const isPaid =
        merchantOrder.status === 'closed' &&
        merchantOrder.payments?.some(
          (payment) => payment.status === 'approved',
        );

      const orderStatus = isPaid ? 'Finalizado' : 'Recebido';

      await this.orderService.updateOrderStatus(
        merchantOrder.external_reference,
        orderStatus,
      );

      this.logger.debug(
        `Order ${merchantOrder.external_reference} updated to ${orderStatus}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process merchant order notification for ID: ${merchantOrderId}`,
        error,
      );
      throw new HttpException(
        'Failed to process merchant order notification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
