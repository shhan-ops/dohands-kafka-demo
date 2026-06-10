import { Injectable, Logger } from '@nestjs/common';
import { ILoggerService } from './interfaces/logger.service.interface';

@Injectable()
export class LoggerService implements ILoggerService {
  private readonly logger = new Logger('App');

  info(message: string, meta?: Record<string, unknown>): void {
    this.logger.log(meta ? { message, ...meta } : message);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.logger.error(meta ? { message, ...meta } : message);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(meta ? { message, ...meta } : message);
  }
}
