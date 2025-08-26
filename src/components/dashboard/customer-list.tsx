
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { orders, products } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { IndianRupee } from 'lucide-react';


export function CustomerList() {

  const getOrderTotal = (orderItems: { productName: string; quantity: number }[]) => {
    return orderItems.reduce((total, item) => {
        const product = products.find(p => p.name === item.productName);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
        <CardDescription>
          A list of all customer orders and their details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Customer ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Total Bill</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell className="text-muted-foreground">{order.customerId}</TableCell>
                 <TableCell>
                    <Badge
                        variant={
                        order.status === 'Delivered'
                            ? 'default'
                            : order.status === 'Shipped'
                            ? 'secondary'
                            : 'outline'
                        }
                        className={cn(
                        order.status === 'Delivered' && 'bg-green-500/20 text-green-700 border-green-500/30',
                        order.status === 'Shipped' && 'bg-blue-500/20 text-blue-700 border-blue-500/30',
                        order.status === 'Packed' && 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
                        order.status === 'Processing' && 'bg-gray-500/20 text-gray-700 border-gray-500/30',
                        )}
                    >
                        {order.status}
                    </Badge>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell className="text-right flex items-center justify-end">
                    <IndianRupee className="h-4 w-4" />
                    {getOrderTotal(order.items).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
