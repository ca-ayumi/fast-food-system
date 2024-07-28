import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../../application/dto/create-product.dto';
import { UpdateProductDto } from '../../application/dto/update-product.dto';
import { Product } from '../models/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async updateProduct(updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productRepository.update(updateProductDto.id, updateProductDto);
    return await this.productRepository.findOne({
      where: { id: updateProductDto.id },
    });
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  async findProductByCategory(category: string): Promise<Product[]> {
    return await this.productRepository.find({ where: { category } });
  }

  async findProductById(id: number): Promise<Product> {
    return await this.productRepository.findOne({ where: { id } });
  }
}
