'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { orders } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function FulfillmentTracker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fulfillment Tracker</CardTitle>
        <CardDescription>Real-time status of recent orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center">
              <div className="flex-1">
                <p className="font-medium">{order.id}</p>
                <p className="text-sm text-muted-foreground">
                  {order.customerName} - {order.items.map(i => i.productName).join(', ')}
                </p>
              </div>
              <Badge
                variant={
                  order.status === 'Delivered'
                    ? 'default'
                    : order.status === 'Shipped'
                    ? 'secondary'
                    : 'outline'
                }
                className={cn(
                  order.status === 'Delivered' && 'bg-green-500/20 text-green-700 border-green-500/30',
                  order.status === 'Shipped' && 'bg-blue-500/20 text-blue-700 border-blue-500/30',
                  order.status === 'Packed' && 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
                  order.status === 'Processing' && 'bg-gray-500/20 text-gray-700 border-gray-500/30',
                )}
              >
                {order.status}
              </Badge>
            </div>
          ))}
        </div>
         <div className="mt-4 text-center">
            <Button variant="outline" size="sm">View All Orders</Button>
        </div>
      </CardContent>
    </Card>
  );
}
