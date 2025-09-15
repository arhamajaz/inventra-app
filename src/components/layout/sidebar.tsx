
'use client';
import Link from 'next/link';
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  Truck,
  Users,
  Package,
  Wand2,
  ShoppingCart,
  User,
  Crown,
  LogOut,
  Receipt,
  LifeBuoy,
  UserPlus,
  Settings,
  MessageSquare,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FeedbackForm } from '../user/feedback-form';


const adminMenuItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/inventory', icon: Boxes, label: 'Inventory' },
  { href: '/orders', icon: Truck, label: 'Orders' },
  { href: '/customers', icon: Users, label: 'Customers' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/ai-tools', icon: Wand2, label: 'AI Tools' },
];

const consumerMenuItems = [
    { href: '/store', icon: ShoppingCart, label: 'Consumer Store' },
    { href: '/my-bill', icon: Receipt, label: 'My Bill'},
];


export function AppSidebar() {
  const pathname = usePathname();
  const { user, setUser } = useUser();
  const { toast } = useToast();
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

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
           {user.role === 'Consumer' && (
            <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
              <DialogTrigger asChild>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip={{ children: 'Feedback', side: 'right' }}>
                    <MessageSquare />
                    <span>Feedback</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Feedback & Requests</DialogTitle>
                  <DialogDescription>
                    Share your thoughts or request a new product. We'd love to hear from you!
                  </DialogDescription>
                </DialogHeader>
                <FeedbackForm onSubmitted={() => setFeedbackDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex items-center gap-3 p-2">
           <Avatar className="h-9 w-9">
            <AvatarImage src={`https://placehold.co/40x40.png?text=${user.name?.charAt(0).toUpperCase()}`} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sidebar-foreground truncate">
              {user.name}
            </span>
            <span className="text-xs text-muted-foreground truncate">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={{ children: 'Settings', side: 'right' }}
                  >
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
              </SidebarMenuItem>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mb-2 ml-2" side="right" align="start">
              <Dialog open={supportDialogOpen} onOpenChange={setSupportDialogOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    <span>Support & Help</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                      <DialogTitle>Support & Help</DialogTitle>
                      <DialogDescription>
                          Get help with Inven-tra.
                      </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                      <p>For any issues or questions, please contact our support team at:</p>
                      <a href="mailto:support@inven-tra.com" className="text-primary hover:underline">support@inven-tra.com</a>
                      <p className="mt-4">You can also check our <Link href="#" className="text-primary hover:underline">FAQ section</Link> for common questions.</p>
                  </div>
                  <DialogFooter>
                      <Button onClick={() => setSupportDialogOpen(false)}>Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <DropdownMenuItem asChild>
                 <Link href="/" className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Add New Account</span>
                  </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={{ children: 'Logout', side: 'right' }}
            >
              <Link href="/">
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
