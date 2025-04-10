"use client";
import { MdOutlineShoppingBag } from "react-icons/md";
import { useCart } from "../context/CartContext";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CgShoppingBag } from "react-icons/cg";

export default function CartMenu() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, total, isOpen, setIsOpen } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  // Add useEffect to handle body scrolling
  useEffect(() => {
    if (isOpen) {
      // Disable scrolling on body when cart is open
      document.body.style.overflow = "hidden";
      // Add padding to prevent layout shift when scrollbar disappears
      document.body.style.paddingRight = "var(--scrollbar-width)";
    } else {
      // Re-enable scrolling when cart is closed
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    // Calculate scrollbar width once on mount and store it as CSS variable
    if (typeof window !== "undefined") {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);
    }

    // Cleanup function to ensure scrolling is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  const handleCheckout = async () => {
    if (isLoading || items.length === 0) return;
    setIsLoading(true);
    try {

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error creating checkout");
      }

      if (!data.checkoutUrl) {
        throw new Error("No checkout URL received");
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      // Show error to user
      alert(error instanceof Error ? error.message : "Error creating checkout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Cart Panel */}
      <div
        className={`fixed bottom-0 right-0 top-0 z-50 w-full bg-white shadow-xl transition-transform duration-300 ease-in-out sm:w-[400px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-text/20 p-4 text-text">
            <div className="flex items-center gap-2">
              <MdOutlineShoppingBag className="text-2xl" />
              <h2 className="text-xl font-bold">Winkelwagen ({items.length})</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full transition-colors hover:bg-accent"
            >
              <IoClose className="p-2 text-4xl" />
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
                    className="flex gap-4 border-b pb-4"
                  >
                    <Link
                      href={`/products/${item.handle}`}
                      onClick={() => setIsOpen(false)}
                      className="relative mt-1 h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-accent transition-opacity hover:opacity-80"
                    >
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        // Placeholder with shopping bag icon when no image is available
                        <div className="flex h-full w-full items-center justify-center bg-accent/20">
                          <CgShoppingBag className="text-2xl text-text/50" />
                        </div>
                      )}
                    </Link>

                    <div className="flex-1 text-text">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            href={`/products/${item.handle}`}
                            onClick={() => setIsOpen(false)}
                            className="hover:underline"
                          >
                            <h3 className="line-clamp-2 font-bold">{item.title}</h3>
                          </Link>
                          {item.size && <p className="text-sm opacity-50">Variant: {item.size}</p>}
                        </div>
                        <div className="flex flex-col items-end text-right">
                          <div className="flex items-center gap-2">
                            {item.compareAtPrice ? (
                              <>
                                <p className="text-sm text-text/50 line-through">
                                  €{(parseFloat(String(item.compareAtPrice)) * item.quantity).toFixed(2)}
                                </p>
                                <p className="font-bold text-red-400">€{(item.price * item.quantity).toFixed(2)}</p>
                              </>
                            ) : (
                              <p className="font-bold">€{(item.price * item.quantity).toFixed(2)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex w-fit items-center rounded-full border border-accent">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="rounded-l-full px-3 py-1 transition-colors hover:bg-accent/50"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, Math.min(item.quantityAvailable, item.quantity + 1))}
                            className={`rounded-r-full px-3 py-1 transition-colors ${
                              item.quantity >= item.quantityAvailable ? "cursor-not-allowed opacity-50" : "hover:bg-accent/50"
                            }`}
                            disabled={item.quantity >= item.quantityAvailable}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="mt-2 text-sm text-red-400 hover:text-red-600 hover:underline"
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
            <div className="border-t border-text/10 bg-white p-4 text-text">
              {/* First Section - Original Price and Discount */}
              <div className="space-y-1 pb-4">
                <div className="flex items-center justify-between">
                  <span>Subtotaal:</span>
                  <span className="font-medium">
                    €
                    {items
                      .reduce((sum, item) => {
                        const originalPrice = item.compareAtPrice ? parseFloat(String(item.compareAtPrice)) : parseFloat(String(item.price));
                        return sum + originalPrice * item.quantity;
                      }, 0)
                      .toFixed(2)}
                  </span>
                </div>

                {items.some((item) => item.compareAtPrice) && (
                  <div className="flex items-center justify-between text-red-400">
                    <span>Korting:</span>
                    <span className="font-medium">
                      -€
                      {items
                        .reduce((sum, item) => {
                          if (item.compareAtPrice) {
                            return sum + (parseFloat(String(item.compareAtPrice)) - parseFloat(String(item.price))) * item.quantity;
                          }
                          return sum;
                        }, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Second Section - Final Total */}
              <div className="border-t border-text/20 pt-3 text-text">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Totaal:</span>
                  <span className="text-xl font-bold">€{total.toFixed(2)}</span>
                </div>
                <p className="mt-1 text-right text-sm text-text/70">Inclusief BTW</p>
              </div>

              {/* Add View Cart button */}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/cart"
                  className="flex-1 rounded-[50px] bg-accent px-4 py-3 text-center text-text transition-colors hover:bg-accent/70"
                  onClick={() => setIsOpen(false)}
                >
                  Bekijk winkelwagen
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
