
import { AppHeader } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/sidebar';
import { ProductGrid } from '@/components/store/product-grid';
import { ShoppingCart } from '@/components/store/shopping-cart';

export default function StorePage() {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AppSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 flex-1">
        <AppHeader />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-semibold mb-4">Consumer Store</h1>
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
