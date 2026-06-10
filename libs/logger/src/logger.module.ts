import { DynamicModule, Module } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { LOGGER_SERVICE } from './services/symbols/logger.service.symbol';

@Module({})
export class LoggerModule {
  static forRoot(): DynamicModule {
    return {
      module: LoggerModule,
      global: true,
      providers: [
        {
          provide: LOGGER_SERVICE,
          useClass: LoggerService,
        },
      ],
      exports: [LOGGER_SERVICE],
    };
  }
}
