
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUser } from './user-provider';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Copy, Ticket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function MembershipCard() {
  const { user, setUser } = useUser();
  const { toast } = useToast();
  const [newId, setNewId] = React.useState(user.membershipId || '');

  const handleUpdateId = () => {
    setUser({ role: 'Consumer', membershipId: newId });
    toast({
        title: 'Membership ID Updated',
        description: `Your new ID is ${newId}`,
    });
  };
  
  const handleCopyId = () => {
    if (user.membershipId) {
        navigator.clipboard.writeText(user.membershipId);
        toast({
            title: 'Copied to Clipboard!',
            description: user.membershipId,
        });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Ticket className="text-primary"/>
            <span>Membership ID</span>
        </CardTitle>
        <CardDescription>Your unique identifier for special offers and tracking.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <Input 
            value={newId} 
            onChange={(e) => setNewId(e.target.value)}
            placeholder="Enter your Membership ID"
        />
        <Button variant="outline" size="icon" onClick={handleCopyId} disabled={!user.membershipId}>
            <Copy className="h-4 w-4"/>
        </Button>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpdateId}>Set or Update ID</Button>
      </CardFooter>
    </Card>
  );
}
