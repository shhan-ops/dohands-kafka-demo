import 'dotenv/config';
import { Deserializer } from '@nestjs/microservices';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';

const SCHEMA_REGISTRY_URL = process.env.SCHEMA_REGISTRY_URL ?? 'http://localhost:8081';

// Consumer 트랜스포트 설정에 사용하는 Avro 역직렬화기
// Kafka 메시지의 value(Buffer)를 Schema Registry를 통해 Avro 디코딩
export class AvroKafkaDeserializer implements Deserializer {
  private readonly registry = new SchemaRegistry({ host: SCHEMA_REGISTRY_URL });

  async deserialize(value: any) {
    // NestJS ServerKafka는 { key, value, headers, topic, partition } 형태로 넘김
    const decoded = await this.registry.decode(value.value);
    return { pattern: value.topic, data: decoded as Record<string, unknown> };
  }
}
