import { LoggerModule } from '@lib/logger';
import { Module } from '@nestjs/common';
import { ConsumerModule } from './consumer.module';

@Module({
  imports: [LoggerModule.forRoot(), ConsumerModule],
})
export class AppModule {}
