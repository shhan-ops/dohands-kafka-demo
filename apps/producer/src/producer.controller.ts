import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderCreatedDto } from './dto/order-created.dto';
import { OrderProcessedDto } from './dto/order-processed.dto';
import { ShippingRequestedDto } from './dto/shipping-requested.dto';
import { ProducerService } from './producer.service';

@ApiTags('producer')
@Controller('produce')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post('order-created')
  @ApiOperation({ summary: `order.created 토픽에 메시지 발행` })
  async emitOrderCreated(@Body(ValidationPipe) dto: OrderCreatedDto) {
    return await this.producerService.emitOrderCreated(dto);
  }

  @Post('order-processed')
  @ApiOperation({ summary: `order.processed 토픽에 메시지 발행` })
  async emitOrderProcessed(@Body(ValidationPipe) dto: OrderProcessedDto) {
    return await this.producerService.emitOrderProcessed(dto);
  }

  @Post('shipping-requested')
  @ApiOperation({ summary: `shipping.requested 토픽에 메시지 발행` })
  async emitShippingRequested(@Body(ValidationPipe) dto: ShippingRequestedDto) {
    return await this.producerService.emitShippingRequested(dto);
  }
}
