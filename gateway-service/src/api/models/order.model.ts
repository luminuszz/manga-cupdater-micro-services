export type Order = {
  props: {
    id: string;
    recipient_id: string;
    traking_code: string;
    date: Date;
    name?: string;
    status: string;
    isDeliveried: boolean;
  };
};

type OrderModel = {
  id: string;
  name?: string;
  isDeliveried: boolean;
  date: string;
  status: string;
};

export const parseOrder = ({ props }: Order): OrderModel => ({
  name: props.name,
  date: props.date.toISOString(),
  isDeliveried: props.isDeliveried,
  id: props.id,
  status: props.status,
});
