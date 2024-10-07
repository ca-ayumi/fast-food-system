import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { CheckoutDto } from '../dto/checkout.dto';
import { PaymentService } from '../../domain/service/payment.service';
import { OrderService } from '../../domain/service/order.service';

@Injectable()
export class CheckoutUseCase {
  private readonly logger = new Logger(CheckoutUseCase.name);

  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
  ) {}

  async execute(
    checkoutDto: CheckoutDto,
    userId: string,
    externalPosId: string,
  ): Promise<any> {
    this.logger.debug(
      `Starting checkout process for clientId: ${checkoutDto.clientId}`,
    );

    let order;
    try {
      order = await this.orderService.createOrder(
        checkoutDto.clientId,
        checkoutDto.productIds,
        checkoutDto.totalAmount,
      );
      this.logger.debug(`Order created successfully: ${order.id}`);
    } catch (error) {
      this.logger.error(
        `Failed to create order for clientId: ${checkoutDto.clientId}`,
        error.stack,
      );
      throw new BadRequestException('Failed to create order');
    }

    try {
      this.logger.debug(
        `Generating QR code for order: ${order.id}, userId: ${userId}, externalPosId: ${externalPosId}`,
      );
      const qrCode = await this.paymentService.createDynamicQR(
        userId,
        externalPosId,
        order,
      );
      this.logger.debug(
        `QR code generated successfully for order: ${order.id}`,
      );

      return {
        orderId: order.id,
        qrCode: qrCode,
      };
    } catch (error) {
      this.logger.error(
        `Failed to generate QR code for order: ${order.id}`,
        error.stack,
      );
      throw new BadRequestException('Failed to generate QR code');
    }
  }
}
