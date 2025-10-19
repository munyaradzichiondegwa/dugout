'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  role: 'customer' | 'vendor' | 'admin' | null;
};

const UserContext = createContext<{ user: User; setUser: (u: User) => void } | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({ role: null });
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}
