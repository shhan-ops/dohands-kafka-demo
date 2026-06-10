export interface ISchemaRegistryService {
  encode(topic: string, payload: unknown): Promise<Buffer>;
}
