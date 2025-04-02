"use client";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { useLiked } from "../context/LikedContext";
import FadeInImage from "./FadeInImage";
import { CgShoppingBag } from "react-icons/cg";

interface ProductCardProps {
  product: {
    id: string;
    handle: string;
    title: string;
    price: string | number;
    compareAtPrice?: string | number | null;
    imageUrl: string;
    availableForSale: boolean;
    variantId: string;
    quantityAvailable?: number;
    hasVariants?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, setIsOpen } = useCart();
  const { isLiked, addToLiked, removeLiked } = useLiked();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  if (!product) {
    return null;
  }

  const priceAsNumber = typeof product.price === "string" ? parseFloat(product.price) : product.price;

  const hasVariants = () => {
    // Check if the product has variants in Shopify
    // This is the ONLY condition we should check
    return product.hasVariants === true;
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.availableForSale || isAddingToCart) return;

    if (hasVariants()) {
      window.location.href = `/products/${product.handle}`;
      return;
    }

    setIsAddingToCart(true);

    try {
      addToCart({
        id: product.id,
        variantId: product.variantId,
        title: product.title,
        price: priceAsNumber,
        compareAtPrice: product.compareAtPrice,
        imageUrl: product.imageUrl,
        availableForSale: product.availableForSale,
        handle: product.handle,
        quantity: 1,
        quantityAvailable: product.quantityAvailable || 1,
      });

      // Short delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Open cart after adding
      setIsOpen(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const toggleLiked = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsHeartAnimating(true);

    if (isLiked(product.id)) {
      removeLiked(product.id);
    } else {
      addToLiked({
        id: product.id,
        title: product.title,
        price: priceAsNumber,
        compareAtPrice: typeof product.compareAtPrice === "string" ? parseFloat(product.compareAtPrice) : product.compareAtPrice,
        imageUrl: product.imageUrl,
        availableForSale: product.availableForSale,
        variantId: product.variantId,
        handle: product.handle,
        quantityAvailable: product.quantityAvailable || 1,
      });
    }

    // Reset animation after a short delay
    setTimeout(() => {
      setIsHeartAnimating(false);
    }, 600);
  };

  const isOnSale =
    product.compareAtPrice &&
    (typeof product.compareAtPrice === "string" ? parseFloat(product.compareAtPrice) : product.compareAtPrice) > priceAsNumber;

  return (
    <div className="flex h-full flex-col">
      {/* Image container with relative positioning for heart icon */}
      <div className="group relative">
        <Link
          href={`/products/${product.handle}`}
          className="relative mb-4 block aspect-square overflow-hidden rounded-[25px] bg-white"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-accent/10">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              // Placeholder with shopping bag icon when no image is available
              <div className="flex h-full w-full items-center justify-center bg-accent/20">
                <CgShoppingBag className="text-4xl text-text/50" />
              </div>
            )}
          </div>

          {/* Heart icon for wishlist */}
          <button
            onClick={toggleLiked}
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white"
            aria-label={isLiked(product.id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <div className={isHeartAnimating ? "heart-animate" : ""}>
              {isLiked(product.id) ? <IoMdHeart className="text-2xl text-red-400" /> : <IoMdHeartEmpty className="text-2xl text-text" />}
            </div>
          </button>

          {/* Sale badge */}
          {product.compareAtPrice && parseFloat(product.compareAtPrice.toString()) > priceAsNumber && (
            <div className="absolute bottom-3 right-3 rounded-[100px] bg-text px-4 py-2 text-sm text-cream">Aanbieding</div>
          )}
        </Link>
      </div>

      {/* Content area with flex structure */}
      <div className="flex flex-grow flex-col">
        {/* Top content that stays together */}
        <div className="px-2">
          {/* Clickable title */}
          <Link
            href={`/products/${product.handle}`}
            className="text-center"
          >
            <h3 className="line-clamp-2 cursor-pointer font-medium text-text hover:underline">{product.title}</h3>
          </Link>

          {/* Non-clickable price */}
          <div className="mb-4 text-center">
            <div className="flex items-center justify-center gap-2">
              {product.compareAtPrice && parseFloat(product.compareAtPrice.toString()) > priceAsNumber && (
                <span className="text-sm text-text/50 line-through">€{parseFloat(product.compareAtPrice.toString()).toFixed(2)}</span>
              )}
              <span
                className={`font-medium ${
                  product.compareAtPrice && parseFloat(product.compareAtPrice.toString()) > priceAsNumber ? "text-red-400" : "text-text"
                }`}
              >
                €{priceAsNumber.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-grow"></div>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.availableForSale || isAddingToCart}
          className={`w-full rounded-[100px] py-3 transition-colors ${
            product.availableForSale ? "bg-accent text-text hover:bg-accent/70" : "cursor-not-allowed border border-accent bg-accent/40 text-text/40"
          } ${isAddingToCart ? "opacity-70" : ""}`}
        >
          {!product.availableForSale ? "Uitverkocht" : isAddingToCart ? "Toevoegen..." : hasVariants() ? "Selecteer variant" : "In winkelwagen"}
        </button>
      </div>
    </div>
  );
}
