
'use client';
import Link from 'next/link';
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  Settings,
  Truck,
  Users,
  Package,
  Wand2,
  ShoppingCart,
  User,
  Crown,
  LogOut,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import { useUser } from '../user/user-provider';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const adminMenuItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/store', icon: ShoppingCart, label: 'Consumer Store' },
  { href: '#', icon: Boxes, label: 'Inventory' },
  { href: '#', icon: Truck, label: 'Orders' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/ai-tools', icon: Wand2, label: 'AI Tools' },
  { href: '/customers', icon: Users, label: 'Customers' },
  { href: '#', icon: Users, label: 'Suppliers' },
];

const consumerMenuItems = [
    { href: '/store', icon: ShoppingCart, label: 'Consumer Store' },
];


export function AppSidebar() {
  const pathname = usePathname();
  const { user, setUser } = useUser();
  const { toast } = useToast();

  const menuItems = user.role === 'Admin' ? adminMenuItems : consumerMenuItems;

  const handleAdminClick = () => {
    const password = prompt('Please enter admin password:');
    if (password === '1875') {
      setUser({ role: 'Admin' });
      toast({
        title: 'Switched to Admin Role',
        description: 'You now have admin privileges.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: 'The password you entered is incorrect.',
      });
    }
  };


  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <Package className="size-8 text-primary" />
          <h1 className="text-xl font-semibold text-sidebar-foreground">
            Foresight
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex items-center gap-3 p-2">
           <Avatar className="h-9 w-9">
            <AvatarImage src={`https://placehold.co/40x40.png?text=${user.name.charAt(0)}`} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sidebar-foreground">
              {user.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
        </div>
         <div className='p-2 space-y-2'>
            <p className='text-xs text-muted-foreground text-center'>Switch User Role</p>
            <div className='grid grid-cols-2 gap-2'>
                 <Button variant={user.role === 'Admin' ? 'secondary' : 'ghost'} size="sm" onClick={handleAdminClick}>
                    <Crown className="mr-2 h-4 w-4" />
                    Admin
                </Button>
                <Button variant={user.role === 'Consumer' ? 'secondary' : 'ghost'} size="sm" onClick={() => setUser({role: 'Consumer'})}>
                     <User className="mr-2 h-4 w-4" />
                     Consumer
                </Button>
            </div>
        </div>
        <SidebarSeparator />
         <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={{ children: 'Settings', side: 'right' }}
            >
              <Link href="#">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={{ children: 'Logout', side: 'right' }}
            >
              <Link href="#">
                <LogOut />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
