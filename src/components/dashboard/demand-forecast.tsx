'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { products } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import { getDemandForecast } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Zap } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export function DemandForecast() {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [forecast, setForecast] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleForecast = async () => {
    if (!selectedProduct) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a product to forecast.',
      });
      return;
    }
    setIsLoading(true);
    setForecast(null);
    try {
      const result = await getDemandForecast({
        productName: selectedProduct.name,
        historicalSalesData: JSON.stringify(selectedProduct.historicalSalesData),
      });

      if ('error' in result && result.error) {
        throw new Error(result.error);
      }
      setForecast(result);
      toast({
        title: 'Forecast Generated',
        description: `Successfully forecasted demand for ${selectedProduct.name}.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Forecast Failed',
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="text-primary" />
          <span>AI Demand Forecasting</span>
        </CardTitle>
        <CardDescription>
          Predict future demand using historical sales data and AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          onValueChange={(value) => {
            const product = products.find((p) => p.id === value);
            setSelectedProduct(product || null);
            setForecast(null);
          }}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}
        {forecast && (
          <div className="rounded-md border bg-muted/50 p-4 space-y-2">
            <h4 className="font-semibold">Forecast Results:</h4>
            <p className="text-sm">
              <span className="font-medium">Confidence:</span>{' '}
              <span className="text-primary font-bold">
                {(forecast.confidenceLevel * 100).toFixed(0)}%
              </span>
            </p>
            <p className="text-sm"><span className="font-medium">Explanation:</span> {forecast.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleForecast} disabled={!selectedProduct || isLoading} className="w-full">
          <Zap className="mr-2 h-4 w-4" />
          {isLoading ? 'Forecasting...' : 'Generate Forecast'}
        </Button>
      </CardFooter>
    </Card>
  );
}
