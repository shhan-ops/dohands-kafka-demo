import 'dotenv/config';
import { Deserializer, KafkaOptions, Transport } from '@nestjs/microservices';

export const KAFKA_BROKER = process.env.KAFKA_BROKER ?? 'localhost:9092';

// 같은 groupId를 가진 consumer 인스턴스들의 집합
// 같은 그룹 안에서는 파티션이 분산되어 메시지가 한 번만 처리됨
// 같은 토픽을 다른 그룹이 구독하면 그룹마다 별도로 수신됨
export const CONSUMER_GROUPS = {
  A: 'dohands-group-shared',
  B: 'dohands-group-shared',
} as const;

// ClientsModule.register()에 사용 — Producer 클라이언트 설정
export function getKafkaClientOptions(clientId: string): KafkaOptions {
  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId,
        brokers: [KAFKA_BROKER],
        retry: {
          retries: 5,
          initialRetryTime: 300,
        },
      },
    },
  };
}

// connectMicroservice()에 사용 — Consumer 설정
export function getKafkaMicroserviceOptions(
  groupId: string,
  deserializer?: Deserializer,
): KafkaOptions {
  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: `${groupId}-client`,
        brokers: [KAFKA_BROKER],
        retry: {
          retries: 5,
          initialRetryTime: 300,
        },
      },
      consumer: {
        groupId,
      },
      deserializer,
    },
  };
}
