# dohands-kafka-demo

`@nestjs/microservices` 기반 Kafka 학습용 데모 프로젝트

---

## 실행 순서

```shell
# 1. 의존성 설치
pnpm install

# 2. Kafka 실행
pnpm docker:up

# 3. 앱 실행 (터미널 3개)
pnpm start:producer
pnpm start:consumer-a
pnpm start:consumer-b
```

---

## 테스트 방법

- `.env` 파일은 레포 루트에 두면 됩니다.
- 예시는 [`.env.example`](/Users/shhan/Downloads/dohands-kafka-demo/.env.example) 참고.
- consumer group 설명은 [docs/kafka-consumer-group.md](/Users/shhan/Downloads/dohands-kafka-demo/docs/kafka-consumer-group.md) 참고.
- **Swagger UI**: `http://localhost:3000/docs`
- **HTTP 파일**: `http/producer.http` (REST Client extension 필요)

## k6 부하 테스트

테스트 전에 아래를 먼저 실행하세요.

```shell
pnpm docker:up
pnpm start:producer
```

환경 변수로 기본값을 바꿀 수 있습니다.

```shell
PRODUCER_BASE_URL=http://localhost:3000 VUS=20 DURATION=1m pnpm k6:order-created
```

자주 쓰는 명령:

```shell
pnpm k6:order-created
pnpm k6:order-processed
pnpm k6:shipping-requested
```

k6 스크립트는 [`k6/`](/Users/shhan/Downloads/dohands-kafka-demo/k6) 아래에 있습니다.

---

## 기본 개념

### Topic
메시지가 저장되는 채널. 이 프로젝트의 토픽:
- `order.created` — 주문 생성 이벤트
- `order.processed` — 발주 처리 완료 이벤트
- `shipping.requested` — 배송 요청 이벤트

### Partition
토픽은 파티션으로 나뉨. 같은 key를 가진 메시지는 항상 같은 파티션으로 라우팅됨.
→ 같은 `orderId`의 이벤트는 순서가 보장됨.

### Consumer Group
같은 `groupId`를 가진 consumer 인스턴스의 집합. 파티션이 그룹 멤버들에게 분산됨.
groupId가 다른 두 그룹은 같은 토픽을 **독립적으로** 구독함.
→ producer가 메시지 1개를 보내면 같은 그룹 안에서는 한 consumer만 처리하고, 다른 그룹이 있으면 그 그룹도 별도로 수신함.

### Schema Registry
Kafka 메시지의 스키마(Avro)를 중앙에서 관리. 스키마에 맞지 않는 메시지는 인코딩 단계에서 차단됨.
→ producer가 `encode()` 시 필드 누락/타입 불일치면 `[Schema-Registry 에러]` 발생.

---

## Producer 패턴 (NestJS)

```typescript
// ClientsModule로 Kafka 클라이언트 등록
ClientsModule.register([{ name: 'MY_KAFKA', ...getKafkaClientOptions('my-service') }])

// 서비스에 주입 후 Avro 인코딩 → emit
const encoded = await this.schemaRegistry.encode(topic, payload);
this.client.emit(topic, { key: orderId, value: encoded });
```

## Consumer 패턴 (NestJS)

```typescript
// main.ts — 순수 Kafka 마이크로서비스로 실행
NestFactory.createMicroservice(AppModule, getKafkaMicroserviceOptions('my-group', new AvroKafkaDeserializer()))

// Controller — 토픽 구독
@EventPattern('order.created')
handle(@Payload() data: unknown) { ... }
```

---

## 이벤트 흐름

```
[HTTP Client]
     │  POST /produce/order-created
     ▼
[producer :3000]
     │  schemaRegistry.encode()  →  Avro Buffer
     │  kafkaClient.emit()
     ▼
[Kafka - order.created topic]
     │
     ├──▶ [consumer-a | dohands-group-shared]  AvroKafkaDeserializer → @EventPattern 수신
     │
     └──▶ [consumer-b | dohands-group-shared]  AvroKafkaDeserializer → @EventPattern 수신
```

---

## Kafka UI

`http://localhost:8080`

- **Topics** — 토픽별 메시지 및 파티션 확인
- **Consumer Groups** — `dohands-group-shared` 오프셋 확인
- **Topics > Actions > Purge Topic** — 쌓인 메시지 초기화

---

## 프로젝트 구조

```
dohands-kafka-demo/
├── docker-compose.yml
├── http/
│   └── producer.http               # HTTP 테스트 파일
├── apps/
│   ├── producer/                   # HTTP :3000 — Avro 인코딩 후 emit
│   │   └── src/
│   │       ├── producer.service.ts
│   │       └── producer.controller.ts
│   ├── consumer-a/                 # Kafka Consumer (dohands-group-shared)
│   │   └── src/
│   │       └── consumer.controller.ts
│   └── consumer-b/                 # Kafka Consumer (dohands-group-shared)
│       └── src/
│           └── consumer.controller.ts
└── libs/
    ├── kafka-config/               # KAFKA_TOPICS, CONSUMER_GROUPS, 설정 함수
    ├── schema-registry/            # Avro 스키마 정의, encode/decode
    └── logger/                     # LoggerModule.forRoot(), ILoggerService
```

---

## 확장

### 새 Consumer Group 추가
1. `apps/new-service` 앱 생성
2. `main.ts`에서 `NestFactory.createMicroservice(AppModule, getKafkaMicroserviceOptions('new-group', new AvroKafkaDeserializer()))` 설정
3. Controller에 `@EventPattern(KAFKA_TOPICS.*)` 핸들러 추가
4. `nest-cli.json`, `tsconfig.json` path alias 등록

### Dead Letter Queue (DLQ)
- `order.created.dlq` 토픽 추가
- Consumer에서 try-catch 후 실패 시 DLQ 토픽으로 emit
