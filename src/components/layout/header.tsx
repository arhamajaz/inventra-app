
'use client';
import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Search, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { AddProductDialog } from '../dashboard/add-product-dialog';

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = React.useState(searchParams.get('search') || '');
  const [isAddProductOpen, setIsAddProductOpen] = React.useState(false);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchValue(query);
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    // Only push to router if we are on a page that should be searchable, like inventory
    if (pathname.startsWith('/inventory')) {
        router.push(`${pathname}?${params.toString()}`);
    }
  };
  
  React.useEffect(() => {
    setSearchValue(searchParams.get('search') || '');
  }, [searchParams]);


  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search inventory..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button>
        </DialogTrigger>
        <AddProductDialog onOpenChange={setIsAddProductOpen} />
      </Dialog>
    </header>
  );
}
