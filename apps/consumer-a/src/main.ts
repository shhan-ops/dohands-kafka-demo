import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { CONSUMER_GROUPS, getKafkaMicroserviceOptions } from '@lib/kafka-config';
import { AvroKafkaDeserializer } from '@lib/schema-registry';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    getKafkaMicroserviceOptions(CONSUMER_GROUPS.A, new AvroKafkaDeserializer()),
  );

  await app.listen();
  console.log(`Consumer A started | group: ${CONSUMER_GROUPS.A}`);
}

bootstrap();
