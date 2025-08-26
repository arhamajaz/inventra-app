
'use client';

import { AppHeader } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/sidebar';
import { ProductGrid } from '@/components/store/product-grid';
import { ShoppingCart } from '@/components/store/shopping-cart';
import { MembershipCard } from '@/components/user/membership-card';
import { useUser } from '@/components/user/user-provider';

export default function StorePage() {
  const { user } = useUser();

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AppSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 flex-1">
        <AppHeader />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <h1 className="text-2xl font-semibold">Consumer Store</h1>
            {user.role === 'Consumer' && <MembershipCard />}
            <ProductGrid />
          </div>
          <div>
            <ShoppingCart />
          </div>
        </main>
      </div>
    </div>
  );
}
