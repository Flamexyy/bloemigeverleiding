'use client';
import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  accessToken: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        setIsLoading(true);
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Also set the access token in cookies
          document.cookie = `shopifyCustomerAccessToken=${userData.accessToken}; path=/; max-age=${60 * 60 * 24 * 30}`;
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    // Clear the cookie
    document.cookie = 'shopifyCustomerAccessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 