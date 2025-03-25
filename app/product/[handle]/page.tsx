'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/app/context/CartContext';
import { getProduct } from '@/app/utils/shopify';
import Image from 'next/image';
import { MdOutlineShoppingBag } from "react-icons/md";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import CartMenu from '@/app/components/CartMenu';
import { IoMdAdd, IoMdRemove, IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { useLiked } from '@/app/context/LikedContext';

interface ProductPageProps {
  params: {
    handle: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const { addToCart, getCartItemQuantity, setIsOpen: setCartIsOpen } = useCart();
  const { handle } = params;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToLiked, removeLiked, isLiked } = useLiked();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProduct(handle);
        setProduct(productData);
        
        const allOutOfStock = productData.variants.edges.every(
          (edge: any) => !edge.node.availableForSale || edge.node.quantityAvailable === 0
        );
        setIsOutOfStock(allOutOfStock);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [handle]);

  useEffect(() => {
    if (product?.variants?.edges?.length > 0) {
      setSelectedVariant(product.variants.edges[0].node);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!selectedVariant || isOutOfStock || isAddingToCart) return;

    // Get current quantity in cart for this variant
    const currentQuantityInCart = getCartItemQuantity(selectedVariant.id);
    const totalQuantityAfterAdd = currentQuantityInCart + quantity;

    // Check if adding this quantity would exceed available stock
    if (totalQuantityAfterAdd > selectedVariant.quantityAvailable) {
      return;
    }

    setIsAddingToCart(true);

    const cartItem = {
      id: selectedVariant.id,
      variantId: selectedVariant.id,
      title: product.title,
      price: parseFloat(selectedVariant.price.amount),
      imageUrl: product.images.edges[0]?.node.originalSrc,
      quantity: quantity,
      size: selectedVariant.title !== 'Default Title' ? selectedVariant.title : undefined,
      handle: product.handle,
      compareAtPrice: selectedVariant.compareAtPrice?.amount && 
        parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(selectedVariant.price.amount)
        ? selectedVariant.compareAtPrice.amount
        : null,
      quantityAvailable: selectedVariant.quantityAvailable
    };

    try {
      // Add a small delay to ensure the loading state is visible
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await addToCart(cartItem);
      // Use the context function to open the cart
      setCartIsOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!product) return;
    
    const minSwipeDistance = 50;
    const swipeDistance = touchStart - touchEnd;
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swiped left - next image
        setSelectedImage(prev => 
          prev === product.images.edges.length - 1 ? 0 : prev + 1
        );
      } else {
        // Swiped right - previous image
        setSelectedImage(prev => 
          prev === 0 ? product.images.edges.length - 1 : prev - 1
        );
      }
    }
  };

  const nextImage = () => {
    if (!product) return;
    setSelectedImage(prev => 
      prev === product.images.edges.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!product) return;
    setSelectedImage(prev => 
      prev === 0 ? product.images.edges.length - 1 : prev - 1
    );
  };

  const handleQuantityChange = (delta: number) => {
    if (!selectedVariant) return;
    
    const currentQuantityInCart = getCartItemQuantity(selectedVariant.id);
    const newQuantity = quantity + delta;
    const totalQuantity = currentQuantityInCart + newQuantity;

    if (newQuantity >= 1 && totalQuantity <= selectedVariant.quantityAvailable) {
      setQuantity(newQuantity);
    }
  };

  const handleFavoriteToggle = () => {
    if (!product || !selectedVariant) return;
    
    const item = {
      id: product.id,
      title: product.title,
      price: parseFloat(product.priceRange.minVariantPrice.amount),
      imageUrl: product.images.edges[0]?.node.originalSrc,
      handle: product.handle,
      variantId: selectedVariant.id,
      availableForSale: selectedVariant.availableForSale,
      compareAtPrice: product.compareAtPriceRange?.maxVariantPrice?.amount && 
        parseFloat(product.compareAtPriceRange.maxVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount)
        ? parseFloat(product.compareAtPriceRange.maxVariantPrice.amount)
        : null
    };

    if (isLiked(product.id)) {
      removeLiked(product.id);
    } else {
      addToLiked({
        ...item,
        quantityAvailable: selectedVariant.quantityAvailable || 1
      });
    }
  };

  if (!product) return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row gap-6 py-6 xl:py-10 px-4 lg:px-8 justify-center">
        {/* Images Section Skeleton */}
        <div className="flex-1 lg:max-w-[600px]">
          {/* Main Image Skeleton */}
          <div className="w-full aspect-square bg-accent/30 rounded-[25px] animate-pulse mb-4"></div>
          
          {/* Thumbnail Skeletons */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className="w-[60px] h-[60px] bg-accent/30 rounded-[15px] flex-shrink-0 animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="flex-1 lg:max-w-[400px] space-y-6">
          {/* Title and Price */}
          <div className="space-y-3">
            <div className="h-8 bg-accent/30 rounded-[25px] w-3/4 animate-pulse"></div>
            <div className="h-6 bg-accent/30 rounded-[25px] w-1/4 animate-pulse"></div>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-accent/30 rounded-[25px] w-full animate-pulse"></div>
            <div className="h-4 bg-accent/30 rounded-[25px] w-full animate-pulse"></div>
            <div className="h-4 bg-accent/30 rounded-[25px] w-2/3 animate-pulse"></div>
          </div>
          
          {/* Variant Selection */}
          <div className="space-y-3">
            <div className="h-5 bg-accent/30 rounded-[25px] w-1/4 animate-pulse"></div>
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className="h-10 bg-accent/30 rounded-[50px] w-16 animate-pulse"
                ></div>
              ))}
            </div>
          </div>
          
          {/* Add to Cart Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 bg-accent/30 rounded-[50px] w-32 animate-pulse"></div>
              <div className="h-12 bg-accent/30 rounded-[50px] w-full animate-pulse"></div>
            </div>
            <div className="h-12 bg-accent/30 rounded-[50px] w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row gap-6 py-6 xl:py-10 px-4 lg:px-8 justify-center">
        {/* Images Section */}
        <div className="flex-1 lg:max-w-[600px]">
          {/* Desktop Layout */}
          <div className="hidden lg:flex gap-4">
            {/* Thumbnails - Side */}
            <div className="relative flex flex-col gap-2 h-[500px]">
              <div className="flex flex-col gap-1 overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {product.images.edges.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-[60px] h-[60px] rounded-[15px] overflow-hidden flex-shrink-0 transition-all border-2 ${
                      selectedImage === index 
                        ? 'border-text' 
                        : 'border-transparent hover:opacity-80'
                    }`}
                  >
                    <Image
                      src={image.node.originalSrc}
                      alt={image.node.altText || product.title}
                      fill
                      sizes="60px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Main Image */}
            <div className="flex-1">
              <div className="aspect-square relative rounded-[30px] overflow-hidden w-full max-w-[500px]">
                <Image
                  src={product.images.edges[selectedImage].node.originalSrc}
                  alt={product.images.edges[selectedImage].node.altText || product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover"
                  priority
                />
                {/* Navigation Arrows */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button 
                    onClick={prevImage}
                    className="bg-cream/80 hover:bg-cream rounded-full p-2 transition-colors text-text"
                    aria-label="Previous image"
                  >
                    <BiChevronLeft className="text-xl" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="bg-cream/80 hover:bg-cream rounded-full p-2 transition-colors text-text"
                    aria-label="Next image"
                  >
                    <BiChevronRight className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Swipeable Main Image */}
            <div className="relative rounded-[30px] overflow-hidden">
              <div 
                className="aspect-square relative"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <Image
                  src={product.images.edges[selectedImage].node.originalSrc}
                  alt={product.images.edges[selectedImage].node.altText || product.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
                
                {/* Navigation Arrows */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button 
                    onClick={prevImage}
                    className="bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
                    aria-label="Previous image"
                  >
                    <BiChevronLeft className="text-xl" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
                    aria-label="Next image"
                  >
                    <BiChevronRight className="text-xl" />
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnails - Bottom Scrollable */}
            <div className="flex gap-2 mt-2 overflow-x-auto pb-2 px-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {product.images.edges.map((image: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-[60px] h-[60px] rounded-[15px] overflow-hidden flex-shrink-0 transition-all border-2 ${
                    selectedImage === index 
                      ? 'border-text' 
                      : 'border-transparent hover:opacity-80'
                  }`}
                >
                  <Image
                    src={image.node.originalSrc}
                    alt={image.node.altText || product.title}
                    fill
                    sizes="60px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 lg:max-w-[400px] space-y-4">
          <div>
            <h1 className="text-3xl font-bold uppercase text-text">{product.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              {product.priceRange?.maxVariantPrice?.amount && 
               product.priceRange?.minVariantPrice?.amount && 
               parseFloat(product.priceRange.maxVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount) ? (
                <p className="text-xl font-bold text-text">
                  From €{parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                </p>
              ) : product.compareAtPriceRange?.maxVariantPrice?.amount && 
                  parseFloat(product.compareAtPriceRange.maxVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount) ? (
                <>
                  <p className="text-xl font-bold text-red-400">
                    €{parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                  </p>
                  <p className="text-sm text-text line-through">
                    €{parseFloat(product.compareAtPriceRange.maxVariantPrice.amount).toFixed(2)}
                  </p>
                </>
              ) : (
                <p className="text-xl font-bold text-text">
                  €{parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="opacity-70 text-md leading-relaxed">{product.description}</p>
          </div>

          {/* Variant Selection */}
          {product?.variants?.edges?.length > 1 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Maat
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.edges.map((edge: any) => (
                  <button
                    key={edge.node.id}
                    onClick={() => setSelectedVariant(edge.node)}
                    className={`px-4 py-2 rounded-full border ${
                      selectedVariant?.id === edge.node.id
                        ? 'bg-accent text-text border-accent'
                        : 'border-text/20 text-text hover:border-accent'
                    }`}
                  >
                    {edge.node.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Section */}
          <div className="space-y-2 sm:space-y-4">
            {/* Buttons row */}
            <div className="flex flex-col sm:flex-row items-left gap-2 sm:gap-4">
              {/* Quantity Selector */}
              <div className="w-fit flex items-center rounded-[50px] border-2 border-accent bg-white">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-3 text-text hover:bg-accent/50 transition-colors rounded-l-[50px]"
                >
                  <IoMdRemove />
                </button>
                <span className="w-12 text-center font-medium text-text">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-3 text-text hover:bg-accent/50 transition-colors rounded-r-[50px]"
                >
                  <IoMdAdd />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAddingToCart || !selectedVariant || (getCartItemQuantity(selectedVariant?.id) + quantity > selectedVariant?.quantityAvailable)}
                className={`flex-1 rounded-[50px] p-3 flex items-center justify-center gap-2 transition-colors text-sm
                  ${isOutOfStock || isAddingToCart || !selectedVariant || (getCartItemQuantity(selectedVariant?.id) + quantity > selectedVariant?.quantityAvailable)
                    ? 'bg-accent/50 text-text/70 cursor-not-allowed' 
                    : 'bg-accent text-text hover:bg-accent/70 cursor-pointer'
                  }`}
              >
                <MdOutlineShoppingBag className="text-lg" />
                {isOutOfStock 
                  ? 'Uitverkocht' 
                  : isAddingToCart 
                    ? 'Toevoegen...' 
                    : 'Toevoegen aan winkelwagen'
                }
              </button>
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleFavoriteToggle}
              className={`w-full rounded-[50px] p-3 flex items-center justify-center gap-2 transition-colors text-sm
                ${isLiked(product?.id)
                  ? 'bg-text text-white hover:bg-text/80 border-2 border-text hover:border-text/80'
                  : 'border-2 border-accent text-text hover:bg-accent'
                }`}
            >
              {isLiked(product?.id) ? (
                <>
                  <IoMdHeart className="text-lg" />
                  <span>Verwijderen uit favorieten</span>
                </>
              ) : (
                <>
                  <IoMdHeartEmpty className="text-lg" />
                  <span>Toevoegen aan favorieten</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <CartMenu />
    </div>
  );
} 