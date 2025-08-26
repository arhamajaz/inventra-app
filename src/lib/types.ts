
export interface Sale {
  date: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'FMCG' | 'Electronics' | 'Personal Care' | 'Household' | 'Grocery' | 'Dairy' | 'Fashion' | 'Warehouse' | 'Stationery';
  stock: number;
  capacity: number;
  threshold: number;
  price: number;
  imageUrl: string;
  historicalSalesData: Sale[];
  description?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerId?: string;
  items: { productName: string; quantity: number }[];
  status: 'Processing' | 'Packed' | 'Shipped' | 'Delivered';
  date: string;
}

export type UserRole = 'Admin' | 'Consumer';

export interface User {
    role: UserRole;
    name: string;
    email: string;
    customerId?: string;
}
