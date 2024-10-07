import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('webhook-pagamentos')
export class MercadoPagoWebhookController {
  @Post()
  async handlePaymentNotification(@Body() body: any, @Res() res: Response) {
    console.log('Notificação recebida do Mercado Pago:', body);

    // Aqui você pode processar o pagamento e atualizar o status do pedido na sua aplicação
    if (body.type === 'payment' && body.data && body.data.id) {
      const paymentId = body.data.id;

      // Processar o pagamento com o paymentId, como verificar o status do pagamento no Mercado Pago
      console.log(`Pagamento recebido com ID: ${paymentId}`);

      // Retorne uma resposta de sucesso para o Mercado Pago
      return res.status(200).send('OK');
    }

    return res.status(400).send('Bad Request');
  }
}
