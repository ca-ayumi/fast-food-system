import { DataSource } from 'typeorm';
import { Client } from './domain/entities/client.entity';
import { Product } from './domain/entities/product.entity';
import { Order } from './domain/entities/order.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Client, Product, Order],
  migrations: ['src/migration/*.ts'],
  synchronize: false,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
