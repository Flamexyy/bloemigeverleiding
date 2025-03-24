'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export interface LikedProduct {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  handle: string;
  variantId: string;
  availableForSale: boolean;
}

interface LikedContextType {
  items: LikedProduct[];
  addToLiked: (product: LikedProduct) => void;
  removeLiked: (id: string) => void;
  isLiked: (id: string) => boolean;
  clearLiked: () => void;
}

const LikedContext = createContext<LikedContextType | undefined>(undefined);

const COOKIE_NAME = 'liked_items';
const COOKIE_EXPIRY = 30;

export function LikedProvider({ children }: { children: React.ReactNode }) {
  const [likedItems, setLikedItems] = useState<LikedProduct[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load liked items from cookies on mount
  useEffect(() => {
    const loadLikedItems = () => {
      try {
        const savedItems = Cookies.get(COOKIE_NAME);
        if (savedItems) {
          const parsedItems = JSON.parse(savedItems);
          setLikedItems(Array.isArray(parsedItems) ? parsedItems : []);
        }
      } catch (error) {
        console.error('Error loading liked items:', error);
        Cookies.remove(COOKIE_NAME);
      } finally {
        setIsInitialized(true);
      }
    };

    loadLikedItems();
  }, []);

  // Save to cookies whenever likedItems changes
  useEffect(() => {
    if (isInitialized) {
      try {
        if (likedItems.length > 0) {
          Cookies.set(COOKIE_NAME, JSON.stringify(likedItems), {
            expires: COOKIE_EXPIRY,
            path: '/',
            sameSite: 'lax'
          });
        } else {
          Cookies.remove(COOKIE_NAME, { path: '/' });
        }
      } catch (error) {
        console.error('Error saving liked items:', error);
      }
    }
  }, [likedItems, isInitialized]);

  const addToLiked = (product: LikedProduct) => {
    setLikedItems(prev => {
      if (!prev.some(item => item.id === product.id)) {
        const newItems = [...prev, product];
        return newItems;
      }
      return prev;
    });
  };

  const removeFromLiked = (productId: string) => {
    setLikedItems(prev => {
      const newItems = prev.filter(item => item.id !== productId);
      return newItems;
    });
  };

  const isLiked = (productId: string) => {
    return likedItems.some(item => item.id === productId);
  };

  return (
    <LikedContext.Provider value={{ 
      items: likedItems, 
      addToLiked, 
      removeLiked: removeFromLiked, 
      isLiked,
      clearLiked: () => setLikedItems([]) 
    }}>
      {children}
    </LikedContext.Provider>
  );
}

export function useLiked() {
  const context = useContext(LikedContext);
  if (context === undefined) {
    throw new Error('useLiked must be used within a LikedProvider');
  }
  return context;
} 