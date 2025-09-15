
'use client';
import type { Customer } from '@/lib/types';
import { customers as initialCustomers } from '@/lib/mock-data';
import * as React from 'react';

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
  const [customers, setCustomers] = React.useState<Customer[]>(initialCustomers);

  const addCustomer = (customer: Customer) => {
    setCustomers(prevCustomers => [...prevCustomers, customer]);
  };

  return (
    <CustomerContext.Provider value={{ customers, addCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
}
