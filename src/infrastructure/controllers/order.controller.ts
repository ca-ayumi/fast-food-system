import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  NotFoundException, Param, BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrderService } from '../../domain/service/order.service';
import { CreateOrderDto } from '../../application/dto/create-order.dto';
import { OrderDto } from '../../application/dto/order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderDto> {
    try {
      return await this.orderService.createOrder(createOrderDto.clientId, createOrderDto.productIds);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          { status: HttpStatus.NOT_FOUND, error: error.message },
          HttpStatus.NOT_FOUND,
        );
      } else if (error instanceof BadRequestException) {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: error.message },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'List all orders' })
  async listOrders(): Promise<OrderDto[]> {
    try {
      return await this.orderService.listOrders();
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  async getOrderById(@Param('id') id: string): Promise<OrderDto> {
    try {
      return await this.orderService.getOrderById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          { status: HttpStatus.NOT_FOUND, error: error.message },
          HttpStatus.NOT_FOUND,
        );
      } else if (error instanceof BadRequestException) {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: error.message },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }
}
