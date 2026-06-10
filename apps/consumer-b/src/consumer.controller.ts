import { ILoggerService, LOGGER_SERVICE } from '@lib/logger';
import { KAFKA_TOPICS } from '@lib/kafka-config';
import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class ConsumerController {
  constructor(
    @Inject(LOGGER_SERVICE) private readonly logger: ILoggerService,
  ) {}

  @EventPattern(KAFKA_TOPICS.ORDER_CREATED)
  handleOrderCreated(@Payload() payload: unknown) {
    this.logger.info(`[group-b] 수신 ← ${KAFKA_TOPICS.ORDER_CREATED}`, { payload });
  }

  @EventPattern(KAFKA_TOPICS.ORDER_PROCESSED)
  handleOrderProcessed(@Payload() payload: unknown) {
    this.logger.info(`[group-b] 수신 ← ${KAFKA_TOPICS.ORDER_PROCESSED}`, { payload });
  }

  @EventPattern(KAFKA_TOPICS.SHIPPING_REQUESTED)
  handleShippingRequested(@Payload() payload: unknown) {
    this.logger.info(`[group-b] 수신 ← ${KAFKA_TOPICS.SHIPPING_REQUESTED}`, { payload });
  }
}
