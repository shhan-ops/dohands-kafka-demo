import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class OrderCreatedDto {
  @ApiPropertyOptional({ example: 'ORDER-001' })
  @IsOptional() @IsString()
  orderId?: string;

  @ApiPropertyOptional({ example: '서울시 강남구 테헤란로 123' })
  @IsOptional() @IsString()
  shippingAddress?: string;

  @ApiPropertyOptional({ example: '홍길동' })
  @IsOptional() @IsString()
  customerName?: string;

  @ApiPropertyOptional({ example: '핸드폰 케이스' })
  @IsOptional() @IsString()
  productName?: string;

  @ApiPropertyOptional({ example: 15000 })
  @IsOptional() @IsNumber() @IsPositive()
  price?: number;
}
