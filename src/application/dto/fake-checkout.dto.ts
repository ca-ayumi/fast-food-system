import { IsNotEmpty, IsUUID, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FakeCheckoutDto {
  @ApiProperty({ description: 'Client ID' })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ description: 'Products IDs' })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  productIds: string[];
}
