import { DataSource } from 'typeorm';
import { Client } from './domain/models/client.entity';
import { Product } from './domain/models/product.entity';
import { Order } from './domain/models/order.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Client, Product, Order],
  migrations: ['dist/migration/*.js'],
  synchronize: false,
});