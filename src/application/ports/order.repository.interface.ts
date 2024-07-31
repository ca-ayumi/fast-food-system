import { Order } from '../../domain/models/order.entity';

export interface OrderRepository {
  save(order: Order): Promise<Order>;
  findOne(id: string): Promise<Order>;
}
