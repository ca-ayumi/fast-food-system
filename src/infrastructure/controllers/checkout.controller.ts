import {
  Controller,
  Post,
  Get,
  Body,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { FakeCheckoutDto } from '../../application/dto/fake-checkout.dto';
import { CheckoutService } from '../../domain/service/checkout.service';
import { OrderDto } from 'src/application/dto/order.dto';
import { CreateOrderDto } from 'src/application/dto/create-order.dto';

@ApiTags('Checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('fake')
  @ApiOperation({
    summary: 'Fake checkout, just send selected products to the queue',
  })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully added to the queue.',
    type: OrderDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Client or Product not found' })
  @ApiBody({
    type: CreateOrderDto,
    description: 'Details of the order to be checked out',
  })
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
  @ApiResponse({
    status: 200,
    description: 'List of orders in the queue',
    type: [OrderDto],
  })
  getFakeQueue() {
    return this.checkoutService.getFakeQueue();
  }
}
