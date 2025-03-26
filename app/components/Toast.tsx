'use client';
import { useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';

interface ToastProps {
  message: string;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
  isVisible: boolean;
}

export function Toast({ 
  message, 
  onClose, 
  actionLabel, 
  onAction,
  duration = 3000,
  isVisible 
}: ToastProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Clear any existing timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Set timer for auto-close
    if (isVisible) {
      timerRef.current = setTimeout(() => {
        onClose();
      }, duration);
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [duration, onClose, isVisible, message]);
  
  const handleClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onClose();
  };
  
  return (
    <div 
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-transform duration-300 ease-out ${
        isVisible ? 'translate-y-0' : 'translate-y-20'
      }`}
    >
      <div className="bg-text text-white px-4 py-3 rounded-[25px] shadow-lg flex items-center gap-2 sm:gap-3 max-w-[95vw] sm:max-w-[90vw] w-auto">
        <p className="flex-grow text-sm sm:text-base truncate">{message}</p>
        
        {actionLabel && onAction && (
          <button 
            onClick={onAction}
            className="font-medium text-accent hover:underline transition-colors whitespace-nowrap text-sm sm:text-base px-2"
          >
            {actionLabel}
          </button>
        )}
        
        <button 
          onClick={handleClose}
          className="text-white/70 hover:text-white transition-colors flex-shrink-0"
        >
          <IoClose className="text-lg sm:text-xl" />
        </button>
      </div>
    </div>
  );
} 