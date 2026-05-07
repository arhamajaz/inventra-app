import { KpiCard } from '@/components/dashboard/kpi-card';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { AppSidebar } from '@/components/layout/sidebar';
import { AppHeader } from '@/components/layout/header';
import { Package, ShoppingCart, Truck } from 'lucide-react';
import { RestockAlerts } from '@/components/dashboard/restock-alerts';
import { getDashboardStats, getProducts } from '@/app/actions';

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const products = await getProducts();
  const lowStockProducts = products.filter(p => p.stock <= p.threshold);

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AppSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 flex-1">
        <AppHeader />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              <KpiCard
                title="Total Products"
                value={stats.productCount.toLocaleString()}
                Icon={Package}
                change=""
                changeText="In your database"
              />
              <KpiCard
                title="Active Orders"
                value={stats.orderCount.toLocaleString()}
                Icon={ShoppingCart}
                change=""
                changeText="Total historical orders"
              />
              <KpiCard
                title="Low Stock"
                value={stats.lowStockCount.toLocaleString()}
                Icon={Package}
                change=""
                changeText="Action required"
                variant={stats.lowStockCount > 0 ? "destructive" : "default"}
              />
            </div>
            <SalesChart data={stats.salesData} />
            <RestockAlerts products={products} />
          </div>
        </main>
      </div>
    </div>
  );
}
