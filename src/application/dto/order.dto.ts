import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsArray, IsNotEmpty, IsEnum } from 'class-validator';
import { Product } from '../../domain/models/product.entity';
import { Client } from '../../domain/models/client.entity';
import { Order, OrderStatus } from 'src/domain/models/order.entity';

export class OrderDto {
  @ApiProperty({ description: 'Order ID' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Client ID' })
  @IsUUID()
  clientId: string;

  @ApiProperty({ description: 'Products in order' })
  @IsArray()
  @IsNotEmpty()
  product: Product[];

  @ApiProperty({ description: 'Status of the order' })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  constructor(order: Order) {
    this.id = order.id;
    this.clientId = order.client.id;
    this.product = order.product;
    this.status = order.status;
  }
}
