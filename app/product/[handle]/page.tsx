'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/app/context/CartContext';
import { getProduct } from '@/app/utils/shopify';
import Image from 'next/image';
import { MdOutlineShoppingBag } from "react-icons/md";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import CartMenu from '@/app/components/CartMenu';

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
  const { addToCart } = useCart();
  const { handle } = params;
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;

    const cartItem = {
      id: product.id,
      title: product.title,
      price: parseFloat(product.priceRange.minVariantPrice.amount),
      quantity: 1,
      imageUrl: product.images.edges[0]?.node.originalSrc || '',
      variantId: product.variants.edges[0]?.node.id
    };

    try {
      addToCart(cartItem);
      setIsCartOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
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

  if (!product) return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-6 py-6 xl:py-10 px-4 lg:px-8 justify-center">
        {/* Image Skeleton */}
        <div className="flex-1 lg:max-w-[600px]">
          <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
        </div>
        
        {/* Product Info Skeleton */}
        <div className="flex-1 lg:max-w-[400px] space-y-4">
          <div>
            <div className="h-8 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded-lg w-1/4 mt-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded-lg w-1/3 mt-2 animate-pulse" />
          </div>
          
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
          
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded-lg w-1/3 animate-pulse" />
            <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="h-4 bg-gray-200 rounded-lg w-2/3 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded-lg w-1/2 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="h-4 bg-gray-200 rounded-lg w-2/3 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded-lg w-1/2 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-6 py-6 xl:py-10 px-4 lg:px-8 justify-center">
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
            <h1 className="text-3xl font-bold uppercase">{product.title}</h1>
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

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full rounded-[50px] p-3 flex items-center justify-center gap-2 transition-colors text-sm
              ${isOutOfStock 
                ? 'bg-accent/50 text-text/70 cursor-not-allowed' 
                : 'bg-accent text-text hover:bg-accent/70 cursor-pointer'
              }`}
          >
            <MdOutlineShoppingBag className="text-lg" />
            {isOutOfStock ? 'Uitverkocht' : 'Toevoegen aan winkelwagen'}
          </button>
        </div>
      </div>
      <CartMenu 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
} 