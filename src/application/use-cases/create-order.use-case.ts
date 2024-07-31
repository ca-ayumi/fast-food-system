import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientService } from '../../domain/service/client.service';
import { ProductService } from '../../domain/service/product.service';
import { OrderService } from '../../domain/service/order.service';
import { OrderDto } from '../dto/order.dto';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly clientService: ClientService,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
  ) {}

  async execute(createOrderDto: CreateOrderDto): Promise<OrderDto> {
    const { clientId, productIds } = createOrderDto;

    const client = await this.clientService.findClientByCpf(clientId);
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const products = [];
    for (const id of productIds) {
      const product = await this.productService.findProductById(id);
      if (!product) {
        throw new NotFoundException(`Product not found: ${id}`);
      }
      products.push(product);
    }

    return await this.orderService.createOrder(clientId, productIds);
  }
}
