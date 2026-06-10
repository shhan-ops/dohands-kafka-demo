import { check, sleep } from 'k6';
import { buildOrderId, commonChecks, postJson } from './common.js';

export const options = {
  vus: Number(__ENV.VUS || 10),
  duration: __ENV.DURATION || '30s',
};

export default function () {
  const payload = {
    orderId: buildOrderId(),
    shippingAddress: '서울시 강남구 테헤란로 123',
    logisticsCompany: 'HANJIN',
  };

  const res = postJson('/produce/shipping-requested', payload);

  check(res, commonChecks());
  sleep(1);
}
