import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { OrderService } from './order.service';

@Injectable()
export class PaymentService {
  private readonly baseUrl: string = 'https://api.mercadopago.com';
  private readonly accessToken: string =
    'APP_USR-4485502391533418-100613-4d38eab5caf4361ee25d6b580571b5fb-2023202558'; // Substitua pelo seu Access Token

  constructor(
    private readonly httpService: HttpService,
    private readonly orderService: OrderService,
  ) {}

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
      notification_url:
        'https://e6d0-2804-14c-75a7-5e88-f801-3b56-bb6c-993a.ngrok-free.app',
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

      // Retornando a URL do QR Code gerado
      if (response.data.qr_data) {
        return response.data.qr_data; // Retorna o qr_data (string do QR Code)
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
      // 1. Fazer requisição para o Mercado Pago para buscar as merchant orders
      const response = await this.httpService
        .get('https://api.mercadopago.com/merchant_orders/search', {
          headers: {
            Authorization: `Bearer APP_USR-4485502391533418-100613-4d38eab5caf4361ee25d6b580571b5fb-2023202558`, // Substitua pelo seu token
          },
        })
        .toPromise();

      const merchantOrders = response.data.elements;

      // 2. Encontrar a merchant order que corresponde ao nosso orderId
      const matchingOrder = merchantOrders.find(
        (order) => order.external_reference === orderId,
      );

      if (!matchingOrder) {
        throw new Error(`Order with ID ${orderId} not found in Mercado Pago`);
      }

      // 3. Verificar o status da merchant order
      const isPaid = matchingOrder.status === 'closed' &&
        matchingOrder.payments?.some(payment => payment.status === 'approved');

      if (isPaid) {
        return {
          orderId: matchingOrder.external_reference,
          status: 'paid', // Pagamento aprovado
        };
      } else if (matchingOrder.status === 'opened') {
        return {
          orderId: matchingOrder.external_reference,
          status: 'pending', // Pagamento pendente
        };
      } else {
        return {
          orderId: matchingOrder.external_reference,
          status: 'unknown', // Status desconhecido
        };
      }
    } catch (error) {
      console.error('Erro ao consultar o status do pagamento:', error);
      throw new Error('Erro ao consultar o status do pagamento');
    }
  }
}
