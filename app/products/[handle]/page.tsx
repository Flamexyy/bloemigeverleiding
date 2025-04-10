"use client";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/app/context/CartContext";
import { getProduct, getProducts } from "@/app/utils/shopify";
import Image from "next/image";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import CartMenu from "@/app/components/CartMenu";
import { IoMdAdd, IoMdRemove, IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { useLiked } from "@/app/context/LikedContext";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { IoStar, IoCheckmark } from "react-icons/io5";
import Link from "next/link";
import { RiArrowRightUpLine } from "react-icons/ri";
import ProductCard from "@/app/components/ProductCard";
import { ProductCardSkeleton } from "@/app/components/SkeletonLoader";
import { IoClose } from "react-icons/io5";
import { IoFlowerOutline } from "react-icons/io5";
import { IoCartOutline } from "react-icons/io5";
import { HiMiniChevronUp, HiMiniChevronDown } from "react-icons/hi2";
import { CgShoppingBag } from "react-icons/cg";

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
  const [activeTab, setActiveTab] = useState("description");
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [relatedProductsLoading, setRelatedProductsLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [productReady, setProductReady] = useState(false); // State for image animation

  // Add auto-scroll functionality to thumbnails

  // First, add a useRef for the thumbnail container
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // Then, add a useEffect to handle scrolling when selectedImage changes
  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current;
      const thumbnailHeight = 60; // Height of each thumbnail
      const gap = 4; // Gap between thumbnails
      const padding = 16; // Extra padding

      // Calculate the position to scroll to
      const scrollPosition = (thumbnailHeight + gap) * selectedImage - padding;

      // Smooth scroll to the position
      container.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [selectedImage]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setProductReady(false); // Reset ready state on new fetch
        const productData = await getProduct(handle);
        setProduct(productData);

        const allOutOfStock = productData.variants.edges.every((edge: any) => !edge.node.availableForSale || edge.node.quantityAvailable === 0);
        setIsOutOfStock(allOutOfStock);

        // Set product ready after data is fetched
        const timer = setTimeout(() => {
          setProductReady(true);
        }, 100); // Small delay for fade-in
        return () => clearTimeout(timer); // Cleanup timer
      } catch (error) {
        console.error("Error fetching product:", error);
        setProductReady(true); // Set ready even on error to remove skeleton
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
        console.error("Error fetching related products:", error);
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
      const initialOptions: { [key: string]: string } = {};

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

  const findVariantForOptions = (options: { [key: string]: string }) => {
    if (!product || !product.variants || !product.variants.edges) return null;

    return (
      product.variants.edges.find(({ node }: { node: any }) => {
        // Check if this variant matches all selected options
        if (!node.selectedOptions) return false;

        return node.selectedOptions.every((optionItem: SelectedOption) => options[optionItem.name] === optionItem.value);
      })?.node || null
    );
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
      size: selectedVariant.title !== "Default Title" ? selectedVariant.title : undefined,
      handle: product.handle,
      compareAtPrice:
        selectedVariant.compareAtPrice?.amount && parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(selectedVariant.price.amount)
          ? selectedVariant.compareAtPrice.amount
          : null,
      quantityAvailable: selectedVariant.quantityAvailable,
      availableForSale: selectedVariant.availableForSale,
    };

    try {
      // Add a small delay to ensure the loading state is visible
      await new Promise((resolve) => setTimeout(resolve, 500));

      await addToCart(cartItem);
      // Use the context function to open the cart
      setCartIsOpen(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart");
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
      compareAtPrice:
        product.compareAtPriceRange?.maxVariantPrice?.amount &&
        parseFloat(product.compareAtPriceRange.maxVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount)
          ? parseFloat(product.compareAtPriceRange.maxVariantPrice.amount)
          : null,
    };

    if (isLiked(product.id)) {
      removeLiked(product.id);
    } else {
      addToLiked({
        ...item,
        quantityAvailable: selectedVariant.quantityAvailable || 1,
      });
    }
  };

  const nextImage = () => {
    if (!product) return;
    setSelectedImage((prev) => (prev === product.images.edges.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (!product) return;
    setSelectedImage((prev) => (prev === 0 ? product.images.edges.length - 1 : prev - 1));
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
    // Disable scrolling when lightbox is open
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    // Re-enable scrolling when lightbox is closed
    document.body.style.overflow = "";
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

  // Add a useEffect to calculate scrollbar width
  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current;
      const hasScrollbar = container.scrollHeight > container.clientHeight;

      // Set padding only when scrollbar is present
      container.style.paddingRight = hasScrollbar ? "12px" : "0px";
    }
  }, [product, thumbnailContainerRef.current?.scrollHeight]);

  // Add a title effect
  useEffect(() => {
    if (product?.title) {
      document.title = `${product.title} | Bloemigeverleiding`;
    }
  }, [product]);

  if (!product && !productReady)
    return (
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col justify-center gap-6 px-4 py-6 md:flex-row lg:px-8 xl:py-10">
          {/* Images Section Skeleton */}
          <div className="flex-1 lg:max-w-[600px]">
            {/* Main Image Skeleton */}
            <div className="mb-4 aspect-square w-full animate-pulse rounded-[25px] bg-accent/30"></div>

            {/* Thumbnail Skeletons */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-[60px] w-[60px] flex-shrink-0 animate-pulse rounded-[15px] bg-accent/30"
                ></div>
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="flex-1 space-y-6 lg:max-w-[400px]">
            {/* Title and Price */}
            <div className="space-y-3">
              <div className="h-8 w-3/4 animate-pulse rounded-[25px] bg-accent/30"></div>
              <div className="h-6 w-1/4 animate-pulse rounded-[25px] bg-accent/30"></div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded-[25px] bg-accent/30"></div>
              <div className="h-4 w-full animate-pulse rounded-[25px] bg-accent/30"></div>
              <div className="h-4 w-2/3 animate-pulse rounded-[25px] bg-accent/30"></div>
            </div>

            {/* Variant Selection */}
            <div className="space-y-3">
              <div className="h-5 w-1/4 animate-pulse rounded-[25px] bg-accent/30"></div>
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-16 animate-pulse rounded-[50px] bg-accent/30"
                  ></div>
                ))}
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-32 animate-pulse rounded-[50px] bg-accent/30"></div>
                <div className="h-12 w-full animate-pulse rounded-[50px] bg-accent/30"></div>
              </div>
              <div className="h-12 w-full animate-pulse rounded-[50px] bg-accent/30"></div>
            </div>
          </div>
        </div>
      </div>
    );

  if (!product && productReady)
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-12 text-center">
        <p className="text-text/70">Product niet gevonden.</p>
        <Link
          href="/shop"
          className="mt-4 inline-block rounded-[50px] bg-accent px-8 py-3 text-text transition-colors hover:bg-accent/70"
        >
          Terug naar de shop
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="flex flex-col justify-center gap-6 px-4 py-6 md:flex-row lg:px-8 xl:py-10">
        {/* Images Section */}
        <div className="flex-1 lg:max-w-[600px]">
          {/* Desktop Layout */}
          <div className="hidden gap-4 lg:flex">
            {/* Thumbnails - Side */}
            <div className="relative flex h-[500px] flex-col gap-2">
              <div
                ref={thumbnailContainerRef}
                className="scrollbar-thin scrollbar-thumb-accent/40 scrollbar-track-transparent flex h-full flex-col gap-1 overflow-y-auto overflow-x-hidden"
                style={{
                  paddingRight:
                    thumbnailContainerRef.current && thumbnailContainerRef.current.scrollHeight > (thumbnailContainerRef.current.clientHeight || 0)
                      ? "12px"
                      : "0px",
                }}
              >
                {product.images.edges.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded-[35%] transition-all ${
                      selectedImage === index ? "" : "opacity-30 hover:opacity-80"
                    }`}
                  >
                    <div className="relative aspect-square h-full w-full overflow-hidden">
                      {image.node.originalSrc ? (
                        <Image
                          src={image.node.originalSrc}
                          alt={image.node.altText || product.title}
                          fill
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-accent/20">
                          <CgShoppingBag className="text-5xl text-text/50" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Image */}
            <div className="flex-1">
              <div
                className={`relative aspect-square cursor-zoom-in overflow-hidden rounded-[25px] transition-opacity duration-300 ease-in-out ${
                  productReady ? "opacity-100" : "opacity-0"
                }`}
                onClick={openLightbox}
              >
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
                      className={`h-2 w-2 rounded-full transition-all ${isSelected ? "w-4 bg-white" : "bg-white/60 hover:bg-white/80"}`}
                      style={{
                        display: "inline-block",
                        margin: "0 4px",
                      }}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  )}
                >
                  {product.images.edges.map((image: any, index: number) => (
                    <div
                      key={index}
                      className="aspect-square h-full w-full"
                    >
                      {image.node.originalSrc ? (
                        <Image
                          src={image.node.originalSrc}
                          alt={image.node.altText || product.title}
                          fill
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-accent/20">
                          <CgShoppingBag className="text-5xl text-text/50" />
                        </div>
                      )}
                    </div>
                  ))}
                </Carousel>

                {/* Navigation Arrows */}
                <div className="absolute bottom-4 right-4 z-10 hidden gap-2 md:flex">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening lightbox when clicking arrows
                      prevImage();
                    }}
                    className="rounded-full bg-cream/80 p-2 text-text transition-colors hover:bg-cream"
                    aria-label="Previous image"
                  >
                    <BiChevronLeft className="text-xl" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening lightbox when clicking arrows
                      nextImage();
                    }}
                    className="rounded-full bg-cream/80 p-2 text-text transition-colors hover:bg-cream"
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
            <div
              className={`relative overflow-hidden rounded-[30px] transition-opacity duration-300 ease-in-out ${
                productReady ? "opacity-100" : "opacity-0"
              }`}
            >
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
                    className={`h-2 w-2 rounded-full transition-all ${isSelected ? "w-4 bg-white" : "bg-white/60 hover:bg-white/80"}`}
                    style={{
                      display: "inline-block",
                      margin: "0 4px",
                    }}
                    aria-label={`Go to image ${index + 1}`}
                  />
                )}
              >
                {product.images.edges.map((image: any, index: number) => (
                  <div
                    key={index}
                    className="aspect-square h-full w-full"
                  >
                    {image.node.originalSrc ? (
                      <Image
                        src={image.node.originalSrc}
                        alt={image.node.altText || product.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-accent/20">
                        <CgShoppingBag className="text-5xl text-text/50" />
                      </div>
                    )}
                  </div>
                ))}
              </Carousel>

              {/* Navigation Arrows */}
              <div className="absolute bottom-4 right-4 z-10 hidden gap-2 md:flex">
                <button
                  onClick={prevImage}
                  className="rounded-full bg-white/90 p-2 transition-colors hover:bg-white"
                  aria-label="Previous image"
                >
                  <BiChevronLeft className="text-xl" />
                </button>
                <button
                  onClick={nextImage}
                  className="rounded-full bg-white/90 p-2 transition-colors hover:bg-white"
                  aria-label="Next image"
                >
                  <BiChevronRight className="text-xl" />
                </button>
              </div>
            </div>

            {/* Thumbnails - Bottom Scrollable */}
            <div className="mt-2 grid grid-cols-5 gap-1">
              {product.images.edges.map((image: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-[35%] transition-all ${
                    selectedImage === index ? "border-text" : "border-transparent opacity-30 hover:opacity-80"
                  }`}
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-accent/10">
                    {image.node.originalSrc ? (
                      <Image
                        src={image.node.originalSrc}
                        alt={image.node.altText || product.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-accent/20">
                        <CgShoppingBag className="text-5xl text-text/50" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-4 lg:max-w-[400px]">
          <div>
            <h1 className="text-3xl font-bold uppercase text-text">{product.title}</h1>
            <div className="mt-1 flex items-center gap-2">
              {product.priceRange?.maxVariantPrice?.amount &&
              product.priceRange?.minVariantPrice?.amount &&
              parseFloat(product.priceRange.maxVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount) ? (
                <p className="text-xl font-bold text-text">From €{parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}</p>
              ) : product.compareAtPriceRange?.maxVariantPrice?.amount &&
                parseFloat(product.compareAtPriceRange.maxVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount) ? (
                <>
                  <p className="text-2xl font-bold text-red-400">€{parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}</p>
                  <p className="text-md text-text/50 line-through">€{parseFloat(product.compareAtPriceRange.maxVariantPrice.amount).toFixed(2)}</p>
                </>
              ) : (
                <p className="text-xl font-bold text-text">€{parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-md leading-relaxed text-text/70">{product.description}</p>
          </div>

          {/* Variant Selection */}
          {product?.variants?.edges?.length > 1 && (
            <div className="space-y-2 pb-4">
              <label className="text-md block font-medium text-text">Variant</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.edges.map((edge: any) => (
                  <button
                    key={edge.node.id}
                    onClick={() => setSelectedVariant(edge.node)}
                    className={`rounded-full border px-4 py-2 ${
                      selectedVariant?.id === edge.node.id ? "border-accent bg-accent text-text" : "border-text/20 text-text hover:border-accent"
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
            <div className="items-left flex-button flex gap-2 sm:gap-4">
              {/* Quantity Selector */}
              <div className="flex w-fit items-center rounded-[50px] border-2 border-accent bg-white">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="rounded-l-[50px] p-3 py-[15px] text-text transition-colors hover:bg-accent/50"
                >
                  <IoMdRemove />
                </button>
                <span className="w-12 text-center font-medium text-text">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="rounded-r-[50px] p-3 py-[15px] text-text transition-colors hover:bg-accent/50"
                >
                  <IoMdAdd />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !canAddToCart()}
                className={`flex w-full items-center justify-center gap-2 rounded-[100px] px-6 py-3 font-medium transition-all duration-300 ${
                  !canAddToCart() ? "cursor-not-allowed border border-accent bg-accent/50 text-text/50" : "bg-accent text-text hover:bg-accent/70"
                }`}
              >
                {isAddingToCart ? (
                  <>
                    <span className="mr-2 animate-spin">
                      <IoFlowerOutline className="text-xl" />
                    </span>
                    Toevoegen...
                  </>
                ) : !canAddToCart() ? (
                  "Uitverkocht"
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
              className={`flex w-full items-center justify-center gap-2 rounded-[50px] p-3 text-sm transition-colors ${
                isLiked(product?.id)
                  ? "border-2 border-text bg-text text-white hover:border-text/80 hover:bg-text/80"
                  : "border-2 border-accent text-text hover:bg-accent"
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
      <div className="mx-auto max-w-[1600px] px-4 py-12 lg:px-8">
        <div className="mb-8 flex overflow-x-auto border-b border-text/10">
          <button
            onClick={() => setActiveTab("description")}
            className={`whitespace-nowrap px-6 py-3 font-medium transition-colors ${
              activeTab === "description" ? "border-b-2 border-accent text-text" : "text-text/70 hover:text-text"
            }`}
          >
            Beschrijving
          </button>
          <button
            onClick={() => setActiveTab("delivery")}
            className={`whitespace-nowrap px-6 py-3 font-medium transition-colors ${
              activeTab === "delivery" ? "border-b-2 border-accent text-text" : "text-text/70 hover:text-text"
            }`}
          >
            Verzending & Levering
          </button>
        </div>

        <div className="max-w-[1600px]">
          {activeTab === "description" && (
            <div className="space-y-4 text-text/70">
              <p>{product.description || "Geen beschrijving beschikbaar."}</p>
              <p>
                Onze boeketten worden met de grootste zorg samengesteld door onze ervaren bloemisten. We gebruiken alleen de mooiste en verste bloemen
                om een prachtig arrangement te creëren dat perfect past bij elke gelegenheid.
              </p>
            </div>
          )}

          {activeTab === "delivery" && (
            <div className="space-y-6 text-text/70">
              <div>
                <h3 className="mb-2 text-lg font-bold text-text">Bezorgtijd</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Bezorging (5-7 werkdagen)</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-bold text-text">Verzendkosten</h3>
                <p>De verzendkosten zijn afhankelijk van de gekozen bezorgoptie en de bestemming:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Bezorging binnen Nederland: €6,95</li>
                  <li>Bezorging binnen België: €11,95</li>
                  <li>Gratis verzending bij bestellingen boven €150</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-bold text-text">Leveringsgebied</h3>
                <p>Wij bezorgen in heel Nederland en België. Internationale levering is bij ons niet mogelijk.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mx-auto max-w-[1600px] px-4 py-12 lg:px-8">
        <div className="mb-10 flex flex-col items-start gap-6 text-text">
          <div className="flex w-full flex-col-reverse items-start justify-between gap-5 md:flex-row md:gap-10">
            <div className="max-w-[800px]">
              <h2 className="text-3xl font-bold md:whitespace-nowrap">GERELATEERDE PRODUCTEN</h2>
            </div>
            <div className="flex w-full justify-end">
              <Link
                href="/shop"
                className="group mt-2 flex min-w-fit items-center gap-2 transition-opacity"
              >
                Bekijk alles
                <RiArrowRightUpLine className="text-xl transition-transform duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px]" />
              </Link>
            </div>
          </div>
          <p className="max-w-[800px] text-text/70">Ontdek meer prachtige zijden boeketten die perfect passen bij elke gelegenheid.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 gap-y-10 border-b border-text/10 pb-10 md:grid-cols-3 md:gap-4 md:gap-y-10 lg:grid-cols-4">
          {relatedProductsLoading
            ? Array.from({ length: 4 }).map((_, index) => <ProductCardSkeleton key={index} />)
            : relatedProducts.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mx-auto max-w-[1600px] px-4 py-12 pt-8 lg:px-8">
        <div className="mb-10 flex flex-col items-start gap-6 text-text">
          <div className="flex w-full flex-col-reverse items-start justify-between gap-5 md:flex-row md:gap-10">
            <div className="max-w-[800px]">
              <h2 className="text-3xl font-bold">VEELGESTELDE VRAGEN</h2>
            </div>
          </div>
          <p className="max-w-[800px] text-text/70">Antwoorden op de meest gestelde vragen over dit product</p>
        </div>

        <div className="max-w-3xl space-y-4">
          {[
            {
              question: "Hoe lang blijven de bloemen mooi?",
              answer:
                "Bij goede verzorging blijven onze boeketten gemiddeld 7-10 dagen mooi. Dit kan variëren afhankelijk van de bloemensoorten en de verzorging.",
            },
            {
              question: "Kan ik een persoonlijke boodschap toevoegen?",
              answer: "Ja, tijdens het afrekenen kunt u een persoonlijke boodschap toevoegen die op een kaartje bij het boeket wordt geleverd.",
            },
            {
              question: "Zijn de getoonde bloemen seizoensgebonden?",
              answer:
                "Sommige bloemen in onze boeketten zijn seizoensgebonden. Als een specifieke bloem niet beschikbaar is, vervangen we deze door een vergelijkbare bloem van dezelfde kwaliteit en kleur.",
            },
            {
              question: "Kan ik het boeket aanpassen?",
              answer: "Voor speciale verzoeken of aanpassingen aan het boeket, neem contact met ons op via het contactformulier of telefonisch.",
            },
          ].map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[25px] border-2 border-accent/40 bg-accent/5 transition-all duration-300 hover:border-accent hover:bg-accent/10"
            >
              <button
                className="flex w-full items-center justify-between p-6 text-left text-lg font-bold text-text/80"
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.question}</span>
                {activeFaq === index ? <HiMiniChevronUp className="text-xl text-text/70" /> : <HiMiniChevronDown className="text-xl text-text/70" />}
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${activeFaq === index ? "max-h-96" : "max-h-0"}`}>
                <div className="p-6 pt-0 text-text/70">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/contact"
            className="flex items-center justify-center rounded-[100px] border-2 border-accent bg-transparent p-3 px-10 text-text transition-all duration-300 hover:bg-accent"
          >
            Neem contact op
          </Link>
        </div>
      </div>

      {/* Image Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex touch-manipulation items-center justify-center bg-black/90">
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 text-white transition-colors hover:text-accent"
          >
            <IoClose className="text-4xl" />
          </button>

          <div className="relative h-full max-h-[90vh] w-full max-w-[90vw]">
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
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              >
                <BiChevronLeft className="text-3xl" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
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
