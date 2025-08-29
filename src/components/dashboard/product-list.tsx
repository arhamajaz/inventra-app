
'use client';

import * as React from 'react';
import Image from 'next/image';
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
import { IndianRupee } from 'lucide-react';

export function ProductList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Products</CardTitle>
        <CardDescription>
          A list of all products in the inventory.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Threshold</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
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
                    <div className="font-medium">{product.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category}</Badge>
                </TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.threshold}</TableCell>
                <TableCell className="text-right flex items-center justify-end">
                    <IndianRupee className="h-4 w-4" />
                    {product.price.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
