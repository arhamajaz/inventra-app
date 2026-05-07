
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Product } from '@/lib/types';

interface DemandSupplyHeatmapProps {
  initialProducts: Product[];
}

export function DemandSupplyHeatmap({ initialProducts }: DemandSupplyHeatmapProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Demand vs. Supply Heatmap</CardTitle>
        <CardDescription>Inventory levels relative to sales velocity.</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {initialProducts.map((product) => {
              // Handle potential missing historical data
              const historicalData = product.historicalSalesData || [];
              const salesVelocity = historicalData.length > 0 
                ? historicalData.reduce((acc, sale) => acc + (sale.quantity || 0), 0) / historicalData.length 
                : 0;
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
