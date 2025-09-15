
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCustomers } from '@/components/user/customer-provider';
import { useUser } from '@/components/user/user-provider';
import { useToast } from '@/hooks/use-toast';
import { Boxes } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const { customers } = useCustomers();
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    // In a real app, you would handle authentication here.
    const isAdmin = email === 'admin@inven-tra.com';
    const isCustomer = customers.some(customer => customer.email === email);

    if (isAdmin) {
      setUser({ role: 'Admin', email: email });
      toast({
        title: 'Login Successful',
        description: 'Welcome, Admin!',
      });
      router.push('/dashboard');
    } else if (isCustomer) {
        const customer = customers.find(c => c.email === email);
        setUser({ role: 'Consumer', email: email, customerId: customer?.id });
        toast({
            title: 'Login Successful',
            description: `Welcome, ${email.split('@')[0]}!`,
        });
        router.push('/store');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'No account found with that email. Please sign up.',
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Boxes className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to Inven-tra</CardTitle>
          <CardDescription>Your smart inventory solution awaits.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
                id="email" 
                type="email" 
                placeholder="user@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
          </div>
          <Button onClick={handleLogin} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            Log In
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
