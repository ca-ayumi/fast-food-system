import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { OrderService } from '../../domain/service/order.service';
import { CreateOrderDto } from '../../application/dto/create-order.dto';
import { OrderDto } from '../../application/dto/order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
    type: OrderDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Client or Product not found' })
  @ApiBody({
    type: CreateOrderDto,
    description: 'Details of the order to be created',
  })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderDto> {
    try {
      return await this.orderService.createOrder(
        createOrderDto.clientId,
        createOrderDto.productIds,
      );
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
  @ApiResponse({ status: 200, description: 'List of orders', type: [OrderDto] })
  @ApiResponse({ status: 400, description: 'Bad Request' })  async listOrders(): Promise<OrderDto[]> {
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
  @ApiResponse({ status: 200, description: 'Order details', type: OrderDto })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiParam({ name: 'id', description: 'ID of the order', example: '123e4567-e89b-12d3-a456-426614174000' })
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
