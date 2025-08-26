
'use client';
import type { User, UserRole } from '@/lib/types';
import * as React from 'react';

const ADMIN_USER: User = {
    role: 'Admin',
    name: 'Admin User',
    email: 'admin@foresight.com',
};

const CONSUMER_USER: User = {
    role: 'Consumer',
    name: 'Consumer User',
    email: 'consumer@foresight.com',
    membershipId: `FS-${Math.floor(100000 + Math.random() * 900000)}`
};


interface UserContextType {
  user: User;
  setUser: (settings: { role: UserRole, membershipId?: string }) => void;
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
  const [user, setCurrentUser] = React.useState<User>(ADMIN_USER);

  const setUser = (settings: { role: UserRole, membershipId?: string }) => {
    if (settings.role === 'Admin') {
        setCurrentUser(ADMIN_USER);
    } else {
        const newId = settings.membershipId || CONSUMER_USER.membershipId;
        setCurrentUser({ ...CONSUMER_USER, membershipId: newId });
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
