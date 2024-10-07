import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('webhook-pagamentos')
export class MercadoPagoWebhookController {
  @Post()
  async handlePaymentNotification(@Body() body: any, @Res() res: Response) {
    console.log('Notificação recebida do Mercado Pago:', body);

    if (body.type === 'payment' && body.data && body.data.id) {
      const paymentId = body.data.id;

      console.log(`Pagamento recebido com ID: ${paymentId}`);

      return res.status(200).send('OK');
    }

    return res.status(400).send('Bad Request');
  }
}
