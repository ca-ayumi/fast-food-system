import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './application/interfaces/controllers/client.controller';
import { ProductController } from './application/interfaces/controllers/product.controller';
import { OrderController } from './application/interfaces/controllers/order.controller';
import { ClientService } from './domain/service/client.service';
import { ProductService } from './domain/service/product.service';
import { OrderService } from './domain/service/order.service';
import { Client } from './domain/entities/client.entity';
import { Product } from './domain/entities/product.entity';
import { Order } from './domain/entities/order.entity';
import { CheckoutController } from './application/interfaces/controllers/checkout.controller';
import { HttpModule } from '@nestjs/axios';
import { PaymentService } from './domain/service/payment.service';
import { CheckoutUseCase } from './application/use-cases/checkout-use-case';
import { MercadoPagoWebhookController } from './application/interfaces/controllers/mercadopago-webhook.controller';

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
    HttpModule,
  ],
  controllers: [
    ClientController,
    ProductController,
    CheckoutController,
    OrderController,
    MercadoPagoWebhookController,
  ],
  providers: [
    ClientService,
    ProductService,
    OrderService,
    CheckoutUseCase,
    PaymentService,
  ],
})
export class AppModule {}
