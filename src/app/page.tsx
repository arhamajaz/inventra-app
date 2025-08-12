import { KpiCard } from '@/components/dashboard/kpi-card';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { AppSidebar } from '@/components/layout/sidebar';
import { AppHeader } from '@/components/layout/header';
import { Package, ShoppingCart, Truck } from 'lucide-react';
import { RestockAlerts } from '@/components/dashboard/restock-alerts';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AppSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 flex-1">
        <AppHeader />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              <KpiCard
                title="Pending Orders"
                value="25"
                Icon={ShoppingCart}
                change="+180.1%"
                changeText="from last month"
              />
              <KpiCard
                title="Items in Stock"
                value="1,250"
                Icon={Package}
                change="-2.5%"
                changeText="from last month"
              />
              <KpiCard
                title="In Transit"
                value="32"
                Icon={Truck}
                change="+5"
                changeText="since yesterday"
              />
            </div>
            <SalesChart />
            <RestockAlerts />
          </div>
        </main>
      </div>
    </div>
  );
}
