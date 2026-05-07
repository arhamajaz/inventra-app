'use client';

import type { Customer } from '@/lib/types';
import * as React from 'react';
import { getCustomers } from '@/app/actions';

interface CustomerContextType {
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
}

const CustomerContext = React.createContext<CustomerContextType | undefined>(undefined);

export function useCustomers() {
  const context = React.useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
}

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = React.useState<Customer[]>([]);

  React.useEffect(() => {
    async function fetchCustomers() {
      const data = await getCustomers();
      setCustomers(data);
    }
    fetchCustomers();
  }, []);

  const addCustomer = (customer: Customer) => {
    setCustomers(prevCustomers => [...prevCustomers, customer]);
  };

  return (
    <CustomerContext.Provider value={{ customers, addCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
}
