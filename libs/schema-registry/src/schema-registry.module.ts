import { Module } from '@nestjs/common';
import { SchemaRegistryService } from './schema-registry.service';
import { SCHEMA_REGISTRY_SERVICE } from './symbols/schema-registry.service.symbol';

@Module({
  providers: [
    {
      provide: SCHEMA_REGISTRY_SERVICE,
      useClass: SchemaRegistryService,
    },
  ],
  exports: [SCHEMA_REGISTRY_SERVICE],
})
export class SchemaRegistryModule {}
