import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case';
import { OrderService } from '../../domain/service/order.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateOrderDto } from '../../application/dto/create-order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly orderService: OrderService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.createOrderUseCase.execute(createOrderDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  async getOrderById(@Param('id') id: number) {
    return await this.orderService.getOrderById(id);
  }
}
