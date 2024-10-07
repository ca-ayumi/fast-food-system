// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Client } from '../entities/client.entity';
// import { Product } from '../entities/product.entity';
// import { CheckoutDto } from 'src/application/dto/checkout.dto';
// import { Order, OrderStatus } from '../entities/order.entity';
// import { PaymentService } from './payment.service';
// import { OrderService } from './order.service';
//
// @Injectable()
// export class CheckoutService {
//   constructor(
//     private readonly orderService: OrderService,
//     private readonly paymentService: PaymentService,
//   ) {}
//
//   async finalizeCheckout(
//     clientId: string,
//     cartItems: any[],
//     totalAmount: number,
//   ) {
//     // Criar a ordem na aplicação
//     const order = await this.orderService.createOrder(
//       clientId,
//       cartItems,
//       totalAmount,
//     );
//
//     // Enviar a ordem para o Mercado Pago
//     const paymentResponse =
//       await this.paymentService.createMercadoPagoOrder(order);
//
//     // Retornar a resposta do Mercado Pago (com o QR Code)
//     return paymentResponse;
//   }
// }
