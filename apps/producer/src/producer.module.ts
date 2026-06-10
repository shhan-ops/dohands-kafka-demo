import { getKafkaClientOptions } from '@lib/kafka-config';
import { SchemaRegistryModule } from '@lib/schema-registry';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ProducerController } from './producer.controller';
import { PRODUCER_KAFKA_CLIENT, ProducerService } from './producer.service';

@Module({
  imports: [
    SchemaRegistryModule,
    ClientsModule.register([
      {
        name: PRODUCER_KAFKA_CLIENT,
        ...getKafkaClientOptions('producer-app'),
      },
    ]),
  ],
  controllers: [ProducerController],
  providers: [ProducerService],
})
export class ProducerModule {}
