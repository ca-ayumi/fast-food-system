import {
  Controller,
  Post,
  Get,
  Body,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FakeCheckoutDto } from '../../application/dto/fake-checkout.dto';
import { CheckoutService } from '../../domain/service/checkout.service';

@ApiTags('Checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('fake')
  @ApiOperation({ summary: 'Fake checkout to enqueue selected products' })
  async fakeCheckout(
    @Body() fakeCheckoutDto: FakeCheckoutDto,
  ): Promise<string> {
    try {
      return await this.checkoutService.fakeCheckout(fakeCheckoutDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          { status: HttpStatus.NOT_FOUND, error: error.message },
          HttpStatus.NOT_FOUND,
        );
      }
      throw error;
    }
  }

  @Get('queue')
  @ApiOperation({ summary: 'Get current fake queue' })
  getFakeQueue() {
    return this.checkoutService.getFakeQueue();
  }
}
