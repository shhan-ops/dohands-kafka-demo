import 'dotenv/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ISchemaRegistryService } from './interfaces/schema-registry.service.interface';
import { SchemaRegistry, SchemaType } from '@kafkajs/confluent-schema-registry';
import { KAFKA_TOPICS } from '@lib/kafka-config';
import {
  OrderCreatedSchema,
  OrderProcessedSchema,
  ShippingRequestedSchema,
} from './schemas';

const SCHEMA_REGISTRY_URL = process.env.SCHEMA_REGISTRY_URL ?? 'http://localhost:8081';

// 앱 시작 시 Schema Registry에 스키마를 등록하고 schemaId를 캐싱
// 이후 encode()로 Avro 직렬화된 Buffer를 반환
@Injectable()
export class SchemaRegistryService implements OnModuleInit, ISchemaRegistryService {
  private readonly registry = new SchemaRegistry({ host: SCHEMA_REGISTRY_URL });

  // topic → schemaId 매핑
  private readonly schemaIds = new Map<string, number>();

  async onModuleInit() {
    const entries = [
      { topic: KAFKA_TOPICS.ORDER_CREATED, schema: OrderCreatedSchema },
      { topic: KAFKA_TOPICS.ORDER_PROCESSED, schema: OrderProcessedSchema },
      { topic: KAFKA_TOPICS.SHIPPING_REQUESTED, schema: ShippingRequestedSchema },
    ];

    for (const { topic, schema } of entries) {
      const { id } = await this.registry.register(
        { type: SchemaType.AVRO, schema: JSON.stringify(schema) },
        { subject: `${topic}-value` },
      );
      this.schemaIds.set(topic, id);
    }
  }

  async encode(topic: string, payload: unknown): Promise<Buffer> {
    const id = this.schemaIds.get(topic);
    if (!id) throw new Error(`[Schema-Registry 에러] - Schema not registered for topic: ${topic}`);
    try {
      return await this.registry.encode(id, payload);
    } catch (err) {
      const field = err instanceof Error ? err.message : String(err);
      throw new Error(`[Schema-Registry 에러] - ${field}`);
    }
  }
}
