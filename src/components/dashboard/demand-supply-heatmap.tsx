
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { products } from '@/lib/mock-data';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const getHeatmapColorClass = (ratio: number) => {
  if (ratio < 0.25) return 'bg-destructive/80 hover:bg-destructive'; // Critically low
  if (ratio < 0.5) return 'bg-destructive/50 hover:bg-destructive/70'; // Low
  if (ratio < 0.75) return 'bg-yellow-400/50 hover:bg-yellow-400/70'; // Warning
  if (ratio < 1) return 'bg-primary/40 hover:bg-primary/60'; // Healthy
  return 'bg-primary/20 hover:bg-primary/40'; // Overstocked
};

export function DemandSupplyHeatmap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Demand vs. Supply Heatmap</CardTitle>
        <CardDescription>Inventory levels relative to sales velocity.</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {products.map((product) => {
              const salesVelocity = product.historicalSalesData.reduce((acc, sale) => acc + sale.quantity, 0) / product.historicalSalesData.length;
              const stockToSalesRatio = salesVelocity > 0 ? product.stock / (salesVelocity * 7) : 1; // 7 days of supply
              return (
                <Tooltip key={product.id}>
                  <TooltipTrigger asChild>
                    <div className={cn(
                        "aspect-square flex items-center justify-center rounded-lg transition-all",
                        getHeatmapColorClass(stockToSalesRatio)
                      )}>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{product.name}</p>
                    <p>Stock: {product.stock}</p>
                    <p>Avg. Daily Sales: {salesVelocity.toFixed(1)}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
        <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
                <div className="size-3 rounded-sm bg-destructive/80" />
                <span>Low Stock</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="size-3 rounded-sm bg-primary/40" />
                <span>Healthy</span>
            </div>
             <div className="flex items-center gap-2">
                <div className="size-3 rounded-sm bg-primary/20" />
                <span>Overstock</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
