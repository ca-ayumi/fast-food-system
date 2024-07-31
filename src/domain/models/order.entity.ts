import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Client } from './client.entity';
import { Product } from './product.entity';

export enum OrderStatus {
  RECEIVED = 'Recebido',
  PREPARING = 'Em preparação',
  READY = 'Pronto',
  COMPLETED = 'Finalizado',
}

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientid' })
  client: Client;

  @ManyToMany(() => Product, { eager: true })
  @JoinTable({
    name: 'order_products',
    joinColumn: {
      name: 'order',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product',
      referencedColumnName: 'id',
    },
  })
  product: Product[];

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.RECEIVED,
  })
  status: OrderStatus;
}
