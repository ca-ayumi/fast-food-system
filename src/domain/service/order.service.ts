import { Injectable } from '@nestjs/common';
import { Product } from '../models/product.entity';
import { Client } from '../models/client.entity';
import { Order } from '../models/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';



@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async createOrder(client: Client, products: Product[]): Promise<Order> {
    const order = new Order();
    order.client = client;
    order.products = products;
    order.status = 'PENDING'; // Status inicial do pedido

    return await this.orderRepository.save(order);
  }

  async getOrderById(id: number): Promise<Order> {
    return await this.orderRepository.findOne({ where: { id } });
  }
}