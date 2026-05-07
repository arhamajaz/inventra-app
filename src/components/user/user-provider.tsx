'use client';
import type { User, UserRole } from '@/lib/types';
import { SessionProvider, useSession } from 'next-auth/react';
import * as React from 'react';

interface UserContextType {
  user: User;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  setUser: (user: any) => void;
}

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

function UserInternalProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const user: User = React.useMemo(() => {
    if (!session?.user) {
      return {
        name: 'Guest',
        email: '',
        role: 'Consumer',
      };
    }
    return {
      name: session.user.name || 'User',
      email: session.user.email || '',
      role: (session.user as any).role || 'Consumer',
      customerId: (session.user as any).customerId,
      membershipId: (session.user as any).membershipId,
    };
  }, [session]);

  const setUser = (user: any) => {
    console.warn('setUser is deprecated. Authentication is now handled by NextAuth.');
  };

  return (
    <UserContext.Provider value={{ user, status, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserInternalProvider>
        {children}
      </UserInternalProvider>
    </SessionProvider>
  );
}
