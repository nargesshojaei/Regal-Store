export type OrderStatus = "pending" | "delivered";
{/*شکل داده سفارش از سرور: مشتری، آدرس، لیست کالا با عکس، مبلغ، delivered. توابع کمکی: نام کامل مشتری، تعداد، قیمت هر قلم، آیا تحویل شده. */}
export type OrderProduct = {
  id: number;
  name: string;
  count: string | number;
  price: string | number;
  image?: string;
};

export type Order = {
  id: number;
  username: string;
  lastname: string;
  address: string;
  phone: string;
  expectAt: number;
  products: OrderProduct[];
  prices: number;
  delivered: boolean | string;
  createdAt: number;
};

export type OrderItem = OrderProduct;

export function isOrderDelivered(delivered: Order["delivered"]) {
  return delivered === true || delivered === "true";
}

export function orderCustomerName(order: Order) {
  return `${order.username} ${order.lastname}`.trim();
}

export function orderProductCount(product: OrderProduct) {
  return Number(product.count) || 0;
}

export function orderProductPrice(product: OrderProduct) {
  return Number(product.price) || 0;
}
