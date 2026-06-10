import http from 'k6/http';

const DEFAULT_BASE_URL = 'http://localhost:3000';

export function getBaseUrl() {
  return __ENV.PRODUCER_BASE_URL || DEFAULT_BASE_URL;
}

export function buildOrderId() {
  return generateUuidV4();
}

function generateUuidV4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const rand = Math.floor(Math.random() * 16);
    const value = char === 'x' ? rand : (rand & 0x3) | 0x8;
    return value.toString(16);
  });
}

export function postJson(path, payload) {
  return http.post(`${getBaseUrl()}${path}`, JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function commonChecks() {
  return {
    'status is 200': (r) => r.status === 200,
    'response body exists': (r) => r.body && r.body.length > 0,
  };
}
