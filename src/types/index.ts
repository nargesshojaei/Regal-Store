export type Category = {
  id: string;
  name: string;
  href: string;
  image: string;
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  href: string;
};
 
export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar: string;
};

export type { Product, ProductColor } from "./product";
export type { Order, OrderItem, OrderStatus } from "./order";
export type { AdminUser, AdminSession } from "./admin";
