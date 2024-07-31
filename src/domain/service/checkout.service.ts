import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../models/client.entity';
import { Product } from '../models/product.entity';
import { FakeCheckoutDto } from 'src/application/dto/fake-checkout.dto';

const fakeQueue: Array<{ clientId: string; productIds: string[] }> = [];

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async fakeCheckout(fakeCheckoutDto: FakeCheckoutDto): Promise<string> {
    const { clientId, productIds } = fakeCheckoutDto;

    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const products = await this.productRepository.findByIds(productIds);
    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    fakeQueue.push({ clientId, productIds });

    return `Products successfully enqueued for client ${clientId}`;
  }

  getFakeQueue() {
    return fakeQueue;
  }
}
