
'use client';

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { products } from '@/lib/mock-data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '../ui/badge';
import { Plus, IndianRupee } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const similarProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="relative w-full h-40">
           <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="rounded-md object-cover"
            data-ai-hint="product image"
          />
        </div>
        <CardTitle className="text-lg pt-2">{product.name}</CardTitle>
        <CardDescription>{product.category}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center font-bold text-xl">
            <IndianRupee className="h-5 w-5" />
            <span>{product.price}</span>
        </div>
        <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
          <span>In Stock:</span>
          <Badge variant={product.stock > 0 ? 'default' : 'destructive'} className={product.stock > 0 ? 'bg-green-500/20 text-green-700 border-green-500/30' : ''}>{product.stock > 0 ? 'Available' : 'Out of stock'}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Compare</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Similar to {product.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {similarProducts.length > 0 ? similarProducts.map(p => (
                <div key={p.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.category}</p>
                  </div>
                   <div className="flex items-center font-bold">
                     <IndianRupee className="h-4 w-4" />
                     <span>{p.price}</span>
                   </div>
                </div>
              )) : <p>No similar products found.</p>}
            </div>
          </DialogContent>
        </Dialog>
        <Button size="sm" onClick={() => onAddToCart(product)} disabled={product.stock === 0}>
            <Plus className="mr-2 h-4 w-4" />
            Add
        </Button>
      </CardFooter>
    </Card>
  );
}
