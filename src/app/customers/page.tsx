
'use client';

import { AppHeader } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/sidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users } from 'lucide-react';
import { useCustomers } from '@/components/user/customer-provider';
import { useUser } from '@/components/user/user-provider';
import { Badge } from '@/components/ui/badge';

export default function CustomersPage() {
  const { customers } = useCustomers();
  const { user: loggedInUser } = useUser();

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AppSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 flex-1">
        <AppHeader />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users />
                <span>All Customers</span>
              </CardTitle>
              <CardDescription>
                A list of all registered customers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.id}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>
                        {customer.email === loggedInUser.email && loggedInUser.role === 'Consumer' ? (
                          <Badge variant="secondary">Permanent Customer</Badge>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
