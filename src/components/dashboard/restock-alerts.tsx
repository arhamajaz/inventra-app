'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
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
import { products } from '@/lib/mock-data';
import type { Product } from '@/lib/types';

const lowStockProducts = products.filter(
  (p) => p.stock < p.threshold
);

export function RestockAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Restock Alerts</CardTitle>
        <CardDescription>
          Products running low on inventory.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowStockProducts.slice(0, 4).map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.imageUrl}
                      width={40}
                      height={40}
                      alt={product.name}
                      className="rounded-md"
                      data-ai-hint="product image"
                    />
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.category}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {product.stock} / {product.capacity}
                </TableCell>
                <TableCell>
                  <Badge variant="destructive">Low Stock</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {lowStockProducts.length > 4 && (
            <div className="mt-4 text-center">
                <Button variant="outline" size="sm">View All Alerts</Button>
            </div>
        )}
        {lowStockProducts.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No low stock alerts. 🎉</p>
        )}
      </CardContent>
    </Card>
  );
}
