'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/app/context/CartContext';
import { getProduct, getProducts } from '@/app/utils/shopify';
import Image from 'next/image';
import { MdOutlineShoppingBag } from "react-icons/md";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import CartMenu from '@/app/components/CartMenu';
import { IoMdAdd, IoMdRemove, IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { useLiked } from '@/app/context/LikedContext';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { IoStar, IoCheckmark } from "react-icons/io5";
import Link from 'next/link';
import { RiArrowRightUpLine } from "react-icons/ri";
import ProductCard from '@/app/components/ProductCard';
import { ProductCardSkeleton } from '@/app/components/SkeletonLoader';
import { IoClose } from "react-icons/io5";
import { IoFlowerOutline } from "react-icons/io5";
import { IoCartOutline } from "react-icons/io5";
import { HiMiniChevronUp, HiMiniChevronDown } from "react-icons/hi2";

interface ProductPageProps {
  params: {
    handle: string;
  };
}

interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

interface SelectedOption {
  name: string;
  value: string;
}

export default function ProductPage({ params }: ProductPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const { addToCart, getCartItemQuantity, setIsOpen: setCartIsOpen } = useCart();
  const { handle } = params;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToLiked, removeLiked, isLiked } = useLiked();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [relatedProductsLoading, setRelatedProductsLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: string}>({});
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;
      
      try {
        setRelatedProductsLoading(true);
        // Fetch all products
        const allProducts = await getProducts();
        
        // Filter out the current product
        const otherProducts = allProducts.filter((p: any) => p.id !== product.id);
        
        // Shuffle the array to get random products
        const shuffled = [...otherProducts].sort(() => 0.5 - Math.random());
        
        // Take the first 4 (or fewer if there aren't enough products)
        const randomProducts = shuffled.slice(0, 4);
        
        setRelatedProducts(randomProducts);
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setRelatedProductsLoading(false);
      }
    };
    
    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  useEffect(() => {
    // Initialize selected options with the first available option for each option type
    if (product && product.options) {
      const initialOptions: {[key: string]: string} = {};
      
      product.options.forEach((option: ProductOption) => {
        if (option.values && option.values.length > 0) {
          initialOptions[option.name] = option.values[0];
        }
      });
      
      setSelectedOptions(initialOptions);
      
      // Find the matching variant based on initial options
      const matchingVariant = findVariantForOptions(initialOptions);
      if (matchingVariant) {
        setSelectedVariant(matchingVariant);
      }
    }
  }, [product]);

  const findVariantForOptions = (options: {[key: string]: string}) => {
    if (!product || !product.variants || !product.variants.edges) return null;
    
    return product.variants.edges.find(({ node }: { node: any }) => {
      // Check if this variant matches all selected options
      if (!node.selectedOptions) return false;
      
      return node.selectedOptions.every((optionItem: SelectedOption) => 
        options[optionItem.name] === optionItem.value
      );
    })?.node || null;
  };

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);
    
    // Find the matching variant
    const matchingVariant = findVariantForOptions(newOptions);
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

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
      quantityAvailable: selectedVariant.quantityAvailable,
      availableForSale: selectedVariant.availableForSale
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

  const openLightbox = () => {
    setIsLightboxOpen(true);
    // Disable scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    // Re-enable scrolling when lightbox is closed
    document.body.style.overflow = '';
  };

  // First, let's add a function to check if we can add more of this item
  const canAddToCart = () => {
    if (!selectedVariant || !selectedVariant.availableForSale) {
      return false;
    }
    
    // Check if adding the selected quantity would exceed available stock
    const currentQuantityInCart = getCartItemQuantity(selectedVariant.id);
    const totalQuantityAfterAdd = currentQuantityInCart + quantity;
    
    return totalQuantityAfterAdd <= selectedVariant.quantityAvailable;
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  if (!product) return (
    <div className="max-w-[1600px] mx-auto">
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
    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row gap-6 py-6 xl:py-10 px-4 lg:px-8 justify-center">
        {/* Images Section */}
        <div className="flex-1 lg:max-w-[600px]">
          {/* Desktop Layout */}
          <div className="hidden lg:flex gap-4">
            {/* Thumbnails - Side */}
            <div className="relative flex flex-col gap-2 h-[500px]">
              <div className="flex flex-col gap-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {product.images.edges.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-[60px] h-[60px] rounded-[35%] overflow-hidden flex-shrink-0 transition-all ${
                      selectedImage === index 
                        ? 'border-text' 
                        : 'border-transparent hover:opacity-80 opacity-30'
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
              <div className="aspect-square relative rounded-[25px] overflow-hidden cursor-zoom-in" onClick={openLightbox}>
                <Carousel
                  selectedItem={selectedImage}
                  onChange={setSelectedImage}
                  showArrows={false}
                  showStatus={false}
                  showThumbs={false}
                  infiniteLoop={true}
                  emulateTouch={true}
                  swipeable={true}
                  renderIndicator={(clickHandler, isSelected, index) => (
                    <button
                      key={index}
                      onClick={clickHandler}
                      className={`w-2 h-2 rounded-full transition-all ${
                        isSelected 
                          ? 'bg-white w-4' 
                          : 'bg-white/60 hover:bg-white/80'
                      }`}
                      style={{
                        display: 'inline-block',
                        margin: '0 4px',
                      }}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  )}
                >
                  {product.images.edges.map((image: any, index: number) => (
                    <div key={index} className="aspect-square relative">
                      <Image
                        src={image.node.originalSrc}
                        alt={image.node.altText || product.title}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  ))}
                </Carousel>
                
                {/* Navigation Arrows */}
                <div className="hidden md:flex absolute bottom-4 right-4 gap-2 z-10">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening lightbox when clicking arrows
                      prevImage();
                    }}
                    className="bg-cream/80 hover:bg-cream rounded-full p-2 transition-colors text-text"
                    aria-label="Previous image"
                  >
                    <BiChevronLeft className="text-xl" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening lightbox when clicking arrows
                      nextImage();
                    }}
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
              <Carousel
                selectedItem={selectedImage}
                onChange={setSelectedImage}
                showArrows={false}
                showStatus={false}
                showThumbs={false}
                infiniteLoop={true}
                emulateTouch={true}
                swipeable={true}
                renderIndicator={(clickHandler, isSelected, index) => (
                  <button
                    key={index}
                    onClick={clickHandler}
                    className={`w-2 h-2 rounded-full transition-all ${
                      isSelected 
                        ? 'bg-white w-4' 
                        : 'bg-white/60 hover:bg-white/80'
                    }`}
                    style={{
                      display: 'inline-block',
                      margin: '0 4px',
                    }}
                    aria-label={`Go to image ${index + 1}`}
                  />
                )}
              >
                {product.images.edges.map((image: any, index: number) => (
                  <div key={index} className="aspect-square relative">
                    <Image
                      src={image.node.originalSrc}
                      alt={image.node.altText || product.title}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </Carousel>
              
              {/* Navigation Arrows */}
              <div className="hidden md:flex absolute bottom-4 right-4 gap-2 z-10">
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
            
            {/* Thumbnails - Bottom Scrollable */}
            <div className="grid grid-cols-5 gap-1 mt-2">
              {product.images.edges.map((image: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-[35%] overflow-hidden transition-all ${
                    selectedImage === index 
                      ? 'border-text' 
                      : 'border-transparent hover:opacity-80 opacity-30'
                  }`}
                >
                  <Image
                    src={image.node.originalSrc}
                    alt={image.node.altText || product.title}
                    fill
                    sizes="(max-width: 640px) 20vw, 50px"
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
                  <p className="text-2xl font-bold text-red-400">
                    €{parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                  </p>
                  <p className="text-md text-text/50 line-through">
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
            <p className="text-text/70 text-md leading-relaxed">{product.description}</p>
          </div>

          {/* Variant Selection */}
          {product?.variants?.edges?.length > 1 && (
            <div className="space-y-2 pb-4">
              <label className="block text-md font-medium text-text">
                Variant
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
            <div className="flex items-left gap-2 sm:gap-4 flex-button">
              {/* Quantity Selector */}
              <div className="w-fit flex items-center rounded-[50px] border-2 border-accent bg-white">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-3 py-[15px] text-text hover:bg-accent/50 transition-colors rounded-l-[50px]"
                >
                  <IoMdRemove />
                </button>
                <span className="w-12 text-center font-medium text-text">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-3 py-[15px] text-text hover:bg-accent/50 transition-colors rounded-r-[50px]"
                >
                  <IoMdAdd />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !canAddToCart()}
                className={`w-full py-3 px-6 rounded-[100px] flex items-center justify-center gap-2 font-medium transition-all duration-300 ${
                  !canAddToCart()
                    ? 'bg-accent/50 border border-accent text-text/50 cursor-not-allowed'
                    : 'bg-accent text-text hover:bg-accent/70'
                }`}
              >
                {isAddingToCart ? (
                  <>
                    <span className="animate-spin mr-2">
                      <IoFlowerOutline className="text-xl" />
                    </span>
                    Toevoegen...
                  </>
                ) : !canAddToCart() ? (
                  'Uitverkocht'
                ) : (
                  <>
                    <IoCartOutline className="text-xl" />
                    In winkelwagen
                  </>
                )}
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

      {/* Product Details Tabs Section */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-12">
        <div className="flex border-b border-text/10 mb-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('description')}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'description' ? 'border-b-2 border-accent text-text' : 'text-text/70 hover:text-text'
            }`}
          >
            Beschrijving
          </button>
          <button 
            onClick={() => setActiveTab('delivery')}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'delivery' ? 'border-b-2 border-accent text-text' : 'text-text/70 hover:text-text'
            }`}
          >
            Verzending & Levering
          </button>
          <button 
            onClick={() => setActiveTab('care')}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'care' ? 'border-b-2 border-accent text-text' : 'text-text/70 hover:text-text'
            }`}
          >
            Verzorgingstips
          </button>
        </div>
        
        <div className="max-w-[1600px]">
          {activeTab === 'description' && (
            <div className="space-y-4 text-text/70">
              <p>
                {product.description || 'Geen beschrijving beschikbaar.'}
              </p>
              <p>
                Onze boeketten worden met de grootste zorg samengesteld door onze ervaren bloemisten. 
                We gebruiken alleen de mooiste en verste bloemen om een prachtig arrangement te creëren 
                dat perfect past bij elke gelegenheid.
              </p>
              
              {/* Product Features */}
              <div className="pt-6 mt-6 border-t border-text/10">
                <h3 className="font-bold text-lg mb-4 text-text">Productkenmerken</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <IoCheckmark className="text-text text-sm" />
                    </div>
                    <span>Handgemaakt met verse bloemen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <IoCheckmark className="text-text text-sm" />
                    </div>
                    <span>Bezorging binnen 24 uur mogelijk</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <IoCheckmark className="text-text text-sm" />
                    </div>
                    <span>Inclusief verzorgingstips</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <IoCheckmark className="text-text text-sm" />
                    </div>
                    <span>Gratis wenskaart bij bestelling</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'delivery' && (
            <div className="space-y-6 text-text/70">
              <div>
                <h3 className="text-lg font-bold text-text mb-2">Bezorgopties</h3>
                <p>
                  We bieden verschillende bezorgopties aan om aan uw wensen te voldoen:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Standaard bezorging (1-2 werkdagen)</li>
                  <li>Express bezorging (binnen 24 uur)</li>
                  <li>Bezorging op specifieke datum</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-text mb-2">Verzendkosten</h3>
                <p>
                  De verzendkosten zijn afhankelijk van de gekozen bezorgoptie en de bestemming:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Standaard bezorging: €4,95</li>
                  <li>Express bezorging: €9,95</li>
                  <li>Gratis verzending bij bestellingen boven €150</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-text mb-2">Leveringsgebied</h3>
                <p>
                  Wij bezorgen in heel Nederland. Voor internationale leveringen, neem contact met ons op.
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'care' && (
            <div className="space-y-6 text-text/70">
              <p>
                Om zo lang mogelijk van uw bloemen te genieten, volg deze verzorgingstips:
              </p>
              
              <div>
                <h3 className="text-lg font-bold text-text mb-2">Bij ontvangst</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Haal het boeket voorzichtig uit de verpakking</li>
                  <li>Snijd de stelen schuin af met een scherp mes (ongeveer 2 cm)</li>
                  <li>Verwijder bladeren die onder water komen te staan</li>
                  <li>Gebruik een schone vaas met vers, koud water</li>
                  <li>Voeg het meegeleverde voedingszakje toe aan het water</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-text mb-2">Dagelijkse verzorging</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Plaats het boeket niet in direct zonlicht of bij een warmtebron</li>
                  <li>Ververs het water om de 2-3 dagen</li>
                  <li>Verwijder verwelkte bloemen om de levensduur van de andere bloemen te verlengen</li>
                  <li>Snijd de stelen elke keer als u het water ververst opnieuw schuin af</li>
                </ul>
              </div>
              
              <div className="bg-accent p-4 rounded-[15px] mt-4">
                <p className="font-medium text-text">
                  Tip: Sommige bloemen, zoals tulpen, blijven groeien in de vaas. Houd hier rekening mee bij het plaatsen van uw boeket.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      {/* <div className="bg-accent/10 py-12">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
          <div className="flex flex-col gap-6 items-start mb-10 text-text">
            <div className='w-full flex flex-col-reverse md:flex-row justify-between items-start gap-5 md:gap-10'>
              <div className='max-w-[800px]'>
                <h2 className="text-3xl font-bold">KLANTERVARINGEN</h2>
              </div>
            </div>
            <p className='max-w-[800px] text-text/70'>
              Ontdek wat onze klanten vinden van dit product
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
              { name: 'Emma de Vries', date: '12 mei 2023', rating: 5, text: 'Prachtig boeket, precies zoals op de foto. De bloemen waren vers en de bezorging was snel.' },
              { name: 'Thomas Bakker', date: '3 april 2023', rating: 5, text: 'Al jaren bestel ik hier bloemen voor speciale gelegenheden. De kwaliteit is altijd uitstekend en de service is top.' },
              { name: 'Sophie Jansen', date: '18 maart 2023', rating: 4, text: 'Mooi boeket, maar iets kleiner dan verwacht. Wel zeer goede kwaliteit bloemen die lang mooi blijven.' }
            ].map((review, index) => (
              <div key={index} className="bg-white rounded-[25px] p-6 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-text">{review.name}</h4>
                    <p className="text-text/50 text-sm">{review.date}</p>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <IoStar key={star} className={star <= review.rating ? "text-accent" : "text-text/20"} />
                    ))}
                  </div>
                </div>
                <p className="text-text/70">{review.text}</p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center">
            <button className="flex items-center justify-center px-8 py-3 border-2 border-accent bg-transparent text-text hover:bg-accent rounded-[100px] transition-all duration-300 font-medium">
              Schrijf een review
            </button>
          </div>
        </div>
      </div> */}

      {/* Related Products Section */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col gap-6 items-start mb-10 text-text">
          <div className='w-full flex flex-col-reverse md:flex-row justify-between items-start gap-5 md:gap-10'>
            <div className='max-w-[800px]'>
              <h2 className="text-3xl font-bold md:whitespace-nowrap">GERELATEERDE PRODUCTEN</h2>
            </div>
            <div className='w-full justify-end flex'>
              <Link 
                href="/shop"
                className="min-w-fit flex items-center gap-2 transition-opacity mt-2 group"
              >
                Bekijk alles
                <RiArrowRightUpLine className="text-xl group-hover:translate-x-[3px] group-hover:translate-y-[-3px] transition-transform duration-300" />
              </Link>
            </div>
          </div>
          <p className='max-w-[800px] text-text/70'>
            Ontdek meer prachtige boeketten die perfect passen bij elke gelegenheid.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 gap-y-10 md:gap-y-10 border-b border-text/10 pb-10">
          {relatedProductsLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          ) : (
            relatedProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-12 pt-8">
        <div className="flex flex-col gap-6 items-start mb-10 text-text">
          <div className='w-full flex flex-col-reverse md:flex-row justify-between items-start gap-5 md:gap-10'>
            <div className='max-w-[800px]'>
              <h2 className="text-3xl font-bold">VEELGESTELDE VRAGEN</h2>
            </div>
          </div>
          <p className='max-w-[800px] text-text/70'>
            Antwoorden op de meest gestelde vragen over dit product
          </p>
        </div>
        
        <div className="space-y-4 max-w-3xl">
          {[
            { 
              question: 'Hoe lang blijven de bloemen mooi?', 
              answer: 'Bij goede verzorging blijven onze boeketten gemiddeld 7-10 dagen mooi. Dit kan variëren afhankelijk van de bloemensoorten en de verzorging.' 
            },
            { 
              question: 'Kan ik een persoonlijke boodschap toevoegen?', 
              answer: 'Ja, tijdens het afrekenen kunt u een persoonlijke boodschap toevoegen die op een kaartje bij het boeket wordt geleverd.' 
            },
            { 
              question: 'Zijn de getoonde bloemen seizoensgebonden?', 
              answer: 'Sommige bloemen in onze boeketten zijn seizoensgebonden. Als een specifieke bloem niet beschikbaar is, vervangen we deze door een vergelijkbare bloem van dezelfde kwaliteit en kleur.' 
            },
            { 
              question: 'Kan ik het boeket aanpassen?', 
              answer: 'Voor speciale verzoeken of aanpassingen aan het boeket, neem contact met ons op via het contactformulier of telefonisch.' 
            }
          ].map((faq, index) => (
            <div 
              key={index} 
              className="border-2 rounded-[25px] overflow-hidden transition-all duration-300 border-accent/40 bg-accent/5 hover:border-accent hover:bg-accent/10"
            >
              <button 
                className="w-full text-left flex justify-between items-center p-6 font-bold text-lg text-text/80"
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.question}</span>
                {activeFaq === index ? (
                  <HiMiniChevronUp className="text-xl text-text/70" />
                ) : (
                  <HiMiniChevronDown className="text-xl text-text/70" />
                )}
              </button>
              <div 
                className={`transition-all duration-300 overflow-hidden ${
                  activeFaq === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="p-6 pt-0 text-text/70">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-10">
          <Link 
            href="/contact" 
            className="flex items-center justify-center px-10 p-3 bg-transparent text-text border-2 border-accent hover:bg-accent rounded-[100px] transition-all duration-300"
          >
            Neem contact op
          </Link>
        </div>
      </div>

      {/* Image Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center touch-manipulation">
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-accent transition-colors"
          >
            <IoClose className="text-4xl" />
          </button>
          
          <div className="relative w-full h-full max-w-[90vw] max-h-[90vh]">
            {product?.images?.edges?.length > 0 && (
              <Image
                src={product.images.edges[selectedImage].node.originalSrc}
                alt={product.title}
                fill
                className="object-contain"
                priority
                sizes="90vw"
                style={{ touchAction: "pinch-zoom" }}
              />
            )}
          </div>
          
          {/* Navigation arrows for lightbox */}
          {product?.images?.edges?.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <BiChevronLeft className="text-3xl" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <BiChevronRight className="text-3xl" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
} 