import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ShippingRequestedDto {
  @ApiPropertyOptional({ example: 'ORDER-UUID-HERE' })
  @IsOptional() @IsString()
  orderId?: string;

  @ApiPropertyOptional({ example: '서울시 강남구 테헤란로 123' })
  @IsOptional() @IsString()
  shippingAddress?: string;

  @ApiPropertyOptional({ example: 'HANJIN' })
  @IsOptional() @IsString()
  logisticsCompany?: string;
}
