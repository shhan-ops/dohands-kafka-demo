import { check, sleep } from 'k6';
import { buildOrderId, commonChecks, postJson } from './common.js';

export const options = {
  vus: Number(__ENV.VUS || 10),
  duration: __ENV.DURATION || '30s',
};

export default function () {
  const payload = {
    orderId: buildOrderId(),
    customerName: '홍길동',
    shippingAddress: '서울시 강남구 테헤란로 123',
    productName: '핸드폰 케이스',
    price: 15000,
  };

  const res = postJson('/produce/order-created', payload);

  check(res, commonChecks());
  sleep(1);
}
