import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class OrderProcessedDto {
  @ApiPropertyOptional({ example: 'ORDER-001' })
  @IsOptional() @IsString()
  orderId?: string;
}
