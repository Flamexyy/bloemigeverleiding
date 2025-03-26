'use client';
import { MdOutlineShoppingBag } from "react-icons/md";
import { useCart } from '../context/CartContext';
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function CartMenu() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, total, isOpen, setIsOpen } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  // Add useEffect to handle body scrolling
  useEffect(() => {
    if (isOpen) {
      // Disable scrolling on body when cart is open
      document.body.style.overflow = 'hidden';
      // Add padding to prevent layout shift when scrollbar disappears
      document.body.style.paddingRight = 'var(--scrollbar-width)';
    } else {
      // Re-enable scrolling when cart is closed
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    // Calculate scrollbar width once on mount and store it as CSS variable
    if (typeof window !== 'undefined') {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    }

    // Cleanup function to ensure scrolling is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  const handleCheckout = async () => {
    if (isLoading || items.length === 0) return;
    setIsLoading(true);
    try {
      console.log('Sending items to checkout:', items); // Debug log

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity
          }))
        }),
      });

      const data = await response.json();
      console.log('Checkout response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || 'Error creating checkout');
      }

      if (!data.checkoutUrl) {
        throw new Error('No checkout URL received');
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      // Show error to user
      alert(error instanceof Error ? error.message : 'Error creating checkout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out z-50 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Cart Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-xl transition-transform duration-300 ease-in-out transform z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-text/20 text-text">
            <div className="flex items-center gap-2">
              <MdOutlineShoppingBag className="text-2xl" />
              <h2 className="text-xl font-bold">Winkelwagen ({items.length})</h2>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-accent rounded-full transition-colors"
            >
              <IoClose className="text-4xl p-2" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <p className="text-center text-text">Uw winkelwagen is leeg</p>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div 
                    key={item.id}
                    className="flex gap-4 pb-4 border-b"
                  >
                    <Link 
                      href={`/product/${item.handle}`}
                      onClick={() => setIsOpen(false)}
                      className="w-20 h-20 bg-accent rounded-xl shrink-0 relative overflow-hidden hover:opacity-80 transition-opacity mt-1"
                    >
                      <Image 
                        src={item.imageUrl} 
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex-1 text-text">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <Link 
                            href={`/product/${item.handle}`}
                            onClick={() => setIsOpen(false)}
                            className="hover:underline"
                          >
                            <h3 className="font-bold line-clamp-2">{item.title}</h3>
                          </Link>
                          {item.size && (
                            <p className="text-sm opacity-50">Variant: {item.size}</p>
                          )}
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <div className="flex items-center gap-2">
                            {item.compareAtPrice ? (
                              <>
                                <p className="text-sm text-text/50 line-through">
                                  €{(parseFloat(String(item.compareAtPrice)) * item.quantity).toFixed(2)}
                                </p>
                                <p className="text-red-400 font-bold">
                                  €{(item.price * item.quantity).toFixed(2)}
                                </p>
                              </>
                            ) : (
                              <p className="font-bold">
                                €{(item.price * item.quantity).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center border border-accent rounded-full w-fit">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-3 py-1 hover:bg-accent/50 transition-colors rounded-l-full"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, Math.min(item.quantityAvailable, item.quantity + 1))}
                            className={`px-3 py-1 transition-colors rounded-r-full ${
                              item.quantity >= item.quantityAvailable 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-accent/50'
                            }`}
                            disabled={item.quantity >= item.quantityAvailable}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-sm text-red-500 hover:text-red-600 mt-2 hover:underline"
                        >
                          Verwijderen
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-text/20 p-4 space-y-4 text-text">
              {/* First Section - Original Price and Discount */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Subtotaal:</span>
                  <span className="font-medium">
                    €{items.reduce((sum, item) => {
                      const originalPrice = item.compareAtPrice 
                        ? parseFloat(String(item.compareAtPrice)) 
                        : parseFloat(String(item.price));
                      return sum + (originalPrice * item.quantity);
                    }, 0).toFixed(2)}
                  </span>
                </div>

                {items.some(item => item.compareAtPrice) && (
                  <div className="flex justify-between items-center text-red-500">
                    <span>Korting:</span>
                    <span className="font-medium">
                      -€{items.reduce((sum, item) => {
                        if (item.compareAtPrice) {
                          return sum + (parseFloat(String(item.compareAtPrice)) - parseFloat(String(item.price))) * item.quantity;
                        }
                        return sum;
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Second Section - Final Total */}
              <div className="pt-3 border-t border-text/20">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Totaal:</span>
                  <span className="text-xl font-bold">€{total.toFixed(2)}</span>
                </div>
                <p className="text-sm text-text/70 text-right mt-1">Inclusief BTW</p>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={handleCheckout}
                disabled={isLoading}
                className={`w-full bg-accent text-text rounded-[50px] p-4 hover:bg-accent/70 transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Afrekenen...' : 'Afrekenen'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 