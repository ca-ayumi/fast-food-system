import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateProductDto } from '../../application/dto/create-product.dto';
import { UpdateProductDto } from '../../application/dto/update-product.dto';
import { ProductService } from '../../domain/service/product.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return await this.productService.createProduct(createProductDto);
  }

  @Put()
  @ApiOperation({ summary: 'Update product by ID' })
  async updateProduct(@Body() updateProductDto: UpdateProductDto) {
    return await this.productService.updateProduct(updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product by ID' })
  async deleteProduct(@Param('id') id: number) {
    return await this.productService.deleteProduct(id);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get product by category' })
  async getProductsByCategory(@Param('category') category: string) {
    return await this.productService.findProductByCategory(category);
  }
}
