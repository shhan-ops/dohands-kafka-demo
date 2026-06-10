export const KAFKA_TOPICS = {
  /** 주문 생성 이벤트 토픽 */
  ORDER_CREATED: 'order.created',

  /** 발주 처리됨 이벤트 토픽 */
  ORDER_PROCESSED: 'order.processed',

  /** 배송 중 요청됨 이벤트 토픽 */
  SHIPPING_REQUESTED: 'shipping.requested',
} as const;

export type KafkaTopic = (typeof KAFKA_TOPICS)[keyof typeof KAFKA_TOPICS];
