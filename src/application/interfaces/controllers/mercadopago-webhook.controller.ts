import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentService } from '../../../domain/service/payment.service';

@ApiTags('MercadoPago Webhook')
@Controller('mercadopago-webhook')
export class MercadoPagoWebhookController {
  private readonly logger = new Logger(MercadoPagoWebhookController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Post('/merchant-order')
  @ApiOperation({
    summary: 'Receive MercadoPago merchant order notifications',
  })
  async handleMerchantOrderNotification(@Body() body: any): Promise<void> {
    this.logger.debug('Received merchant order notification', body);

    try {
      const { type, data } = body;

      if (type === 'merchant_order' && data.id) {
        this.logger.debug(`Processing merchant order with ID: ${data.id}`);

        await this.paymentService.processMerchantOrderNotification(data.id);
      } else {
      }
    } catch (error) {
      this.logger.error('Error processing merchant order notification', error);
      throw new HttpException(
        'Failed to process notification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
