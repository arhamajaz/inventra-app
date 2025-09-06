
import * as React from 'react';
import { AppHeader } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/sidebar';
import { ProductList } from '@/components/dashboard/product-list';

export default function InventoryPage() {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AppSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 flex-1">
        <AppHeader />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
             <h1 className="text-2xl font-semibold">Inventory</h1>
             <React.Suspense fallback={<p>Loading products...</p>}>
                <ProductList />
             </React.Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
