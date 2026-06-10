import { check, sleep } from 'k6';
import { buildOrderId, commonChecks, postJson } from './common.js';

export const options = {
  vus: Number(__ENV.VUS || 10),
  duration: __ENV.DURATION || '30s',
};

export default function () {
  const payload = {
    orderId: buildOrderId(),
  };

  const res = postJson('/produce/order-processed', payload);

  check(res, commonChecks());
  sleep(1);
}
