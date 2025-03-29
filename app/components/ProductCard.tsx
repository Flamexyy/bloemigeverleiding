'use client';
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { useLiked } from '../context/LikedContext';
import FadeInImage from './FadeInImage';
import { CgShoppingBag } from 'react-icons/cg';

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

  const priceAsNumber = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

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
        quantityAvailable: product.quantityAvailable || 1
      });
      
      // Short delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Open cart after adding
      setIsOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
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
        compareAtPrice: typeof product.compareAtPrice === 'string' 
          ? parseFloat(product.compareAtPrice) 
          : product.compareAtPrice,
        imageUrl: product.imageUrl,
        availableForSale: product.availableForSale,
        variantId: product.variantId,
        handle: product.handle,
        quantityAvailable: product.quantityAvailable || 1
      });
    }
    
    // Reset animation after a short delay
    setTimeout(() => {
      setIsHeartAnimating(false);
    }, 600);
  };

  const isOnSale = product.compareAtPrice && 
    (typeof product.compareAtPrice === 'string' 
      ? parseFloat(product.compareAtPrice) 
      : product.compareAtPrice) > priceAsNumber;

  return (
    <div className="flex flex-col h-full">
      {/* Image container with relative positioning for heart icon */}
      <div className="group relative">
        <Link 
          href={`/products/${product.handle}`}
          className="relative block aspect-square rounded-[25px] overflow-hidden mb-4 bg-white"
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
              <div className="w-full h-full flex items-center justify-center bg-accent/20">
                <CgShoppingBag className="text-text/50 text-4xl" />
              </div>
            )}
          </div>
          
          {/* Heart icon for wishlist */}
          <button
            onClick={toggleLiked}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 transition-colors hover:bg-white"
            aria-label={isLiked(product.id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <div className={isHeartAnimating ? 'heart-animate' : ''}>
              {isLiked(product.id) ? (
                <IoMdHeart className="text-red-400 text-2xl" />
              ) : (
                <IoMdHeartEmpty className="text-text text-2xl" />
              )}
            </div>
          </button>
          
          {/* Sale badge */}
          {product.compareAtPrice && parseFloat(product.compareAtPrice.toString()) > priceAsNumber && (
            <div className='absolute bottom-3 right-3 px-4 py-2 bg-text text-cream rounded-[100px] text-sm'>
              Aanbieding
            </div>
          )}
        </Link>
      </div>
      
      {/* Content area with flex structure */}
      <div className="flex flex-col flex-grow">
        {/* Top content that stays together */}
        <div className="px-2">
          {/* Clickable title */}
          <Link href={`/products/${product.handle}`} className="text-center">
            <h3 className="font-medium text-text hover:underline cursor-pointer line-clamp-2">{product.title}</h3>
          </Link>
          
          {/* Non-clickable price */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2">
              {product.compareAtPrice && parseFloat(product.compareAtPrice.toString()) > priceAsNumber && (
                <span className="text-sm line-through text-text/50">
                  €{parseFloat(product.compareAtPrice.toString()).toFixed(2)}
                </span>
              )}
              <span className={`font-medium ${
                product.compareAtPrice && parseFloat(product.compareAtPrice.toString()) > priceAsNumber
                  ? 'text-red-400'
                  : 'text-text'
              }`}>
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
          className={`w-full py-3 rounded-[100px] transition-colors ${
            product.availableForSale
              ? 'bg-accent text-text hover:bg-accent/70'
              : 'bg-accent/40 text-text/40 border border-accent cursor-not-allowed'
          } ${isAddingToCart ? 'opacity-70' : ''}`}
        >
          {!product.availableForSale 
            ? 'Uitverkocht' 
            : isAddingToCart 
              ? 'Toevoegen...' 
              : hasVariants()
                ? 'Selecteer variant'
                : 'In winkelwagen'
          }
        </button>
      </div>
    </div>
  );
}