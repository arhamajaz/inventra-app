import { SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/sidebar';
import { AppHeader } from '@/components/layout/header';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { RestockAlerts } from '@/components/dashboard/restock-alerts';
import { DemandForecast } from '@/components/dashboard/demand-forecast';
import { FulfillmentTracker } from '@/components/dashboard/fulfillment-tracker';
import { DemandSupplyHeatmap } from '@/components/dashboard/demand-supply-heatmap';
import { DollarSign, Package, ShoppingCart, Truck } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AppSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 flex-1">
        <AppHeader />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                title="Total Revenue"
                value="$45,231.89"
                Icon={DollarSign}
                change="+20.1%"
              />
              <KpiCard
                title="Pending Orders"
                value="25"
                Icon={ShoppingCart}
                change="+180.1%"
              />
              <KpiCard
                title="Items in Stock"
                value="1,250"
                Icon={Package}
                change="-2.5%"
              />
              <KpiCard
                title="In Transit"
                value="32"
                Icon={Truck}
                change="+5 since yesterday"
              />
            </div>
            <SalesChart />
            <div className="grid md:grid-cols-2 gap-4 md:gap-8">
              <FulfillmentTracker />
              <DemandSupplyHeatmap />
            </div>
          </div>
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
            <DemandForecast />
            <RestockAlerts />
          </div>
        </main>
      </div>
    </div>
  );
}
