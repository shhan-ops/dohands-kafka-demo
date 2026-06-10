# Kafka 파티션 분산 테스트 기록

## 테스트 목적

producer가 발행한 메시지가 consumer group 안에서 어떻게 분산되는지 확인하고, 파티션 수와 부하 수준에 따라 실제 분산 동작이 어떻게 달라지는지 검증했다.

## 테스트 환경

- producer: NestJS HTTP 서버
- consumer-a, consumer-b: Kafka consumer
- Kafka broker: 로컬 Docker
- 토픽 파티션 수: 각 토픽당 2개
- consumer group: 현재는 같은 groupId 구성으로 테스트
- 부하 도구: k6

## 테스트한 내용

### 1. 주문을 하나씩 넣는 방식

HTTP 요청을 하나씩 보내서 메시지를 발행해봤지만, 이 방식에서는 consumer 간 분산이 기대만큼 잘 보이지 않았다. 메시지 수가 적고 요청 간 간격이 있어서 Kafka가 파티션과 consumer group을 활용하는 모습이 뚜렷하게 드러나지 않았다.

### 2. k6로 연속 요청을 보내는 방식

k6를 사용해서 짧은 시간에 여러 요청을 동시에 보냈더니 메시지가 더 고르게 분산되기 시작했다. 부하가 충분히 걸리자 토픽의 2개 파티션을 기준으로 consumer 쪽에서 분산 처리되는 것이 확인됐다.

## 확인한 결과

- 각 토픽을 2개 파티션으로 나누니 분산 처리 가능성이 생겼다.
- k6로 부하를 주자 consumer 간 분산이 실제로 관찰됐다.
- 단건 요청만 보낼 때보다 연속 요청 시 분산 효과가 명확했다.

## 결론

이번 테스트에서는 각 토픽당 파티션을 2개로 설정한 뒤 k6로 부하를 주었을 때 consumer group 내 분산이 성공적으로 일어나는 것을 확인했다. 단일 요청을 순차적으로 보낼 때는 분산이 눈에 잘 띄지 않았지만, k6로 반복 부하를 주면 파티션 기반 분산이 드러났다.

## 참고

- k6 스크립트: [`k6/`](/Users/shhan/Downloads/dohands-kafka-demo/k6)
- consumer group 설명: [`docs/kafka-consumer-group.md`](/Users/shhan/Downloads/dohands-kafka-demo/docs/kafka-consumer-group.md)
