
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const adminMenuItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/inventory', icon: Boxes, label: 'Inventory' },
  { href: '/orders', icon: Truck, label: 'Orders' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/ai-tools', icon: Wand2, label: 'AI Tools' },
  { href: '#', icon: Users, label: 'Suppliers' },
];

const consumerMenuItems = [
    { href: '/store', icon: ShoppingCart, label: 'Consumer Store' },
];


export function AppSidebar() {
  const pathname = usePathname();
  const { user, setUser } = useUser();
  const { toast } = useToast();
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [password, setPassword] = useState('');

  const menuItems = user.role === 'Admin' ? adminMenuItems : consumerMenuItems;

  const handleAdminAuth = () => {
    if (password === '1875') {
      setUser({ role: 'Admin' });
      toast({
        title: 'Switched to Admin Role',
        description: 'You now have admin privileges.',
      });
      setAdminDialogOpen(false);
      setPassword('');
    } else {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: 'The password you entered is incorrect.',
      });
      setPassword('');
    }
  };


  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <Package className="size-8 text-primary" />
          <h1 className="text-xl font-semibold text-sidebar-foreground">
            Inven-tra
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
                 <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant={user.role === 'Admin' ? 'secondary' : 'ghost'} size="sm">
                            <Crown className="mr-2 h-4 w-4" />
                            Admin
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                        <DialogTitle>Admin Access</DialogTitle>
                        <DialogDescription>
                            Enter the password to switch to the admin role.
                        </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password-input" className="text-right">
                            Password
                            </Label>
                            <Input
                            id="password-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="col-span-3"
                            onKeyDown={(e) => e.key === 'Enter' && handleAdminAuth()}
                            />
                        </div>
                        </div>
                        <DialogFooter>
                        <Button type="submit" onClick={handleAdminAuth}>Authenticate</Button>
                        </DialogFooter>
                    </DialogContent>
                 </Dialog>

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
