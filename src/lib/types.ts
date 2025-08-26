export interface Sale {
  date: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'FMCG' | 'Pharmaceuticals' | 'Electronics' | 'Grocery' | 'Warehouse' | 'Stationery' | 'Dairy' | 'Personal Care' | 'Household';
  stock: number;
  capacity: number;
  threshold: number;
  price: number;
  imageUrl: string;
  historicalSalesData: Sale[];
}

export interface Order {
  id: string;
  customerName: string;
  items: { productName: string; quantity: number }[];
  status: 'Processing' | 'Packed' | 'Shipped' | 'Delivered';
  date: string;
}
