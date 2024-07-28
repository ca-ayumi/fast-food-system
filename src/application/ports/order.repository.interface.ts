import { Order } from 'src/domain/models/order.entity';

export const ORDER_REPOSITORY = 'OrderRepository';

export interface OrderRepository {
  save(order: Order): Promise<Order>;
  findOne(id: number): Promise<Order>;
}
