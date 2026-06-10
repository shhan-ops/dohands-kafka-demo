# Consumer Group Rebalance 기록

## 현상

Kafka는 분산 시스템이기 때문에 하나가 죽어도 다른 하나가 처리한다는 원리를 기본적으로 가지고있다. 
그래서 하나를 죽였다 살려보았다. 그런데 여기서 컨슈밍이 잠시 멈춰버리는 현상이 발생했고, consumer 로그에 다음과 같은 메시지가 반복적으로 나타났다.

```text
The group is rebalancing, so a rejoin is needed
The group is rebalancing, re-joining
```

이때 메시지 처리 흐름이 잠깐 멈춘 것처럼 보였다.

## 원인

이 현상은 Kafka broker 자체의 문제가 아니라, **consumer group 멤버 변동** 때문에 발생한다.

예를 들면:

- `consumer-a` 또는 `consumer-b`가 재시작됨
- 한 consumer 노드가 죽었다가 다시 살아남
- 같은 `groupId`에 속한 멤버 구성이 바뀜

이런 변화가 생기면 Kafka는 파티션 소유권을 다시 나누기 위해 rebalance를 수행한다.

## 의미

Rebalance가 진행되는 동안에는:

- 기존 partition 할당이 잠시 철회될 수 있고
- 새 partition 배분이 끝날 때까지 메시지 처리 속도가 잠깐 멈춘 것처럼 보일 수 있다

즉, 이 메시지는 대체로 치명적 장애가 아니라 **그룹 구성 변화에 따른 재조정 과정**이다.

## 현재 테스트 맥락

현재 레포에서는 consumer-a와 consumer-b가 같은 consumer group으로 묶여 있는 테스트가 포함되어 있었다. 이 상태에서 노드 하나가 죽었다가 살아나면 group membership이 바뀌고, 그 결과 rebalance가 발생했다.

## 정리

- 이 현상은 consumer group 멤버 변동 때문에 생긴다
- broker 개수의 홀짝 문제와는 다른 개념이다
- 같은 groupId를 사용하는 consumer가 재시작되면 rebalance 로그가 뜰 수 있다
- 처리 지연이 짧게 보이는 것도 이 재조정 과정의 자연스러운 결과다
