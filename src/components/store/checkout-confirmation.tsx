
'use client';

import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { IndianRupee } from 'lucide-react';
import Image from 'next/image';

interface CartItem {
    product: Product;
    quantity: number;
}

interface CheckoutConfirmationProps {
  cart: CartItem[];
  total: number;
  onContinue: () => void;
}

export function CheckoutConfirmation({ cart, total, onContinue }: CheckoutConfirmationProps) {
  return (
    <div>
      <DialogHeader>
        <DialogTitle className="text-2xl text-center">Thank You for Your Order!</DialogTitle>
        <DialogDescription className="text-center">
            Your purchase was successful. We hope to see you again soon.
        </DialogDescription>
      </DialogHeader>
      <div className="my-4">
        <h3 className="font-semibold mb-2">Order Summary:</h3>
        <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
            {cart.map(item => (
                <div key={item.product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image src={item.product.imageUrl} width={40} height={40} alt={item.product.name} className="rounded-md" />
                        <div>
                            <p className="font-medium text-sm">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                    </div>
                    <div className="flex items-center text-sm font-medium">
                        <IndianRupee className="h-3.5 w-3.5" />
                        <span>{(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
            ))}
        </div>
        <Separator className="my-3"/>
        <div className="flex justify-between font-bold">
            <span>Total:</span>
            <div className="flex items-center">
                <IndianRupee className="h-4 w-4" />
                <span>{total.toFixed(2)}</span>
            </div>
        </div>
      </div>
      <Button onClick={onContinue} className="w-full">Continue Shopping</Button>
    </div>
  );
}
