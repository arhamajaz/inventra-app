
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { IdentifyProductOutput } from '@/ai/flows/product-identification';
import { Check, RefreshCw } from 'lucide-react';
import { products } from '@/lib/mock-data';

interface ProductIdentificationResultProps {
  result: IdentifyProductOutput;
  previewUrl: string;
  onConfirm: () => void;
  onRetry: () => void;
}

export function ProductIdentificationResult({ result, previewUrl, onConfirm, onRetry }: ProductIdentificationResultProps) {
  const identifiedProduct = products.find(p => p.id === result.productId);

  return (
    <div className="space-y-4">
        <div className="relative w-full h-40">
            <Image src={previewUrl} alt="Product preview" layout="fill" objectFit="contain" className="rounded-md" />
        </div>
      <div className="rounded-md border bg-muted/50 p-4 space-y-2">
        <h4 className="font-semibold">Identification Results:</h4>
        <p className="text-sm">
          <span className="font-medium">Product:</span>{' '}
          <span className="text-primary font-bold">
            {identifiedProduct?.name || result.productName}
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
        <Button onClick={onConfirm} className="w-full">
            <Check className="mr-2 h-4 w-4" />
            Confirm & Add
        </Button>
      </div>
    </div>
  );
}
