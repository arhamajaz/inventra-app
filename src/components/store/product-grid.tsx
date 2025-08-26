
'use client';

import { products } from '@/lib/mock-data';
import { ProductCard } from './product-card';
import { useCart } from './shopping-cart-provider';

export function ProductGrid() {
  const { addToCart } = useCart();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
      ))}
    </div>
  );
}
