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
  Patch,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { OrderService } from '../../../domain/service/order.service';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { OrderDto } from '../../dto/order.dto';
import { Order } from '../../../domain/entities/order.entity';
import { PaymentService } from '../../../domain/service/payment.service';
import { UpdateOrderStatusDto } from '../../dto/update-order-status.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
  ) {}

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
      const order: Order = await this.orderService.createOrder(
        createOrderDto.clientId,
        createOrderDto.productIds,
        createOrderDto.totalAmount,
      );

      return new OrderDto(order);
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

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update the status of an order' })
  @ApiResponse({
    status: 200,
    description: 'The status of the order has been updated successfully.',
    type: OrderDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiParam({ name: 'id', description: 'ID of the order' })
  @ApiBody({
    type: UpdateOrderStatusDto,
    description: 'New status for the order',
  })
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderDto> {
    this.logger.debug(
      `Received request to update order ID: ${orderId} with status: ${updateOrderStatusDto.status}`,
    );

    try {
      const updatedOrder = await this.orderService.updateOrderStatus(
        orderId,
        updateOrderStatusDto.status,
      );
      this.logger.debug(`Order updated: ${JSON.stringify(updatedOrder)}`);
      return new OrderDto(updatedOrder);
    } catch (error) {
      this.logger.error(
        `Error updating order ID: ${orderId} - ${error.message}`,
      );
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'List all orders' })
  @ApiResponse({ status: 200, description: 'List of orders', type: [OrderDto] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
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
  @ApiResponse({ status: 200, description: 'Order details', type: OrderDto })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiParam({
    name: 'id',
    description: 'ID of the order',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
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

  @Get('status/:orderId')
  @ApiOperation({
    summary: 'Check payment status of an order',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the payment status of the order',
    schema: {
      example: {
        orderId: '123e4567-e89b-12d3-a456-426614174000',
        status: 'Recebido',
        paymentStatus: 'Aprovado',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiParam({
    name: 'orderId',
    description: 'ID of the order to check payment status',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async checkOrderPaymentStatus(
    @Param('orderId') orderId: string,
  ): Promise<any> {
    this.logger.debug(`Checking payment status for order ID: ${orderId}`);

    try {
      const order = await this.orderService.getOrderById(orderId);

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      const paymentStatus =
        await this.paymentService.checkPaymentStatus(orderId);

      const translatedPaymentStatus =
        paymentStatus.status === 'paid' ? 'Aprovado' : 'Pendente';

      return {
        orderId,
        status: order.status,
        paymentStatus: translatedPaymentStatus,
      };
    } catch (error) {
      this.logger.error(
        `Error checking payment status for order ID: ${orderId} - ${error.message}`,
      );
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
