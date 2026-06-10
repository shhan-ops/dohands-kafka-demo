import { KAFKA_TOPICS } from '@lib/kafka-config';
import { ILoggerService, LOGGER_SERVICE } from '@lib/logger';
import { ISchemaRegistryService, SCHEMA_REGISTRY_SERVICE } from '@lib/schema-registry';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { OrderCreatedDto } from './dto/order-created.dto';
import { OrderProcessedDto } from './dto/order-processed.dto';
import { ShippingRequestedDto } from './dto/shipping-requested.dto';

export const PRODUCER_KAFKA_CLIENT = 'PRODUCER_KAFKA_CLIENT';

@Injectable()
export class ProducerService implements OnModuleInit {
  constructor(
    @Inject(PRODUCER_KAFKA_CLIENT) private readonly kafkaClient: ClientKafka,
    @Inject(LOGGER_SERVICE) private readonly logger: ILoggerService,
    @Inject(SCHEMA_REGISTRY_SERVICE) private readonly schemaRegistry: ISchemaRegistryService,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.logger.info('Kafka Producer 연결 완료');
  }

  async emitOrderCreated(dto: OrderCreatedDto) {
    const payload = { ...dto, createdAt: new Date().toISOString() };
    // schema registry를 통해 Avro 직렬화. payload 검증 (인터페이스 확인 및 스키마 검증)
    const encoded = await this.schemaRegistry.encode(KAFKA_TOPICS.ORDER_CREATED, payload);

    this.kafkaClient.emit(KAFKA_TOPICS.ORDER_CREATED, {
      key: payload.orderId,
      value: encoded,
    });

    this.logger.info(`emit → ${KAFKA_TOPICS.ORDER_CREATED}`, { orderId: payload.orderId });
    return payload;
  }

  async emitOrderProcessed(dto: OrderProcessedDto) {
    const payload = { ...dto, processedAt: new Date().toISOString() };
    // schema registry를 통해 Avro 직렬화. payload 검증 (인터페이스 확인 및 스키마 검증)
    const encoded = await this.schemaRegistry.encode(KAFKA_TOPICS.ORDER_PROCESSED, payload);

    this.kafkaClient.emit(KAFKA_TOPICS.ORDER_PROCESSED, {
      key: dto.orderId,
      value: encoded,
    });

    this.logger.info(`emit → ${KAFKA_TOPICS.ORDER_PROCESSED}`, { orderId: dto.orderId });
    return payload;
  }

  async emitShippingRequested(dto: ShippingRequestedDto) {
    const payload = { ...dto, requestedAt: new Date().toISOString() };
    // schema registry를 통해 Avro 직렬화. payload 검증 (인터페이스 확인 및 스키마 검증)
    const encoded = await this.schemaRegistry.encode(KAFKA_TOPICS.SHIPPING_REQUESTED, payload);

    this.kafkaClient.emit(KAFKA_TOPICS.SHIPPING_REQUESTED, {
      key: dto.orderId,
      value: encoded,
    });

    this.logger.info(`emit → ${KAFKA_TOPICS.SHIPPING_REQUESTED}`, { orderId: dto.orderId });
    return payload;
  }
}
