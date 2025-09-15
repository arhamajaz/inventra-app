
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { customers } from '@/lib/mock-data';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUser } from '@/components/user/user-provider';
import type { UserRole } from '@/lib/types';

const ADMIN_AUTH_KEY = '1875';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Consumer');
  const [adminKey, setAdminKey] = useState('');

  const handleSignup = () => {
    if (!email || !password || !confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill out all fields.',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Passwords Do Not Match',
        description: 'Please ensure your passwords match.',
      });
      return;
    }

    if (customers.some(customer => customer.email === email)) {
        toast({
          variant: 'destructive',
          title: 'Email Already Exists',
          description: 'This email is already registered. Please log in.',
        });
        return;
    }
    
    if (role === 'Admin' && adminKey !== ADMIN_AUTH_KEY) {
        toast({
          variant: 'destructive',
          title: 'Invalid Admin Key',
          description: 'The authentication key for the admin role is incorrect.',
        });
        return;
    }

    // In a real application, you would create the user account here.
    // For this demo, we'll just show a success message and redirect.
    toast({
      title: 'Signup Successful!',
      description: 'You have successfully created your account.',
    });
    
    setUser({role: role});
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <KeyRound className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Join Inven-tra and manage your inventory smartly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label>Role</Label>
                 <RadioGroup defaultValue="Consumer" onValueChange={(value: UserRole) => setRole(value)} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Consumer" id="r1" />
                        <Label htmlFor="r1">Consumer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Admin" id="r2" />
                        <Label htmlFor="r2">Admin</Label>
                    </div>
                </RadioGroup>
            </div>
             {role === 'Admin' && (
                <div className="space-y-2">
                    <Label htmlFor="admin-key">Admin Auth Key</Label>
                    <Input
                        id="admin-key"
                        type="password"
                        placeholder="Enter admin key"
                        required
                        value={adminKey}
                        onChange={(e) => setAdminKey(e.target.value)}
                    />
                </div>
            )}
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
            <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input 
                id="confirm-password" 
                type="password" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button onClick={handleSignup} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            Sign Up
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/" className="text-primary hover:underline">
              Log In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
