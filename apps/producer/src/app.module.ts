import { LoggerModule } from '@lib/logger';
import { SchemaRegistryModule } from '@lib/schema-registry';
import { Module } from '@nestjs/common';
import { ProducerModule } from './producer.module';

@Module({
  imports: [LoggerModule.forRoot(), SchemaRegistryModule, ProducerModule],
})
export class AppModule {}
