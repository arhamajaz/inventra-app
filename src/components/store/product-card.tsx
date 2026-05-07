
'use client';

import { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { ImageIcon, IndianRupee, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Card className="flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 overflow-hidden">
      <div className="relative w-full h-48 bg-muted flex items-center justify-center">
        {/* Fallback state: shown behind the image, or visible if image fails/is hidden */}
        <div className="absolute flex flex-col items-center text-muted-foreground opacity-50">
          <ImageIcon className="h-10 w-10 mb-2" />
          <span className="text-xs font-medium uppercase tracking-wider">No Image</span>
        </div>
        
        {!imgError && (
          <Image
            src={product.imageUrl || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover z-10"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgError(true)}
            unoptimized={product.imageUrl.startsWith('http')} // helps with external placeholder services
          />
        )}
      </div>
      
      <CardHeader className="pt-4">
        <CardTitle className="text-lg line-clamp-1" title={product.name}>{product.name}</CardTitle>
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
      
      <CardFooter className="flex justify-end">
        <Button size="sm" onClick={() => onAddToCart(product)} disabled={product.stock === 0}>
            <Plus className="mr-2 h-4 w-4" />
            Add
        </Button>
      </CardFooter>
    </Card>
  );
}
