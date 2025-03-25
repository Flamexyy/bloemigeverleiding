'use client';
import { MdOutlineShoppingBag } from "react-icons/md";
import { IoMdHeart, IoMdHeartEmpty, IoMdClose } from "react-icons/io";
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import CartMenu from './CartMenu';
import { useLiked } from '../context/LikedContext';
import ConfirmationModal from './ConfirmationModal';

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
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, setIsOpen } = useCart();
  const { isLiked, addToLiked, removeLiked } = useLiked();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!product) {
    return null;
  }

  const priceAsNumber = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.availableForSale || isAddingToCart) return;

    setIsAddingToCart(true);
    
    try {
      addToCart({
        id: product.id,
        variantId: product.variantId,
        title: product.title,
        price: priceAsNumber,
        imageUrl: product.imageUrl,
        quantity: 1,
        handle: product.handle,
        compareAtPrice: product.compareAtPrice && parseFloat(product.compareAtPrice.toString()) > priceAsNumber 
          ? product.compareAtPrice.toString() 
          : null,
        quantityAvailable: product.quantityAvailable || 1
      });
      
      // Short delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Open the cart menu
      setIsOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLiked(product.id)) {
      setShowConfirmation(true);
    } else {
      const compareAtPriceNumber = product.compareAtPrice 
        ? (typeof product.compareAtPrice === 'string' 
            ? parseFloat(product.compareAtPrice) 
            : product.compareAtPrice)
        : null;

      addToLiked({
        id: product.id,
        title: product.title,
        price: priceAsNumber,
        imageUrl: product.imageUrl,
        handle: product.handle,
        variantId: product.variantId,
        availableForSale: product.availableForSale,
        quantityAvailable: product.quantityAvailable || 1,
        compareAtPrice: compareAtPriceNumber && compareAtPriceNumber > priceAsNumber 
          ? compareAtPriceNumber 
          : null
      });
    }
  };

  const handleRemoveFromFavorites = () => {
    removeLiked(product.id);
    setShowConfirmation(false);
  };

  const isOnSale = product.compareAtPrice && 
    (typeof product.compareAtPrice === 'string' 
      ? parseFloat(product.compareAtPrice) 
      : product.compareAtPrice) > priceAsNumber;

  return (
    <div className="flex flex-col mb-6">
      {/* Clickable image */}
      <Link href={`/product/${product.handle}`} className="block">
        <div 
          className="relative aspect-square rounded-[25px] overflow-hidden mb-4 cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-3 right-3 text-2xl text-text bg-cream p-2 rounded-full hover:bg-white"
          >
            {isLiked(product.id) ? <IoMdHeart /> : <IoMdHeartEmpty />}
          </button>
          
          {!product.availableForSale ? (
            <div className='absolute bottom-3 right-3 px-4 py-2 bg-cream text-text rounded-[100px] text-sm'>
              Uitverkocht
            </div>
          ) : isOnSale && (
            <div className='absolute bottom-3 right-3 px-4 py-2 bg-text text-cream rounded-[100px] text-sm'>
              Aanbieding
            </div>
          )}
        </div>
      </Link>
      
      {/* Clickable title */}
      <Link href={`/product/${product.handle}`} className="text-center">
        <h3 className="font-medium text-text hover:underline cursor-pointer">{product.title}</h3>
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
            : 'In winkelwagen'
        }
      </button>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleRemoveFromFavorites}
        title="Verwijderen uit favorieten"
        message={`Weet je zeker dat je "${product.title}" uit je favorieten wilt verwijderen?`}
      />
    </div>
  );
}