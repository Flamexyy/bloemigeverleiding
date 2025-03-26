'use client';
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { Toast } from '../components/Toast';

// Define the cookie name and expiry
const COOKIE_NAME = 'likedItems';
const COOKIE_EXPIRY = 30; // days

// Define the shape of a liked item
interface LikedItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  handle: string;
  variantId: string;
  availableForSale: boolean;
  compareAtPrice?: number | null;
  quantityAvailable: number;
}

// Define the context shape
interface LikedContextType {
  likedItems: LikedItem[];
  addToLiked: (item: LikedItem) => void;
  removeLiked: (productId: string) => void;
  isLiked: (productId: string) => boolean;
  clearLiked: () => void;
}

// Create the context
const LikedContext = createContext<LikedContextType | undefined>(undefined);

// Custom hook to use the context
export function useLiked() {
  const context = useContext(LikedContext);
  if (!context) {
    throw new Error('useLiked must be used within a LikedProvider');
  }
  return context;
}

// Provider component
export function LikedProvider({ children }: { children: React.ReactNode }) {
  const [likedItems, setLikedItems] = useState<LikedItem[]>([]);
  const [lastRemovedItem, setLastRemovedItem] = useState<LikedItem | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastQueue, setToastQueue] = useState<string[]>([]);
  const [isToastExiting, setIsToastExiting] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Load liked items from cookies on mount
  useEffect(() => {
    const savedItems = Cookies.get(COOKIE_NAME);
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        setLikedItems(parsedItems);
      } catch (error) {
        console.error('Error parsing liked items from cookie:', error);
      }
    }
  }, []);

  // Process toast queue
  useEffect(() => {
    if (toastQueue.length > 0 && !showToast && !isToastExiting) {
      // Show the next toast in the queue
      setToastMessage(toastQueue[0]);
      setShowToast(true);
      
      // Remove this toast from the queue
      setToastQueue(prev => prev.slice(1));
    }
  }, [toastQueue, showToast, isToastExiting]);

  // Add an item to liked items
  const addToLiked = (item: LikedItem) => {
    setLikedItems(prev => {
      // Check if item already exists
      if (prev.some(i => i.id === item.id)) {
        return prev;
      }
      
      const newItems = [...prev, item];
      // Save to cookies
      Cookies.set(COOKIE_NAME, JSON.stringify(newItems), { expires: COOKIE_EXPIRY, path: '/' });
      return newItems;
    });
  };

  // Add this function to handle showing a toast with proper animation
  const showToastWithAnimation = (message: string) => {
    // First ensure the toast is in the hidden position
    setShowToast(false);
    setToastMessage(message);
    
    // Force a browser reflow to ensure the hidden state is applied
    setTimeout(() => {
      // Then show the toast (which will trigger the animation)
      setShowToast(true);
    }, 10);
  };

  // Remove an item from liked items
  const removeLiked = (productId: string) => {
    const itemToRemove = likedItems.find(item => item.id === productId);
    if (!itemToRemove) return;
    
    setLastRemovedItem(itemToRemove);
    
    setLikedItems(prev => {
      const newItems = prev.filter(item => item.id !== productId);
      // Save to cookies
      Cookies.set(COOKIE_NAME, JSON.stringify(newItems), { expires: COOKIE_EXPIRY, path: '/' });
      return newItems;
    });
    
    // For the first toast or any subsequent toast, ensure it starts in the hidden position
    // by setting isToastExiting to true briefly
    setIsToastExiting(true);
    
    // After a very brief delay, show the toast (which will trigger the animation)
    setTimeout(() => {
      setIsToastExiting(false);
      setToastMessage(`${itemToRemove.title} verwijderd uit favorieten`);
      setShowToast(true);
    }, 10);
  };

  // Restore the last removed item
  const restoreLastRemoved = () => {
    if (lastRemovedItem) {
      addToLiked(lastRemovedItem);
      setLastRemovedItem(null);
      
      // Close the current toast
      handleToastClose();
    }
  };

  // Handle toast close with animation
  const handleToastClose = () => {
    setIsToastExiting(true);
    setShowToast(false);
    
    // After animation completes, reset the exiting state
    setTimeout(() => {
      setIsToastExiting(false);
    }, 300); // Match the animation duration
  };

  // Clear all liked items
  const clearLiked = () => {
    setLikedItems([]);
    Cookies.remove(COOKIE_NAME, { path: '/' });
  };

  // Check if an item is liked
  const isLiked = (productId: string) => {
    return likedItems.some(item => item.id === productId);
  };

  return (
    <LikedContext.Provider value={{
      likedItems,
      addToLiked,
      removeLiked,
      isLiked,
      clearLiked
    }}>
      {children}
      
      {/* Toast notification */}
      {(showToast || isToastExiting) && (
        <Toast 
          message={toastMessage}
          onClose={handleToastClose}
          actionLabel="Herstellen"
          onAction={restoreLastRemoved}
          isVisible={showToast}
        />
      )}
    </LikedContext.Provider>
  );
} 