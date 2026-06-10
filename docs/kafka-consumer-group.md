# Kafka Consumer Group 정리

## 질문

`producer`가 메시지를 발행하면 왜 `consumer-a`, `consumer-b` 둘 다 컨슘하느냐는 질문이었다.

## 답변

현재는 두 consumer가 같은 토픽을 보고 있으면서도 서로 다른 `groupId`를 쓰고 있어서, Kafka가 같은 메시지를 그룹별로 각각 전달한다. 즉, `consumer-a`와 `consumer-b`는 서로 독립된 구독자 집합이기 때문에 producer가 한 번 발행한 이벤트를 둘 다 받는 것이 정상 동작이다.

## 같은 그룹으로 바꾸면 어떻게 되나

두 consumer의 `groupId`를 같은 값으로 맞추면 Kafka는 그 둘을 하나의 consumer group으로 취급한다. 이 경우 메시지는 그룹 내부에서 분산 처리되므로, 같은 메시지가 `consumer-a`와 `consumer-b` 양쪽에 모두 전달되지 않는다. 대신 파티션 배치에 따라 한쪽이 처리하고 다른 쪽은 대기하게 된다.

## 현재 수정 내용

이 레포에서는 `consumer-a`와 `consumer-b`의 `groupId`를 둘 다 `dohands-group-shared`로 맞췄다.

수정 파일:
- [`libs/kafka-config/src/kafka.config.ts`](/Users/shhan/Downloads/dohands-kafka-demo/libs/kafka-config/src/kafka.config.ts)

## 핵심 정리

- 서로 다른 `groupId` = 각 그룹이 같은 메시지를 각각 받음
- 같은 `groupId` = 같은 그룹 안에서 메시지가 분산 처리됨
- 따라서 "두 앱이 모두 같은 메시지를 받아야 한다"면 다른 그룹을 써야 한다
- "두 앱이 일을 나눠서 처리해야 한다"면 같은 그룹을 써야 한다
