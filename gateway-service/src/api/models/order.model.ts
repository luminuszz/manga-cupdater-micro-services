export type Order = {
  id: string;
  recipient_id: string;
  traking_code: string;
  date: Date;
  name?: string;
  status: string;
  isDeliveried: boolean;
};

type OrderModel = {
  id: string;
  name?: string;
  isDeliveried: boolean;
  date: string;
  status: string;
};

export const parseOrder = (order: Order): OrderModel => ({
  name: order.name,
  date: order.date.toISOString(),
  isDeliveried: order.isDeliveried,
  id: order.id,
  status: order.status,
});
