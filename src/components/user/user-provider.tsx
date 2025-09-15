
'use client';
import type { User, UserRole } from '@/lib/types';
import * as React from 'react';

const ADMIN_USER: User = {
    role: 'Admin',
    name: 'Admin User',
    email: 'admin@inven-tra.com',
};

const CONSUMER_USER: User = {
    role: 'Consumer',
    name: 'Consumer User',
    email: 'consumer@inven-tra.com',
    customerId: `FS-${Math.floor(100000 + Math.random() * 900000)}`
};


interface UserContextType {
  user: User;
  setUser: (settings: { role: UserRole, customerId?: string }) => void;
}

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setCurrentUser] = React.useState<User>(CONSUMER_USER);

  const setUser = (settings: { role: UserRole, customerId?: string }) => {
    if (settings.role === 'Admin') {
        setCurrentUser(ADMIN_USER);
    } else {
        const newId = settings.customerId || user.customerId || `FS-${Math.floor(100000 + Math.random() * 900000)}`;
        setCurrentUser({ ...CONSUMER_USER, customerId: newId });
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
