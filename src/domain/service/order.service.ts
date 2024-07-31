import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../models/order.entity';
import { Client } from '../models/client.entity';
import { Product } from '../models/product.entity';
import { OrderDto } from '../../application/dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createOrder(clientId: string, productIds: string[]): Promise<OrderDto> {
    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const products = await this.productRepository.findByIds(productIds);
    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    const order = new Order();
    order.client = client;
    order.product = products;
    order.status = OrderStatus.RECEIVED;

    try {
      const savedOrder = await this.orderRepository.save(order);
      return new OrderDto(savedOrder);
    } catch (error) {
      throw new BadRequestException('Failed to create order');
    }
  }

  async listOrders(): Promise<OrderDto[]> {
    try {
      const orders = await this.orderRepository.find({
        relations: ['client', 'product'],
      });
      return orders.map((order) => new OrderDto(order));
    } catch (error) {
      throw new BadRequestException('Failed to list orders');
    }
  }

  async getOrderById(orderId: string): Promise<OrderDto> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['client', 'product'],
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      return new OrderDto(order);
    } catch (error) {
      throw new BadRequestException('Failed to get order');
    }
  }
}
