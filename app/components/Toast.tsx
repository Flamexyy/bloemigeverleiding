'use client';
import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';

interface ToastProps {
  message: string;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

export function Toast({ 
  message, 
  onClose, 
  actionLabel, 
  onAction,
  duration = 5000 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 10);
    
    // Auto close after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };
  
  return (
    <div 
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
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