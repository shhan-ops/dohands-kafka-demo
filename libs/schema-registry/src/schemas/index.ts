export const OrderCreatedSchema = {
  type: 'record',
  name: 'OrderCreated',
  namespace: 'com.dohands',
  fields: [
    { name: 'orderId', type: 'string' },
    { name: 'customerName', type: 'string' },
    { name: 'shippingAddress', type: 'string' },
    { name: 'productName', type: 'string' },
    { name: 'price', type: 'double' },
    { name: 'createdAt', type: 'string' },
  ],
};

export const OrderProcessedSchema = {
  type: 'record',
  name: 'OrderProcessed',
  namespace: 'com.dohands',
  fields: [
    { name: 'orderId', type: 'string' },
    { name: 'processedAt', type: 'string' },
  ],
};

export const ShippingRequestedSchema = {
  type: 'record',
  name: 'ShippingRequested',
  namespace: 'com.dohands',
  fields: [
    { name: 'orderId', type: 'string' },
    { name: 'shippingAddress', type: 'string' },
    { name: 'logisticsCompany', type: 'string' },
    { name: 'requestedAt', type: 'string' },
  ],
};
