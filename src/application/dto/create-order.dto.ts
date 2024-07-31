import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsArray, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ description: 'Client ID' })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ description: 'Product IDs' })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  productIds: string[];
}
