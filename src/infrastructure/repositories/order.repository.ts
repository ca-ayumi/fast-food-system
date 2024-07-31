import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../domain/models/order.entity';
import { OrderRepository } from '../../application/ports/order.repository.interface';

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async save(order: Order): Promise<Order> {
    return await this.orderRepository.save(order);
  }

  async findOne(id: string): Promise<Order> {
    return await this.orderRepository.findOne({ where: { id } });
  }
}
