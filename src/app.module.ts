import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './infrastructure/controllers/client.controller';
import { ProductController } from './infrastructure/controllers/product.controller';
import { OrderController } from './infrastructure/controllers/order.controller';
import { ClientService } from './domain/service/client.service';
import { ProductService } from './domain/service/product.service';
import { OrderService } from './domain/service/order.service';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { Client } from './domain/models/client.entity';
import { Product } from './domain/models/product.entity';
import { Order } from './domain/models/order.entity';
import { CheckoutService } from './domain/service/checkout.service';
import { CheckoutController } from './infrastructure/controllers/checkout.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Client, Product, Order],
        synchronize: false,
        migrations: ['dist/migration/*.js'],
        cli: {
          migrationsDir: 'src/migration',
        },
      }),
    }),
    TypeOrmModule.forFeature([Client, Product, Order]),
  ],
  controllers: [
    ClientController,
    ProductController,
    CheckoutController,
    OrderController,
  ],
  providers: [
    ClientService,
    ProductService,
    OrderService,
    CreateOrderUseCase,
    CheckoutService,
  ],
})
export class AppModule {}
