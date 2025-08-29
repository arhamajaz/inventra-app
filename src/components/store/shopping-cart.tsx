
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCart } from './shopping-cart-provider';
import { Button } from '../ui/button';
import { IndianRupee, Minus, Plus, ShoppingCart as ShoppingCartIcon, Trash2 } from 'lucide-react';
import { Separator } from '../ui/separator';
import Image from 'next/image';

export function ShoppingCart() {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <ShoppingCartIcon />
            <span>My Bill</span>
        </CardTitle>
        <CardDescription>Items you have added to your personal inventory.</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[50vh] overflow-y-auto">
        {cart.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.product.id} className="flex items-center gap-4">
                <Image src={item.product.imageUrl} width={48} height={48} alt={item.product.name} className="rounded-md" />
                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => decreaseQuantity(item.product.id)}><Minus className="h-4 w-4" /></Button>
                    <span>{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => increaseQuantity(item.product.id)}><Plus className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="flex items-center font-semibold">
                    <IndianRupee className="h-4 w-4" />
                    <span>{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/80 hover:text-destructive" onClick={() => removeFromCart(item.product.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {cart.length > 0 && (
        <CardFooter className="flex-col !items-stretch space-y-4">
            <Separator />
            <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                 <div className="flex items-center">
                    <IndianRupee className="h-5 w-5" />
                    <span>{total.toFixed(2)}</span>
                </div>
            </div>
          <Button>Checkout</Button>
          <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
        </CardFooter>
      )}
    </Card>
  );
}
