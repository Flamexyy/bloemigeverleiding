"use client";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { CgShoppingBag } from "react-icons/cg";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total, createCheckout } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuantityChange = (id: string, newQuantity: number, maxQuantity: number) => {
    if (newQuantity < 1) return;
    if (maxQuantity && newQuantity > maxQuantity) return;
    updateQuantity(id, newQuantity);
  };

  const handleCheckout = async () => {
    if (isLoading || items.length === 0) return;
    setIsLoading(true);
    setError(null);

    try {
      const checkoutUrl = await createCheckout();
      console.log("Redirecting to checkout:", checkoutUrl);
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Er is een fout opgetreden bij het afrekenen");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-12 md:py-20 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-text md:text-4xl">WINKELWAGEN</h1>

      {items.length === 0 ? (
        <div className="space-y-6 py-16 text-center">
          <div className="flex justify-center">
            <CgShoppingBag className="text-6xl text-text/30" />
          </div>
          <h2 className="text-xl font-medium text-text">Je winkelwagen is leeg</h2>
          <p className="mx-auto max-w-md text-text/70">Het lijkt erop dat je nog geen items hebt toegevoegd aan je winkelwagen.</p>
          <Link
            href="/shop"
            className="mt-4 inline-block rounded-[50px] bg-accent px-8 py-3 text-text transition-colors hover:bg-accent/70"
          >
            Bekijk onze producten
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items - Left Side */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => {
              const isDiscounted = item.compareAtPrice && parseFloat(String(item.compareAtPrice)) > parseFloat(String(item.price));

              return (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-[25px] border border-text/10 bg-white p-4"
                >
                  {/* Product Image */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
                    <Link href={`/products/${item.handle}`}>
                      <Image
                        src={item.imageUrl || "/placeholder.jpg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </Link>
                  </div>

                  {/* Product Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between">
                      <Link
                        href={`/products/${item.handle}`}
                        className="hover:underline"
                      >
                        <h3 className="line-clamp-2 font-bold text-text">{item.title}</h3>
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 text-text/50 transition-colors hover:text-text"
                        aria-label="Remove item"
                      >
                        <IoClose />
                      </button>
                    </div>

                    {item.size && <p className="mt-1 text-sm text-text/70">Variant: {item.size}</p>}

                    {/* Price */}
                    <div className="mt-2 flex items-center">
                      <span className={`font-bold ${isDiscounted ? "text-red-400" : "text-text"}`}>
                        €{parseFloat(item.price.toString()).toFixed(2)}
                      </span>
                      {item.compareAtPrice && (
                        <span className="ml-2 text-sm text-text/50 line-through">€{parseFloat(item.compareAtPrice.toString()).toFixed(2)}</span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="mt-3 flex w-fit flex-col gap-2 text-text">
                      <div className="flex items-center overflow-hidden rounded-[50px] border border-text/20">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.quantityAvailable)}
                          className="flex h-8 w-8 items-center justify-center text-text/70 transition-colors hover:bg-accent/20"
                          aria-label="Decrease quantity"
                        >
                          <IoMdRemove />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.quantityAvailable)}
                          className="flex h-8 w-8 items-center justify-center text-text/70 transition-colors hover:bg-accent/20"
                          aria-label="Increase quantity"
                          disabled={item.quantityAvailable !== undefined && item.quantity >= item.quantityAvailable}
                        >
                          <IoMdAdd />
                        </button>
                      </div>

                      {item.quantityAvailable && <span className="ml-1 text-xs text-text/50">{item.quantityAvailable} beschikbaar</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1">
            <div className="sticky top-[120px] rounded-[25px] border border-text/10 bg-white p-6">
              <h2 className="mb-4 text-xl font-bold text-text">Besteloverzicht</h2>

              <div className="space-y-3 text-text">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-text/70">Subtotaal:</span>
                  <span className="font-medium">€{total.toFixed(2)}</span>
                </div>

                {/* Discount */}
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

                {/* Total - No shipping section */}
                <div className="border-t border-text/20 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-text">Totaal:</span>
                    <span className="text-xl font-bold text-text">€{total.toFixed(2)}</span>
                  </div>
                  <p className="mt-1 text-right text-sm text-text/70">Inclusief BTW</p>
                </div>
              </div>

              {/* Error message */}
              {error && <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">{error}</div>}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isLoading || items.length === 0}
                className={`mt-6 w-full rounded-[50px] bg-accent p-4 text-text transition-colors hover:bg-accent/70 ${
                  isLoading ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {isLoading ? "Afrekenen..." : "Doorgaan naar afrekenen"}
              </button>

              {/* Payment Methods */}
              <div className="mt-6">
                <p className="mb-3 text-center text-sm text-text/70">Veilig betalen met</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Image
                    src="/Ideal.svg"
                    alt="iDEAL"
                    width={40}
                    height={24}
                    className="h-6 w-auto opacity-80"
                  />
                  <Image
                    src="/Visa.svg"
                    alt="Visa"
                    width={40}
                    height={24}
                    className="h-6 w-auto opacity-80"
                  />
                  <Image
                    src="/Mastercard.svg"
                    alt="Mastercard"
                    width={40}
                    height={24}
                    className="h-6 w-auto opacity-80"
                  />
                  <Image
                    src="/PayPal.svg"
                    alt="PayPal"
                    width={40}
                    height={24}
                    className="h-6 w-auto opacity-80"
                  />
                  <Image
                    src="/Maestro.svg"
                    alt="Maestro"
                    width={40}
                    height={24}
                    className="h-6 w-auto opacity-80"
                  />
                  <Image
                    src="/GooglePay.svg"
                    alt="Google Pay"
                    width={40}
                    height={24}
                    className="h-6 w-auto opacity-80"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
