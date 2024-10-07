import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CheckoutDto } from '../../dto/checkout.dto';
import { CheckoutUseCase } from '../../use-cases/checkout-use-case';
import { CheckoutResponse } from '../../dto/checkout-response.dto';


@ApiTags('Checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutUseCase: CheckoutUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Process checkout and generate a MercadoPago QR code',
  })
  @ApiResponse({
    status: 201,
    description: 'QR code generated for the order',
    type: CheckoutResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async processCheckout(@Body() checkoutDto: CheckoutDto) {
    const userId = process.env.MERCADOPAGO_USER_ID;
    const externalPosId = process.env.MERCADOPAGO_EXTERNAL_POS_ID;

    if (!userId || !externalPosId) {
      throw new Error(
        'MERCADOPAGO_USER_ID and MERCADOPAGO_EXTERNAL_POS_ID must be defined in environment variables',
      );
    }

    return this.checkoutUseCase.execute(checkoutDto, userId, externalPosId);
  }
}
