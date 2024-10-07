import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID of the client',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({
    description: 'IDs of the products',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
  })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  productIds: string[];

  @ApiProperty({
    description: 'Total amount for the order',
    example: 100.5,
  })
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;
}
