import { IsNotEmpty, IsUUID, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FakeCheckoutDto {
  @ApiProperty({
    description: 'Client ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({
    description: 'Products IDs',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  productIds: string[];
}
