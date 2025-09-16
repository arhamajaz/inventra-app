
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { IdentifyProductOutput } from '@/ai/flows/product-identification';
import { Check, PackagePlus, RefreshCw, View } from 'lucide-react';
import { products } from '@/lib/mock-data';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { AddProductDialog } from './add-product-dialog';
import { Badge } from '../ui/badge';
import { useRouter } from 'next/navigation';

interface ProductIdentificationResultProps {
  result: IdentifyProductOutput;
  previewUrl: string;
  onRetry: () => void;
  onAddDialogChange: (open: boolean) => void;
  isAddDialogOpen: boolean;
}

export function ProductIdentificationResult({ 
  result, 
  previewUrl, 
  onRetry, 
  onAddDialogChange,
  isAddDialogOpen
}: ProductIdentificationResultProps) {
  const router = useRouter();
  const identifiedProduct = products.find(p => p.id === result.productId);
  const isInInventory = !!identifiedProduct;

  const handleViewInventory = () => {
    if (identifiedProduct) {
        router.push(`/inventory?search=${identifiedProduct.name}`);
    }
  }

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={onAddDialogChange}>
      <div className="space-y-4">
          {previewUrl && (
            <div className="relative w-full h-40">
                <Image src={previewUrl} alt="Product preview" layout="fill" objectFit="contain" className="rounded-md" />
            </div>
          )}
        <div className="rounded-md border bg-muted/50 p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">Identification Results:</h4>
            <Badge variant={isInInventory ? 'default' : 'secondary'} className={isInInventory ? 'bg-green-500/20 text-green-700 border-green-500/30' : ''}>
                {isInInventory ? 'Product in Inventory' : 'Product Not in Inventory'}
            </Badge>
          </div>
          <p className="text-sm">
            <span className="font-medium">Product:</span>{' '}
            <span className="text-primary font-bold">
              {result.productName}
            </span>
          </p>
          <p className="text-sm">
            <span className="font-medium">Confidence:</span>{' '}
            <span className="text-primary font-bold">
              {(result.confidence * 100).toFixed(0)}%
            </span>
          </p>
          <p className="text-sm"><span className="font-medium">Reasoning:</span> {result.reasoning}</p>
        </div>
        <div className="flex justify-between gap-2">
          <Button variant="outline" onClick={onRetry} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          {isInInventory ? (
             <Button className="w-full" onClick={handleViewInventory}>
                <View className="mr-2 h-4 w-4" />
                View in Inventory
            </Button>
          ) : (
            <DialogTrigger asChild>
              <Button className="w-full">
                  <PackagePlus className="mr-2 h-4 w-4" />
                  Add to Inventory
              </Button>
            </DialogTrigger>
          )}
        </div>
      </div>
      <AddProductDialog onOpenChange={onAddDialogChange} productName={result.productName} />
    </Dialog>
  );
}
